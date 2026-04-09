'use strict';

const logger = require('../../utils/logger');
const { infoEmbed } = require('../../utils/embeds');

/**
 * Evento: voiceStateUpdate
 * Maneja cambios en el estado de voz de los usuarios.
 *
 * Casos importantes:
 * 1. El bot es movido a otro canal de voz → actualizar la info del player
 * 2. El bot es desconectado del canal → destruir el player
 * 3. Todos los humanos abandonan el canal del bot → auto-desconectarse
 */
async function handleVoiceStateUpdate(oldState, newState) {
  const client = oldState.client || newState.client;
  if (!client) return;

  const botId = client.user?.id;
  if (!botId) return;

  // =============================================
  // CASO 1: El bot fue afectado
  // =============================================
  if (oldState.id === botId || newState.id === botId) {
    const player = client.lavalink?.getPlayer(oldState.guild.id);
    if (!player) return;

    // El bot fue desconectado del canal de voz
    if (oldState.channelId && !newState.channelId) {
      logger.info(`[VoiceState] Bot desconectado del canal de voz en guild ${oldState.guild.id}`);
      try {
        // Notificar al canal de texto
        const textChannel = player.textChannelId
          ? client.channels.cache.get(player.textChannelId)
          : null;

        if (textChannel) {
          await textChannel.send({
            embeds: [infoEmbed('Desconectado', 'El bot fue desconectado del canal de voz. La cola fue limpiada.')],
          });
        }

        await player.destroy();
      } catch (error) {
        logger.error(`[VoiceState] Error al destruir player tras desconexión: ${error.message}`);
      }
      return;
    }

    // El bot fue movido a otro canal de voz
    if (oldState.channelId && newState.channelId && oldState.channelId !== newState.channelId) {
      logger.info(`[VoiceState] Bot movido de canal en guild ${oldState.guild.id}: ${oldState.channelId} → ${newState.channelId}`);
      // Lavalink maneja esto automáticamente vía los payloads de VOICE_SERVER_UPDATE
    }

    return;
  }

  // =============================================
  // CASO 2: Un usuario abandonó el canal del bot
  // =============================================
  const player = client.lavalink?.getPlayer(oldState.guild.id);
  if (!player || !player.voiceChannelId) return;

  // Solo aplica si el usuario estaba en el canal del bot
  if (oldState.channelId !== player.voiceChannelId) return;

  // Verificar si quedan humanos en el canal
  const botVoiceChannel = oldState.guild.channels.cache.get(player.voiceChannelId);
  if (!botVoiceChannel) return;

  const humanMembers = botVoiceChannel.members.filter((m) => !m.user.bot);

  if (humanMembers.size === 0) {
    logger.info(`[VoiceState] Todos los humanos abandonaron el canal en guild ${oldState.guild.id}. Iniciando auto-desconexión...`);

    // Pausar la reproducción
    if (player.playing && !player.paused) {
      await player.pause(true).catch(() => {});
    }

    // Notificar al canal de texto con un delay visual
    const textChannel = player.textChannelId
      ? client.channels.cache.get(player.textChannelId)
      : null;

    if (textChannel) {
      await textChannel
        .send({
          embeds: [
            infoEmbed(
              'Canal vacío',
              'Todos los usuarios abandonaron el canal de voz. La reproducción fue pausada.\nSi vuelves, usa `/resume` para continuar. El bot se desconectará si nadie vuelve.'
            ),
          ],
        })
        .catch(() => {});
    }
  }
}

module.exports = { handleVoiceStateUpdate };
