'use strict';

const logger = require('../../utils/logger');

/**
 * Evento: trackEnd
 * Se dispara cuando un track termina de reproducirse.
 * lavalink-client con autoSkip=true maneja la siguiente canción automáticamente.
 * Aquí solo registramos el evento para diagnóstico.
 *
 * @param {import('lavalink-client').Player} player
 * @param {import('lavalink-client').Track} track
 * @param {object} payload - Payload de Lavalink con la razón de fin
 */
function handleTrackEnd(player, track, payload) {
  const reason = payload?.reason || 'unknown';
  logger.debug(`[TrackEnd] Guild ${player.guildId}: "${track?.info?.title}" — razón: ${reason}`);
}

module.exports = { handleTrackEnd };
