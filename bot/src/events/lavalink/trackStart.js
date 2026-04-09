'use strict';

const { nowPlayingEmbed } = require('../../utils/embeds');
const logger = require('../../utils/logger');

/**
 * Evento: trackStart
 * Se dispara cuando Lavalink empieza a reproducir un nuevo track.
 * Envía un embed de "Ahora reproduciendo" al canal de texto del servidor.
 *
 * @param {import('lavalink-client').Player} player
 * @param {import('lavalink-client').Track} track
 */
async function handleTrackStart(player, track) {
  try {
    const channel = player.textChannelId
      ? player.client?.channels?.cache?.get(player.textChannelId)
      : null;

    if (!channel) {
      logger.debug(`[TrackStart] No se encontró canal de texto para guild ${player.guildId}`);
      return;
    }

    // El requester lo guardamos en track.userData al hacer la búsqueda
    const requester = track.userData?.requester || null;

    const embed = nowPlayingEmbed(track, requester);
    await channel.send({ embeds: [embed] });

    logger.info(`[TrackStart] Guild ${player.guildId}: "${track.info.title}" por ${track.info.author}`);
  } catch (error) {
    logger.error(`[TrackStart] Error al enviar embed: ${error.message}`);
  }
}

module.exports = { handleTrackStart };
