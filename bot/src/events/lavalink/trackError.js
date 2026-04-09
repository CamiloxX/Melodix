'use strict';

const { errorEmbed } = require('../../utils/embeds');
const logger = require('../../utils/logger');

/**
 * Evento: trackError
 * Se dispara cuando Lavalink no puede reproducir un track.
 * Notifica al usuario con un mensaje de error en el canal de texto.
 *
 * @param {import('lavalink-client').Player} player
 * @param {import('lavalink-client').Track} track
 * @param {object} payload - Payload de error de Lavalink
 */
async function handleTrackError(player, track, payload) {
  const errorMsg = payload?.exception?.message || payload?.error || 'Error desconocido al reproducir el track';
  const severity = payload?.exception?.severity || 'UNKNOWN';

  logger.error(`[TrackError] Guild ${player.guildId}: "${track?.info?.title}" — ${severity}: ${errorMsg}`);

  try {
    const channel = player.textChannelId
      ? player.client?.channels?.cache?.get(player.textChannelId)
      : null;

    if (!channel) return;

    const trackTitle = track?.info?.title || 'Canción desconocida';
    const trackSource = track?.info?.sourceName || 'fuente desconocida';

    let userMessage = `No se pudo reproducir **${trackTitle}**.`;

    // Mensajes más descriptivos según la severidad y el error
    if (errorMsg.includes('Video unavailable') || errorMsg.includes('not available')) {
      userMessage += '\nEl video no está disponible en tu región o fue eliminado.';
    } else if (errorMsg.includes('429') || errorMsg.includes('rate limit')) {
      userMessage += '\nDemasiadas solicitudes. Intenta de nuevo en un momento.';
    } else if (errorMsg.includes('403') || errorMsg.includes('forbidden')) {
      userMessage += '\nAcceso denegado a esta fuente. Puede que requiera autenticación.';
    } else if (severity === 'FAULT') {
      userMessage += '\nError interno del servidor de audio. El track fue omitido.';
    } else {
      userMessage += `\nEl track fue omitido automáticamente.`;
    }

    if (trackSource !== 'fuente desconocida') {
      userMessage += `\n\n*Fuente: ${trackSource}*`;
    }

    const embed = errorEmbed('Error de reproducción', userMessage);
    await channel.send({ embeds: [embed] });
  } catch (err) {
    logger.error(`[TrackError] Error al enviar notificación: ${err.message}`);
  }
}

module.exports = { handleTrackError };
