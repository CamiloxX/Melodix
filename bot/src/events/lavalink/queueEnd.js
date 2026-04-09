'use strict';

const { infoEmbed } = require('../../utils/embeds');
const logger = require('../../utils/logger');

/**
 * Evento: queueEnd
 * Se dispara cuando la cola queda vacía y no hay más tracks que reproducir.
 * Notifica al usuario y muestra un mensaje de despedida.
 * El player se destruye automáticamente después de onEmptyQueue.destroyAfterMs.
 *
 * @param {import('lavalink-client').Player} player
 * @param {import('lavalink-client').Track} lastTrack - Último track reproducido
 */
async function handleQueueEnd(player, lastTrack) {
  logger.info(`[QueueEnd] Guild ${player.guildId}: Cola vacía. Último track: "${lastTrack?.info?.title || 'ninguno'}"`);

  try {
    const channel = player.textChannelId
      ? player.client?.channels?.cache?.get(player.textChannelId)
      : null;

    if (!channel) return;

    const embed = infoEmbed(
      'Cola vacía',
      '¡Se terminó la música! 🎵\n\nUsa `/play` para añadir más canciones.\nEl bot se desconectará automáticamente en unos minutos si no se añade nada.'
    );

    await channel.send({ embeds: [embed] });
  } catch (error) {
    logger.error(`[QueueEnd] Error al enviar notificación: ${error.message}`);
  }
}

module.exports = { handleQueueEnd };
