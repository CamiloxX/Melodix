'use strict';

const { SlashCommandBuilder } = require('discord.js');
const { errorEmbed, infoEmbed, queueEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Muestra la cola de reproducción')
    .addIntegerOption((option) =>
      option
        .setName('pagina')
        .setDescription('Página de la cola a mostrar (por defecto: 1)')
        .setMinValue(1)
        .setRequired(false)
    ),

  async execute(interaction) {
    const player = interaction.client.lavalink.getPlayer(interaction.guildId);

    if (!player || !player.connected) {
      return interaction.reply({
        embeds: [infoEmbed('Cola vacía', 'No hay nada reproduciéndose. Usa `/play` para empezar.')],
        ephemeral: true,
      });
    }

    const hasSomething = player.queue.current || player.queue.tracks.length > 0;

    if (!hasSomething) {
      return interaction.reply({
        embeds: [infoEmbed('Cola vacía', 'No hay nada en la cola. Usa `/play` para añadir canciones.')],
        ephemeral: true,
      });
    }

    const page = interaction.options.getInteger('pagina') || 1;
    const embed = queueEmbed(player, page);

    return interaction.reply({ embeds: [embed] });
  },
};
