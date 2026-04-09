'use strict';

const { SlashCommandBuilder } = require('discord.js');
const { errorEmbed, successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Detiene la reproducción y limpia la cola (el bot se queda en el canal)'),

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

    // stopPlaying(clearQueue, executeAutoplay)
    await player.stopPlaying(true, false);

    return interaction.reply({
      embeds: [
        successEmbed(
          'Reproducción detenida',
          '⏹️ La reproducción fue detenida y la cola fue limpiada.\n\nEl bot sigue en el canal. Usa `/play` para empezar de nuevo o `/disconnect` para que se vaya.'
        ),
      ],
    });
  },
};
