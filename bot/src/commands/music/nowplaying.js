'use strict';

const { SlashCommandBuilder } = require('discord.js');
const { errorEmbed, nowPlayingProgressEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nowplaying')
    .setDescription('Muestra la canción que se está reproduciendo ahora mismo'),

  async execute(interaction) {
    const player = interaction.client.lavalink.getPlayer(interaction.guildId);

    if (!player || !player.connected || !player.queue.current) {
      return interaction.reply({
        embeds: [errorEmbed('Sin reproducción', 'No hay nada reproduciéndose ahora mismo.')],
        ephemeral: true,
      });
    }

    const embed = nowPlayingProgressEmbed(player);
    return interaction.reply({ embeds: [embed] });
  },
};
