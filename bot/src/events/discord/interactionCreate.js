'use strict';

const { InteractionType, MessageFlags } = require('discord.js');
const { errorEmbed } = require('../../utils/embeds');
const { checkCooldown } = require('../../utils/checks');
const logger = require('../../utils/logger');

/**
 * Evento: interactionCreate
 * Punto de entrada para todos los slash commands.
 * Aplica:
 *   - filtrado de tipo (solo chat input)
 *   - rechazo de DMs
 *   - cooldown anti-spam por usuario
 *   - manejo centralizado de errores
 */
async function handleInteractionCreate(interaction) {
  if (interaction.type !== InteractionType.ApplicationCommand) return;
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    logger.warn(`[Interaction] Comando desconocido: ${interaction.commandName}`);
    await safeReply(interaction, errorEmbed('Comando no encontrado', 'Este comando no existe o no está registrado.'));
    return;
  }

  // Solo en servidores
  if (!interaction.guild) {
    await safeReply(interaction, errorEmbed(
      'Solo en servidores',
      'Este bot solo funciona en servidores de Discord, no en mensajes directos.'
    ));
    return;
  }

  // Cooldown anti-spam (2s por usuario)
  const remaining = checkCooldown(interaction.user.id);
  if (remaining > 0) {
    await safeReply(interaction, errorEmbed(
      'Espera un momento',
      `Estás ejecutando comandos demasiado rápido. Intenta de nuevo en **${(remaining / 1000).toFixed(1)}s**.`
    ));
    return;
  }

  try {
    logger.debug(`[Interaction] ${interaction.user.tag} usó /${interaction.commandName} en ${interaction.guild.name}`);
    await command.execute(interaction);
  } catch (error) {
    logger.error(
      `[Interaction] Error ejecutando /${interaction.commandName}: ${error.message}`,
      { stack: error.stack }
    );

    // Nunca exponer mensajes de error crudos largos al usuario — pueden filtrar detalles internos
    const userFacingMsg = 'Ocurrió un error inesperado. Inténtalo de nuevo en unos momentos.';
    const embed = errorEmbed('Error inesperado', userFacingMsg);

    try {
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply({ embeds: [embed] });
      } else {
        await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      }
    } catch {
      /* si hasta el reply falla, no hay nada que podamos hacer */
    }
  }
}

/**
 * Reply efímero seguro, maneja el caso ya-respondido.
 */
async function safeReply(interaction, embed) {
  try {
    if (interaction.deferred || interaction.replied) {
      await interaction.editReply({ embeds: [embed] });
    } else {
      await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    }
  } catch {
    /* interaction expirado */
  }
}

module.exports = { handleInteractionCreate };
