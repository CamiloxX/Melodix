'use strict';

const { SlashCommandBuilder } = require('discord.js');
const { errorEmbed, successEmbed, infoEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Ajusta o muestra el volumen de reproducción')
    .addIntegerOption((option) =>
      option
        .setName('nivel')
        .setDescription('Nivel de volumen (1-150). Sin argumento, muestra el actual.')
        .setMinValue(1)
        .setMaxValue(150)
        .setRequired(false)
    ),

  async execute(interaction) {
    const player = interaction.client.lavalink.getPlayer(interaction.guildId);

    if (!player || !player.connected) {
      return interaction.reply({
        embeds: [errorEmbed('Sin reproducción', 'El bot no está en ningún canal de voz.')],
        ephemeral: true,
      });
    }

    const nivel = interaction.options.getInteger('nivel');

    // Sin argumento: mostrar volumen actual
    if (nivel === null) {
      const volumeBar = buildVolumeBar(player.volume);
      return interaction.reply({
        embeds: [
          infoEmbed(
            'Volumen actual',
            `${volumeBar}\n**${player.volume}%**\n\nUsa \`/volume nivel:50\` para cambiarlo.`
          ),
        ],
        ephemeral: true,
      });
    }

    if (!interaction.member.voice?.channelId || interaction.member.voice.channelId !== player.voiceChannelId) {
      return interaction.reply({
        embeds: [errorEmbed('Canal incorrecto', 'Debes estar en el mismo canal de voz que el bot.')],
        ephemeral: true,
      });
    }

    await player.setVolume(nivel);

    const volumeBar = buildVolumeBar(nivel);
    const emoji = nivel === 0 ? '🔇' : nivel < 30 ? '🔈' : nivel < 70 ? '🔉' : '🔊';

    return interaction.reply({
      embeds: [successEmbed('Volumen ajustado', `${emoji} ${volumeBar}\n**${nivel}%**`)],
    });
  },
};

/**
 * Construye una barra visual del volumen.
 * @param {number} volume - 0 a 150
 * @returns {string}
 */
function buildVolumeBar(volume) {
  const maxDisplay = 150;
  const length = 15;
  const filled = Math.round((Math.min(volume, maxDisplay) / maxDisplay) * length);
  const empty = length - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}
