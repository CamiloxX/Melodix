'use strict';

const { SlashCommandBuilder } = require('discord.js');
const { errorEmbed, successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('disconnect')
    .setDescription('Desconecta el bot del canal de voz y limpia la cola'),

  async execute(interaction) {
    const player = interaction.client.lavalink.getPlayer(interaction.guildId);

    if (!player || !player.connected) {
      return interaction.reply({
        embeds: [errorEmbed('No conectado', 'El bot no está en ningún canal de voz.')],
        ephemeral: true,
      });
    }

    if (!interaction.member.voice?.channelId || interaction.member.voice.channelId !== player.voiceChannelId) {
      return interaction.reply({
        embeds: [errorEmbed('Canal incorrecto', 'Debes estar en el mismo canal de voz que el bot para desconectarlo.')],
        ephemeral: true,
      });
    }

    await player.destroy();

    return interaction.reply({
      embeds: [successEmbed('Desconectado', '👋 El bot fue desconectado del canal de voz y la cola fue limpiada.')],
    });
  },
};
