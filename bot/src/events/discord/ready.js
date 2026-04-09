'use strict';

const logger = require('../../utils/logger');

/**
 * Evento: ready
 * Se dispara cuando el bot de Discord se conecta correctamente.
 * Inicializa el LavalinkManager e intenta conectar a todos los nodos.
 */
async function handleReady(client) {
  logger.info(`[Discord] Bot conectado como: ${client.user.tag} (ID: ${client.user.id})`);
  logger.info(`[Discord] Servidores activos: ${client.guilds.cache.size}`);

  // Establecer el estado de actividad del bot
  client.user.setPresence({
    status: 'online',
    activities: [
      {
        name: '/help | 🎵 Música en Discord',
        type: 2, // 2 = Listening
      },
    ],
  });

  // Iniciar la conexión con Lavalink
  // initiateLavalinkConnect necesita el raw VOICE_STATE_UPDATE y VOICE_SERVER_UPDATE
  // de Discord para funcionar. Esto se maneja en los eventos de Discord.
  try {
    await client.lavalink.init(
      { id: client.user.id, username: client.user.username },
      { id: client.user.id, username: client.user.username }
    );
    logger.info('[Lavalink] Manager inicializado. Intentando conectar a nodos...');
  } catch (error) {
    logger.error(`[Lavalink] Error al inicializar el manager: ${error.message}`);
  }
}

module.exports = { handleReady };
