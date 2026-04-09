'use strict';

const { SlashCommandBuilder } = require('discord.js');
const { errorEmbed, successEmbed, warningEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resume')
    .setDescription('Reanuda la reproducción si estaba pausada'),

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

    if (!player.paused) {
      return interaction.reply({
        embeds: [warningEmbed('Ya reproduciendo', 'La reproducción ya está activa. Usa `/pause` para pausar.')],
        ephemeral: true,
      });
    }

    await player.pause(false);

    const currentTrack = player.queue.current;
    const trackTitle = currentTrack?.info?.title || 'la canción actual';

    return interaction.reply({
      embeds: [successEmbed('Reanudado', `▶️ Reanudando **${trackTitle}**`)],
    });
  },
};
