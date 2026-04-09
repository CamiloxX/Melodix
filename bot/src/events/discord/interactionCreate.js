'use strict';

const { InteractionType } = require('discord.js');
const { errorEmbed } = require('../../utils/embeds');
const logger = require('../../utils/logger');

/**
 * Evento: interactionCreate
 * Punto de entrada para todos los slash commands.
 * Busca el comando correspondiente en client.commands y lo ejecuta.
 */
async function handleInteractionCreate(interaction) {
  // Solo procesar slash commands
  if (interaction.type !== InteractionType.ApplicationCommand) return;
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    logger.warn(`[Interaction] Comando desconocido: ${interaction.commandName}`);
    await interaction.reply({
      embeds: [errorEmbed('Comando no encontrado', 'Este comando no existe o no está registrado.')],
      ephemeral: true,
    });
    return;
  }

  // Solo permitir comandos en servidores (no en DMs)
  if (!interaction.guild) {
    await interaction.reply({
      embeds: [errorEmbed('Solo en servidores', 'Este bot solo funciona en servidores de Discord, no en mensajes directos.')],
      ephemeral: true,
    });
    return;
  }

  try {
    logger.debug(`[Interaction] ${interaction.user.tag} usó /${interaction.commandName} en ${interaction.guild.name}`);
    await command.execute(interaction);
  } catch (error) {
    logger.error(`[Interaction] Error ejecutando /${interaction.commandName}: ${error.message}`, { stack: error.stack });

    const errorMsg = error.message?.length < 200
      ? error.message
      : 'Ocurrió un error inesperado. Inténtalo de nuevo.';

    const embed = errorEmbed('Error inesperado', `Algo salió mal al ejecutar este comando.\n\`${errorMsg}\``);

    try {
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply({ embeds: [embed] });
      } else {
        await interaction.reply({ embeds: [embed], ephemeral: true });
      }
    } catch {
      // Si incluso el reply falla, ignorar silenciosamente
    }
  }
}

module.exports = { handleInteractionCreate };
