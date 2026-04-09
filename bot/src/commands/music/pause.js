'use strict';

const { SlashCommandBuilder } = require('discord.js');
const { errorEmbed, successEmbed, warningEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pausa la canción que se está reproduciendo'),

  async execute(interaction) {
    const player = interaction.client.lavalink.getPlayer(interaction.guildId);

    if (!player || !player.connected) {
      return interaction.reply({
        embeds: [errorEmbed('Sin reproducción', 'No hay nada reproduciéndose ahora mismo.')],
        ephemeral: true,
      });
    }

    if (!interaction.member.voice?.channelId || interaction.member.voice.channelId !== player.voiceChannelId) {
      return interaction.reply({
        embeds: [errorEmbed('Canal incorrecto', 'Debes estar en el mismo canal de voz que el bot.')],
        ephemeral: true,
      });
    }

    if (player.paused) {
      return interaction.reply({
        embeds: [warningEmbed('Ya pausado', 'La reproducción ya está pausada. Usa `/resume` para continuar.')],
        ephemeral: true,
      });
    }

    if (!player.playing) {
      return interaction.reply({
        embeds: [errorEmbed('Sin reproducción', 'No hay nada reproduciéndose ahora mismo.')],
        ephemeral: true,
      });
    }

    await player.pause(true);

    const currentTrack = player.queue.current;
    const trackTitle = currentTrack?.info?.title || 'la canción actual';

    return interaction.reply({
      embeds: [successEmbed('Pausado', `⏸️ **${trackTitle}** fue pausada.\nUsa \`/resume\` para continuar.`)],
    });
  },
};
