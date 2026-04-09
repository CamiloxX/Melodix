'use strict';

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config/config');

const MAIN_COLOR = parseInt(config.bot.embedColor, 16);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Muestra todos los comandos disponibles del bot'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(MAIN_COLOR)
      .setTitle('🎵 Bot de Música — Comandos')
      .setDescription('Reproduce música de YouTube, Spotify, SoundCloud, Bandcamp, Twitch y más.')
      .addFields(
        {
          name: '🎵 Reproducción',
          value: [
            '`/play <query>` — Reproduce o añade una canción/playlist',
            '`/pause` — Pausa la canción actual',
            '`/resume` — Reanuda la reproducción',
            '`/skip [cantidad]` — Salta una o más canciones',
            '`/stop` — Detiene todo y limpia la cola',
          ].join('\n'),
        },
        {
          name: '📋 Cola',
          value: [
            '`/queue [página]` — Muestra la cola de reproducción',
            '`/nowplaying` — Muestra la canción actual con progreso',
            '`/shuffle` — Mezcla aleatoriamente la cola',
            '`/remove <posición>` — Elimina una canción de la cola',
            '`/clear` — Limpia toda la cola',
          ].join('\n'),
        },
        {
          name: '🔧 Control',
          value: [
            '`/volume [nivel]` — Muestra o ajusta el volumen (1-150)',
            '`/disconnect` — Desconecta el bot del canal de voz',
          ].join('\n'),
        },
        {
          name: '🎧 Fuentes soportadas',
          value: [
            '📺 **YouTube** — Links y búsquedas',
            '🎵 **YouTube Music** — Links y búsquedas (por defecto)',
            '💚 **Spotify** — Tracks, álbumes y playlists (metadata → reproducción en YouTube)',
            '☁️ **SoundCloud** — Links y búsquedas',
            '🎸 **Bandcamp** — Links directos',
            '📡 **Twitch** — Streams en vivo',
            '🌐 **URLs HTTP directas** — Audio de cualquier URL pública',
          ].join('\n'),
        },
        {
          name: '⚠️ Nota sobre Spotify',
          value:
            'Spotify se usa **solo para metadata**. El audio real proviene de YouTube Music para cumplir con las políticas de Spotify. La coincidencia puede no ser perfecta en todos los casos.',
        },
        {
          name: '💡 Ejemplos de uso',
          value: [
            '`/play Never Gonna Give You Up` — Busca en YouTube Music',
            '`/play https://open.spotify.com/track/...` — Resuelve track de Spotify',
            '`/play https://open.spotify.com/playlist/...` — Carga playlist de Spotify',
            '`/play https://www.youtube.com/watch?v=...` — URL directa de YouTube',
            '`/play https://soundcloud.com/artist/track` — URL de SoundCloud',
          ].join('\n'),
        }
      )
      .setFooter({ text: 'Usa los comandos con /  •  El bot necesita permisos de voz y texto' })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },
};
