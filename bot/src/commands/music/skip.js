'use strict';

const { SlashCommandBuilder } = require('discord.js');
const { errorEmbed, successEmbed, infoEmbed } = require('../../utils/embeds');
const { truncate } = require('../../utils/formatters');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Salta la canción actual y pasa a la siguiente')
    .addIntegerOption((option) =>
      option
        .setName('cantidad')
        .setDescription('Número de canciones a saltar (por defecto: 1)')
        .setMinValue(1)
        .setMaxValue(50)
        .setRequired(false)
    ),

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

    if (!player.queue.current && !player.playing) {
      return interaction.reply({
        embeds: [errorEmbed('Sin reproducción', 'No hay nada reproduciéndose ahora mismo.')],
        ephemeral: true,
      });
    }

    const cantidad = interaction.options.getInteger('cantidad') || 1;
    const skippedTitle = player.queue.current?.info?.title || 'canción actual';

    if (cantidad === 1) {
      // Saltar una sola canción
      await player.skip();
      const nextTrack = player.queue.tracks[0];

      if (nextTrack) {
        return interaction.reply({
          embeds: [successEmbed('Saltado', `⏭️ Saltando **${truncate(skippedTitle, 60)}**`)],
        });
      } else {
        return interaction.reply({
          embeds: [infoEmbed('Saltado', `⏭️ Saltando **${truncate(skippedTitle, 60)}**\n\nNo hay más canciones en la cola.`)],
        });
      }
    } else {
      // Saltar múltiples canciones
      const queueSize = player.queue.tracks.length;
      const toSkip = Math.min(cantidad - 1, queueSize); // -1 porque skip() ya salta la actual

      // Eliminar tracks de la cola antes de saltar
      if (toSkip > 0) {
        player.queue.tracks.splice(0, toSkip);
      }

      await player.skip();

      return interaction.reply({
        embeds: [successEmbed('Saltados', `⏭️ Se saltaron **${cantidad}** canciones.`)],
      });
    }
  },
};
