'use strict';

const { SlashCommandBuilder } = require('discord.js');
const { errorEmbed, successEmbed } = require('../../utils/embeds');
const { truncate } = require('../../utils/formatters');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remove')
    .setDescription('Elimina una canción específica de la cola')
    .addIntegerOption((option) =>
      option
        .setName('posicion')
        .setDescription('Número de posición en la cola (usa /queue para ver las posiciones)')
        .setMinValue(1)
        .setRequired(true)
    ),

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

    const posicion = interaction.options.getInteger('posicion', true);
    const tracks = player.queue.tracks;

    if (tracks.length === 0) {
      return interaction.reply({
        embeds: [errorEmbed('Cola vacía', 'No hay canciones en la cola para eliminar.')],
        ephemeral: true,
      });
    }

    if (posicion > tracks.length) {
      return interaction.reply({
        embeds: [
          errorEmbed(
            'Posición inválida',
            `La posición ${posicion} no existe. La cola tiene **${tracks.length}** ${tracks.length === 1 ? 'canción' : 'canciones'}.\nUsa \`/queue\` para ver las posiciones.`
          ),
        ],
        ephemeral: true,
      });
    }

    // Índice 0-based (posicion es 1-based)
    const index = posicion - 1;
    const removedTrack = tracks[index];
    tracks.splice(index, 1);

    return interaction.reply({
      embeds: [
        successEmbed(
          'Canción eliminada',
          `🗑️ **${truncate(removedTrack.info.title, 60)}** fue eliminada de la posición **#${posicion}**.`
        ),
      ],
    });
  },
};
