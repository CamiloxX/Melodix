'use strict';

/**
 * Utilidades de formateo reutilizables.
 */

/**
 * Convierte milisegundos a formato legible: 1h 23m 45s o 3:45
 * @param {number} ms - Duración en milisegundos
 * @param {boolean} [verbose=false] - Si true, usa formato "1h 23m 45s"
 * @returns {string}
 */
function formatDuration(ms, verbose = false) {
  if (!ms || isNaN(ms)) return '0:00';

  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (verbose) {
    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    parts.push(`${seconds}s`);
    return parts.join(' ');
  }

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Crea una barra de progreso visual.
 * @param {number} current - Posición actual en ms
 * @param {number} total - Duración total en ms
 * @param {number} [length=20] - Longitud de la barra
 * @returns {string}
 */
function progressBar(current, total, length = 20) {
  if (!total || total === 0) return '▬'.repeat(length);

  const filled = Math.round((current / total) * length);
  const empty = length - filled;
  const bar = '▬'.repeat(Math.max(0, filled - 1)) + '🔘' + '▬'.repeat(Math.max(0, empty));
  return bar;
}

/**
 * Trunca un string a una longitud máxima con elipsis.
 * @param {string} str
 * @param {number} maxLength
 * @returns {string}
 */
function truncate(str, maxLength) {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

/**
 * Capitaliza la primera letra de un string.
 * @param {string} str
 * @returns {string}
 */
function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Obtiene el identificador del tipo de fuente a partir de una URL o query.
 * @param {string} query
 * @returns {string} - 'spotify', 'youtube', 'soundcloud', 'bandcamp', 'twitch', 'text'
 */
function detectSourceType(query) {
  if (!query) return 'text';

  const lower = query.toLowerCase();

  if (lower.includes('spotify.com')) return 'spotify';
  if (lower.includes('youtube.com') || lower.includes('youtu.be')) return 'youtube';
  if (lower.includes('soundcloud.com')) return 'soundcloud';
  if (lower.includes('bandcamp.com')) return 'bandcamp';
  if (lower.includes('twitch.tv')) return 'twitch';
  if (lower.includes('vimeo.com')) return 'vimeo';
  if (lower.startsWith('http://') || lower.startsWith('https://')) return 'url';

  return 'text';
}

/**
 * Detecta el tipo de recurso de Spotify (track, album, playlist).
 * @param {string} url
 * @returns {'track'|'album'|'playlist'|null}
 */
function detectSpotifyType(url) {
  if (!url || !url.includes('spotify.com')) return null;

  if (url.includes('/track/')) return 'track';
  if (url.includes('/album/')) return 'album';
  if (url.includes('/playlist/')) return 'playlist';

  return null;
}

/**
 * Formatea un número grande con separadores de miles.
 * @param {number} num
 * @returns {string}
 */
function formatNumber(num) {
  if (!num) return '0';
  return num.toLocaleString('es-ES');
}

module.exports = {
  formatDuration,
  progressBar,
  truncate,
  capitalize,
  detectSourceType,
  detectSpotifyType,
  formatNumber,
};
