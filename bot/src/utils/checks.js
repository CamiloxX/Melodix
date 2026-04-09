'use strict';

const { MessageFlags } = require('discord.js');
const { errorEmbed } = require('./embeds');

/**
 * Guardias y validaciones reutilizables para los slash commands.
 * Centralizar estas verificaciones:
 *   - evita duplicación de código entre comandos
 *   - garantiza que NINGÚN comando de control olvide chequear el mismo canal de voz
 *   - hace más fácil auditar las reglas de seguridad
 */

// ============================================================
// COOLDOWN POR USUARIO (anti-spam)
// ============================================================
// Map<userId, timestamp del último comando permitido>
const cooldowns = new Map();
const COOLDOWN_MS = 2000; // 2s entre comandos del mismo usuario

// Limpieza periódica para evitar leak de memoria si el bot corre mucho tiempo
// Se purgan entradas más viejas que 1 minuto.
setInterval(() => {
  const now = Date.now();
  for (const [userId, ts] of cooldowns) {
    if (now - ts > 60_000) cooldowns.delete(userId);
  }
}, 60_000).unref?.();

/**
 * Devuelve ms restantes de cooldown o 0 si puede ejecutar.
 * Si puede ejecutar, registra el timestamp actual.
 * @param {string} userId
 * @returns {number} ms restantes (0 = ok)
 */
function checkCooldown(userId) {
  const now = Date.now();
  const last = cooldowns.get(userId) || 0;
  const elapsed = now - last;
  if (elapsed < COOLDOWN_MS) return COOLDOWN_MS - elapsed;
  cooldowns.set(userId, now);
  return 0;
}

// ============================================================
// VALIDACIÓN: usuario debe estar en el mismo canal de voz que el bot
// ============================================================

/**
 * Verifica que el usuario esté en el mismo canal de voz que el player.
 * Si no lo está, responde con un error efímero y devuelve false.
 *
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 * @param {import('lavalink-client').Player} player
 * @returns {Promise<boolean>} true si pasa la validación
 */
async function requireSameVoiceChannel(interaction, player) {
  const memberChannelId = interaction.member?.voice?.channelId;

  if (!memberChannelId) {
    await safeReply(interaction, errorEmbed(
      'Sin canal de voz',
      'Debes estar en un canal de voz para usar este comando.'
    ));
    return false;
  }

  if (memberChannelId !== player.voiceChannelId) {
    await safeReply(interaction, errorEmbed(
      'Canal incorrecto',
      'Debes estar en el **mismo canal de voz** que el bot para controlar la reproducción.'
    ));
    return false;
  }

  return true;
}

/**
 * Verifica que exista un player activo para la guild. Si no, responde con error.
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 * @returns {import('lavalink-client').Player|null}
 */
async function requireActivePlayer(interaction) {
  const player = interaction.client.lavalink.getPlayer(interaction.guildId);
  if (!player || !player.connected) {
    await safeReply(interaction, errorEmbed(
      'Sin reproducción',
      'No hay nada reproduciéndose ahora mismo.'
    ));
    return null;
  }
  return player;
}

/**
 * Responde al interaction con un embed efímero, manejando el caso de ya haber
 * sido diferido/respondido. No lanza excepciones.
 */
async function safeReply(interaction, embed) {
  const payload = { embeds: [embed], flags: MessageFlags.Ephemeral };
  try {
    if (interaction.deferred || interaction.replied) {
      // editReply no soporta flags, pero si ya estaba diferido la ephemerality se hereda
      await interaction.editReply({ embeds: [embed] });
    } else {
      await interaction.reply(payload);
    }
  } catch {
    /* el interaction puede haber expirado — ignorar */
  }
}

module.exports = {
  checkCooldown,
  requireSameVoiceChannel,
  requireActivePlayer,
  safeReply,
  COOLDOWN_MS,
};
