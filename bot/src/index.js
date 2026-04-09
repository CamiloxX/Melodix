'use strict';

// Cargar variables de entorno ANTES de cualquier otra importación
require('dotenv').config();

const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { readdirSync } = require('fs');
const path = require('path');

const config = require('./config/config');
const logger = require('./utils/logger');
const { createLavalinkManager } = require('./music/LavalinkManager');

// Importar handlers de eventos de Lavalink
const { handleTrackStart } = require('./events/lavalink/trackStart');
const { handleTrackEnd } = require('./events/lavalink/trackEnd');
const { handleTrackError } = require('./events/lavalink/trackError');
const { handleQueueEnd } = require('./events/lavalink/queueEnd');

// Importar handlers de eventos de Discord
const { handleReady } = require('./events/discord/ready');
const { handleInteractionCreate } = require('./events/discord/interactionCreate');
const { handleVoiceStateUpdate } = require('./events/discord/voiceStateUpdate');

logger.info('==============================================');
logger.info('  Iniciando Discord Music Bot...');
logger.info(`  Entorno: ${config.nodeEnv}`);
logger.info('==============================================');

// ============================================================
// CREAR CLIENTE DE DISCORD
// ============================================================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates, // OBLIGATORIO para Lavalink
    GatewayIntentBits.GuildMessages,
  ],
  // Configuración de caché para optimizar memoria
  sweepers: {
    messages: {
      interval: 300, // segundos
      lifetime: 1800, // segundos
    },
  },
});

// ============================================================
// CARGAR COMANDOS
// ============================================================
client.commands = new Collection();

function loadCommands() {
  const commandsPath = path.join(__dirname, 'commands');
  const categories = readdirSync(commandsPath);

  let totalLoaded = 0;

  for (const category of categories) {
    const categoryPath = path.join(commandsPath, category);

    let files;
    try {
      files = readdirSync(categoryPath).filter((f) => f.endsWith('.js'));
    } catch {
      // Si no es un directorio, saltar
      continue;
    }

    for (const file of files) {
      try {
        const commandPath = path.join(categoryPath, file);
        const command = require(commandPath);

        if (!command.data || !command.execute) {
          logger.warn(`[Commands] El archivo ${file} no tiene 'data' o 'execute'. Saltando.`);
          continue;
        }

        client.commands.set(command.data.name, command);
        totalLoaded++;
        logger.debug(`[Commands] Cargado: /${command.data.name}`);
      } catch (err) {
        logger.error(`[Commands] Error al cargar ${file}: ${err.message}`);
      }
    }
  }

  logger.info(`[Commands] ${totalLoaded} comandos cargados correctamente.`);
}

loadCommands();

// ============================================================
// INICIALIZAR LAVALINK MANAGER
// ============================================================
// Se adjunta al client para que sea accesible desde los comandos
client.lavalink = createLavalinkManager(client);

// Adjuntar el client al manager para que los event handlers puedan acceder a él
// (necesario para enviar mensajes en trackStart, queueEnd, etc.)
// Esto se hace asignando client a cada player cuando se crea — ver abajo

// ============================================================
// REGISTRAR EVENTOS DE LAVALINK
// ============================================================
client.lavalink.on('trackStart', (player, track, payload) => {
  // Inyectar referencia al client en el player para los handlers
  if (!player.client) player.client = client;
  handleTrackStart(player, track, payload);
});

client.lavalink.on('trackEnd', (player, track, payload) => {
  handleTrackEnd(player, track, payload);
});

client.lavalink.on('trackError', (player, track, payload) => {
  if (!player.client) player.client = client;
  handleTrackError(player, track, payload);
});

client.lavalink.on('queueEnd', (player, track, payload) => {
  if (!player.client) player.client = client;
  handleQueueEnd(player, track, payload);
});

client.lavalink.on('playerCreate', (player) => {
  player.client = client;
  logger.debug(`[Lavalink] Player creado para guild: ${player.guildId}`);
});

client.lavalink.on('playerDestroy', (player, reason) => {
  logger.debug(`[Lavalink] Player destruido para guild: ${player.guildId} — Razón: ${reason || 'manual'}`);
});

client.lavalink.on('playerDisconnect', (player, moved) => {
  logger.debug(`[Lavalink] Player desconectado en guild: ${player.guildId} — Movido: ${moved}`);
});

// ============================================================
// REGISTRAR EVENTOS DE DISCORD
// ============================================================
client.once('ready', () => handleReady(client));

client.on('interactionCreate', (interaction) => handleInteractionCreate(interaction));

client.on('voiceStateUpdate', (oldState, newState) => handleVoiceStateUpdate(oldState, newState));

// CRÍTICO: Reenviar los eventos de voz de Discord a Lavalink
// Sin esto, Lavalink no puede conectarse a los canales de voz
client.on('raw', (data) => {
  if (['VOICE_STATE_UPDATE', 'VOICE_SERVER_UPDATE'].includes(data.t)) {
    client.lavalink.sendRawData(data);
  }
});

// Manejo de errores no capturados
client.on('error', (error) => {
  logger.error(`[Discord] Error del cliente: ${error.message}`);
});

process.on('unhandledRejection', (error) => {
  logger.error(`[Process] Promesa rechazada sin manejar: ${error?.message || error}`);
});

process.on('uncaughtException', (error) => {
  logger.error(`[Process] Excepción no capturada: ${error.message}`);
  // En producción, considera reiniciar el proceso aquí
  // process.exit(1);
});

// ============================================================
// SEÑALES DE SISTEMA (para Docker / graceful shutdown)
// ============================================================
async function gracefulShutdown(signal) {
  logger.info(`[Process] Señal recibida: ${signal}. Cerrando gracefully...`);

  try {
    // Destruir todos los players activos
    for (const [guildId, player] of client.lavalink.players) {
      await player.destroy().catch(() => {});
      logger.debug(`[Process] Player destruido para guild: ${guildId}`);
    }
  } catch (err) {
    logger.error(`[Process] Error al destruir players: ${err.message}`);
  }

  client.destroy();
  logger.info('[Process] Bot cerrado correctamente.');
  process.exit(0);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// ============================================================
// CONECTAR A DISCORD
// ============================================================
logger.info('[Discord] Conectando a Discord...');

client.login(config.discord.token).catch((err) => {
  logger.error(`[Discord] Error fatal al conectar: ${err.message}`);
  logger.error('Verifica que DISCORD_TOKEN sea correcto en tu archivo .env');
  process.exit(1);
});
