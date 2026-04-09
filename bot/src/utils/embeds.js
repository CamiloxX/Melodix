'use strict';

const { EmbedBuilder } = require('discord.js');
const { formatDuration, progressBar, truncate } = require('./formatters');
const config = require('../config/config');

// Color principal del bot
const MAIN_COLOR = parseInt(config.bot.embedColor, 16);
const ERROR_COLOR = 0xED4245;   // Rojo Discord
const SUCCESS_COLOR = 0x57F287; // Verde Discord
const WARNING_COLOR = 0xFEE75C; // Amarillo Discord
const INFO_COLOR = 0x5865F2;    // Blasco Discord

/**
 * Embed de error estandarizado.
 * @param {string} title
 * @param {string} description
 * @returns {EmbedBuilder}
 */
function errorEmbed(title, description) {
  return new EmbedBuilder()
    .setColor(ERROR_COLOR)
    .setTitle(`❌ ${title}`)
    .setDescription(description)
    .setTimestamp();
}

/**
 * Embed de éxito estandarizado.
 * @param {string} title
 * @param {string} description
 * @returns {EmbedBuilder}
 */
function successEmbed(title, description) {
  return new EmbedBuilder()
    .setColor(SUCCESS_COLOR)
    .setTitle(`✅ ${title}`)
    .setDescription(description)
    .setTimestamp();
}

/**
 * Embed de información.
 * @param {string} title
 * @param {string} description
 * @returns {EmbedBuilder}
 */
function infoEmbed(title, description) {
  return new EmbedBuilder()
    .setColor(INFO_COLOR)
    .setTitle(`ℹ️ ${title}`)
    .setDescription(description)
    .setTimestamp();
}

/**
 * Embed de advertencia.
 * @param {string} title
 * @param {string} description
 * @returns {EmbedBuilder}
 */
function warningEmbed(title, description) {
  return new EmbedBuilder()
    .setColor(WARNING_COLOR)
    .setTitle(`⚠️ ${title}`)
    .setDescription(description)
    .setTimestamp();
}

/**
 * Embed de "Ahora reproduciendo".
 * @param {import('lavalink-client').Track} track
 * @param {import('discord.js').GuildMember} requestedBy
 * @returns {EmbedBuilder}
 */
function nowPlayingEmbed(track, requestedBy) {
  const duration = track.info.isStream ? '🔴 En vivo' : formatDuration(track.info.duration);
  const embed = new EmbedBuilder()
    .setColor(MAIN_COLOR)
    .setAuthor({ name: '▶️ Ahora reproduciendo' })
    .setTitle(truncate(track.info.title, 200))
    .setURL(track.info.uri || null)
    .addFields(
      { name: '👤 Autor', value: truncate(track.info.author, 100) || 'Desconocido', inline: true },
      { name: '⏱️ Duración', value: duration, inline: true },
      { name: '🎧 Fuente', value: getSourceEmoji(track.info.sourceName) + ' ' + formatSourceName(track.info.sourceName), inline: true }
    )
    .setTimestamp();

  if (track.info.artworkUrl) {
    embed.setThumbnail(track.info.artworkUrl);
  }

  if (requestedBy) {
    embed.setFooter({
      text: `Solicitado por ${requestedBy.displayName || requestedBy.user?.username || 'Alguien'}`,
      iconURL: requestedBy.displayAvatarURL?.() || requestedBy.user?.displayAvatarURL?.(),
    });
  }

  return embed;
}

/**
 * Embed de progreso de reproducción.
 * @param {import('lavalink-client').Player} player
 * @returns {EmbedBuilder}
 */
function nowPlayingProgressEmbed(player) {
  const track = player.queue.current;
  if (!track) return infoEmbed('Cola vacía', 'No hay nada reproduciéndose.');

  const position = player.position || 0;
  const duration = track.info.duration;
  const isStream = track.info.isStream;

  const bar = isStream ? '🔴 TRANSMISIÓN EN VIVO' : progressBar(position, duration);
  const timeStr = isStream
    ? '🔴 En vivo'
    : `${formatDuration(position)} / ${formatDuration(duration)}`;

  const status = player.paused ? '⏸️ Pausado' : '▶️ Reproduciendo';

  const embed = new EmbedBuilder()
    .setColor(MAIN_COLOR)
    .setAuthor({ name: status })
    .setTitle(truncate(track.info.title, 200))
    .setURL(track.info.uri || null)
    .setDescription(`${bar}\n\`${timeStr}\``)
    .addFields(
      { name: '👤 Autor', value: truncate(track.info.author, 100) || 'Desconocido', inline: true },
      { name: '🔊 Volumen', value: `${player.volume}%`, inline: true },
      { name: '🎧 Fuente', value: getSourceEmoji(track.info.sourceName) + ' ' + formatSourceName(track.info.sourceName), inline: true }
    )
    .setTimestamp();

  if (track.info.artworkUrl) {
    embed.setThumbnail(track.info.artworkUrl);
  }

  const queueSize = player.queue.tracks.length;
  if (queueSize > 0) {
    embed.setFooter({ text: `${queueSize} ${queueSize === 1 ? 'canción' : 'canciones'} en la cola` });
  }

  return embed;
}

/**
 * Embed de canción añadida a la cola.
 * @param {import('lavalink-client').Track} track
 * @param {number} position - Posición en la cola
 * @param {import('discord.js').GuildMember} requestedBy
 * @returns {EmbedBuilder}
 */
function trackAddedEmbed(track, position, requestedBy) {
  const duration = track.info.isStream ? '🔴 En vivo' : formatDuration(track.info.duration);

  const embed = new EmbedBuilder()
    .setColor(MAIN_COLOR)
    .setAuthor({ name: '➕ Añadido a la cola' })
    .setTitle(truncate(track.info.title, 200))
    .setURL(track.info.uri || null)
    .addFields(
      { name: '👤 Autor', value: truncate(track.info.author, 100) || 'Desconocido', inline: true },
      { name: '⏱️ Duración', value: duration, inline: true },
      { name: '📍 Posición', value: `#${position}`, inline: true }
    )
    .setTimestamp();

  if (track.info.artworkUrl) {
    embed.setThumbnail(track.info.artworkUrl);
  }

  if (requestedBy) {
    embed.setFooter({
      text: `Solicitado por ${requestedBy.displayName || requestedBy.user?.username || 'Alguien'}`,
      iconURL: requestedBy.displayAvatarURL?.() || requestedBy.user?.displayAvatarURL?.(),
    });
  }

  return embed;
}

/**
 * Embed de playlist añadida a la cola.
 * @param {string} playlistName
 * @param {number} trackCount
 * @param {string} sourceName
 * @param {import('discord.js').GuildMember} requestedBy
 * @returns {EmbedBuilder}
 */
function playlistAddedEmbed(playlistName, trackCount, sourceName, requestedBy) {
  const embed = new EmbedBuilder()
    .setColor(MAIN_COLOR)
    .setAuthor({ name: '📋 Playlist añadida a la cola' })
    .setTitle(truncate(playlistName || 'Playlist sin nombre', 200))
    .addFields(
      { name: '🎵 Canciones', value: `${trackCount}`, inline: true },
      { name: '🎧 Fuente', value: getSourceEmoji(sourceName) + ' ' + formatSourceName(sourceName), inline: true }
    )
    .setTimestamp();

  if (requestedBy) {
    embed.setFooter({
      text: `Solicitado por ${requestedBy.displayName || requestedBy.user?.username || 'Alguien'}`,
      iconURL: requestedBy.displayAvatarURL?.() || requestedBy.user?.displayAvatarURL?.(),
    });
  }

  return embed;
}

/**
 * Embed de la cola completa con paginación.
 * @param {import('lavalink-client').Player} player
 * @param {number} [page=1]
 * @returns {EmbedBuilder}
 */
function queueEmbed(player, page = 1) {
  const current = player.queue.current;
  const tracks = player.queue.tracks;
  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(tracks.length / itemsPerPage));
  const safePage = Math.min(Math.max(1, page), totalPages);

  const embed = new EmbedBuilder()
    .setColor(MAIN_COLOR)
    .setTitle('🎵 Cola de reproducción')
    .setTimestamp();

  // Canción actual
  if (current) {
    const status = player.paused ? '⏸️' : '▶️';
    embed.addFields({
      name: `${status} Reproduciendo ahora`,
      value: `[${truncate(current.info.title, 60)}](${current.info.uri || '#'}) — ${formatDuration(current.info.duration)}`,
    });
  }

  // Tracks en cola paginados
  if (tracks.length === 0) {
    embed.setDescription('La cola está vacía. Usa `/play` para añadir canciones.');
  } else {
    const start = (safePage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageTracks = tracks.slice(start, end);

    const queueList = pageTracks
      .map((track, index) => {
        const num = start + index + 1;
        const duration = track.info.isStream ? '🔴' : formatDuration(track.info.duration);
        return `\`${String(num).padStart(2, '0')}.\` [${truncate(track.info.title, 55)}](${track.info.uri || '#'}) — ${duration}`;
      })
      .join('\n');

    embed.setDescription(queueList);
  }

  // Estadísticas de la cola
  const totalDurationMs = tracks.reduce((acc, t) => acc + (t.info.isStream ? 0 : (t.info.duration || 0)), 0);
  const footerParts = [
    `${tracks.length} ${tracks.length === 1 ? 'canción' : 'canciones'} en cola`,
  ];
  if (totalDurationMs > 0) {
    footerParts.push(`Duración total: ${formatDuration(totalDurationMs)}`);
  }
  if (totalPages > 1) {
    footerParts.push(`Página ${safePage}/${totalPages}`);
  }

  embed.setFooter({ text: footerParts.join(' • ') });

  return embed;
}

/**
 * Retorna el emoji correspondiente a la fuente de audio.
 * @param {string} sourceName
 * @returns {string}
 */
function getSourceEmoji(sourceName) {
  const emojis = {
    youtube: '📺',
    ytm: '🎵',
    youtubemusic: '🎵',
    soundcloud: '☁️',
    spotify: '💚',
    bandcamp: '🎸',
    twitch: '📡',
    applemusic: '🍎',
    deezer: '🎶',
    vimeo: '🎬',
    http: '🌐',
    local: '💾',
  };
  return emojis[sourceName?.toLowerCase()] || '🎵';
}

/**
 * Retorna el nombre formateado de la fuente.
 * @param {string} sourceName
 * @returns {string}
 */
function formatSourceName(sourceName) {
  const names = {
    youtube: 'YouTube',
    ytm: 'YouTube Music',
    youtubemusic: 'YouTube Music',
    soundcloud: 'SoundCloud',
    spotify: 'Spotify',
    bandcamp: 'Bandcamp',
    twitch: 'Twitch',
    applemusic: 'Apple Music',
    deezer: 'Deezer',
    vimeo: 'Vimeo',
    http: 'HTTP',
    local: 'Local',
  };
  return names[sourceName?.toLowerCase()] || (sourceName || 'Desconocida');
}

module.exports = {
  errorEmbed,
  successEmbed,
  infoEmbed,
  warningEmbed,
  nowPlayingEmbed,
  nowPlayingProgressEmbed,
  trackAddedEmbed,
  playlistAddedEmbed,
  queueEmbed,
  getSourceEmoji,
  formatSourceName,
};
