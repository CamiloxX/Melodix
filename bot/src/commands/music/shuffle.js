'use strict';

const { SlashCommandBuilder } = require('discord.js');
const { errorEmbed, successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shuffle')
    .setDescription('Mezcla aleatoriamente las canciones en la cola'),

  async execute(interaction) {
    const player = interaction.client.lavalink.getPlayer(interaction.guildId);

    if (!player || !player.connected) {
      return interaction.reply({
        embeds: [errorEmbed('Sin reproducción', 'El bot no está en ningún canal de voz.')],
        ephemeral: true,
      });
    }

    if (!interaction.member.voice?.channelId || interaction.member.voice.channelId !== player.voiceChannelId) {
      return interaction.reply({
        embeds: [errorEmbed('Canal incorrecto', 'Debes estar en el mismo canal de voz que el bot.')],
        ephemeral: true,
      });
    }

    const queueSize = player.queue.tracks.length;

    if (queueSize < 2) {
      return interaction.reply({
        embeds: [errorEmbed('Cola insuficiente', 'Necesitas al menos 2 canciones en la cola para mezclar.')],
        ephemeral: true,
      });
    }

    player.queue.shuffle();

    return interaction.reply({
      embeds: [successEmbed('Cola mezclada', `🔀 Se mezclaron aleatoriamente **${queueSize}** canciones.`)],
    });
  },
};
