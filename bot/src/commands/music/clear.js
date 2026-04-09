'use strict';

const { SlashCommandBuilder } = require('discord.js');
const { errorEmbed, successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Limpia todas las canciones de la cola (la canción actual sigue reproduciéndose)'),

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

    if (queueSize === 0) {
      return interaction.reply({
        embeds: [errorEmbed('Cola vacía', 'No hay canciones en la cola para limpiar.')],
        ephemeral: true,
      });
    }

    // Limpiar todos los tracks pendientes (sin afectar el current)
    player.queue.tracks.splice(0, player.queue.tracks.length);

    return interaction.reply({
      embeds: [
        successEmbed(
          'Cola limpiada',
          `🧹 Se eliminaron **${queueSize}** ${queueSize === 1 ? 'canción' : 'canciones'} de la cola.\n\nLa canción actual sigue reproduciéndose.`
        ),
      ],
    });
  },
};
