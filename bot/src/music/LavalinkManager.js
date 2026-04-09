'use strict';

const { LavalinkManager } = require('lavalink-client');
const config = require('../config/config');
const logger = require('../utils/logger');

/**
 * Inicializa y configura el LavalinkManager.
 * Se llama una vez desde index.js y se adjunta al cliente de Discord.
 *
 * @param {import('discord.js').Client} client - El cliente de Discord
 * @returns {LavalinkManager}
 */
function createLavalinkManager(client) {
  const manager = new LavalinkManager({
    nodes: [
      {
        authorization: config.lavalink.password,
        host: config.lavalink.host,
        port: config.lavalink.port,
        id: config.lavalink.nodeId,
        secure: config.lavalink.secure,
        // Tiempo de espera para requests al nodo
        requestSignalTimeoutMS: 3000,
        closeOnError: true,
        heartBeatInterval: 30_000,
        enablePingOnStatsCheck: true,
        retryDelay: 10_000,
        retryAmount: 10,
      },
    ],

    // Esta función es OBLIGATORIA: envía los payloads de voz a Discord
    sendToShard: (guildId, payload) => {
      const guild = client.guilds.cache.get(guildId);
      if (guild) {
        guild.shard.send(payload);
      }
    },

    // Configuración de identidad del bot para Lavalink
    client: {
      id: config.discord.clientId,
      username: 'MusicBot',
    },

    // Opciones globales de los players
    playerOptions: {
      // true = Lavalink saltará automáticamente al siguiente track cuando termine uno
      // false = lo manejamos nosotros manualmente (más control)
      // Usamos true para simplicidad
      applyVolumeAsFilter: false,

      // Actualiza la posición del reproductor cada 500ms
      clientBasedPositionUpdateInterval: 500,

      // Plataforma de búsqueda por defecto
      defaultSearchPlatform: config.bot.defaultSearchPlatform,

      // El volumen real = volume * volumeDecrementer
      // 0.75 significa que al poner 100% el volumen real es 75% (evita distorsión)
      volumeDecrementer: 0.75,

      // Qué hacer si el bot es desconectado de voz
      onDisconnect: {
        autoReconnect: true,
        destroyPlayer: false,
      },

      // Qué hacer cuando la cola queda vacía
      onEmptyQueue: {
        // Destruir el player 5 minutos después de que la cola esté vacía
        destroyAfterMs: config.bot.autoDisconnectMs,
        // Puedes poner una función aquí para acciones adicionales:
        // autoPlayFunction: async (player, lastPlayedTrack) => { ... }
      },

      // Usar datos no resueltos (unresolved tracks, ej: de Spotify antes de resolverse)
      useUnresolvedData: true,
    },

    // Opciones de la cola
    queueOptions: {
      // Cuántos tracks previos guardar en historial
      maxPreviousTracks: 25,
    },

    // Opciones de búsqueda de tracks sin resolver
    // (cuando Lavalink necesita resolver un track de Spotify, Deezer, etc.)
    advancedOptions: {
      maxFilterFixDuration: 600_000, // 10 min máx para fix de filtros
      debugOptions: {
        noAudio: false,
        playerDestroy: {
          dontThrowError: false,
          debugLog: config.isDev,
        },
      },
    },
  });

  // ========================
  // EVENTOS DEL NODE MANAGER
  // ========================

  manager.nodeManager.on('create', (node) => {
    logger.info(`[Lavalink] Nodo creado: ${node.id} (${node.options.host}:${node.options.port})`);
  });

  manager.nodeManager.on('connect', (node) => {
    logger.info(`[Lavalink] Nodo conectado: ${node.id}`);
  });

  manager.nodeManager.on('reconnecting', (node) => {
    logger.warn(`[Lavalink] Nodo reconectando: ${node.id}`);
  });

  manager.nodeManager.on('disconnect', (node, reason) => {
    logger.warn(`[Lavalink] Nodo desconectado: ${node.id} — Razón: ${reason?.reason || 'desconocida'} (código ${reason?.code})`);
  });

  manager.nodeManager.on('error', (node, error) => {
    logger.error(`[Lavalink] Error en nodo ${node.id}: ${error.message}`);
  });

  manager.nodeManager.on('raw', (node, payload) => {
    // Log muy detallado, solo en debug
    logger.debug(`[Lavalink] Raw event en nodo ${node.id}: ${payload.op}`);
  });

  return manager;
}

module.exports = { createLavalinkManager };
