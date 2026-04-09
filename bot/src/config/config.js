'use strict';

/**
 * Configuración centralizada del bot.
 * Todas las variables de entorno se validan aquí al arrancar.
 */

require('dotenv').config();

// Valida que las variables críticas existan
function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Variable de entorno requerida no definida: ${name}`);
  }
  return value;
}

function optionalEnv(name, defaultValue = undefined) {
  return process.env[name] || defaultValue;
}

/**
 * Parsea un entero de env con validación de rango.
 * @param {string} name
 * @param {number} defaultValue
 * @param {{min?: number, max?: number}} [opts]
 */
function intEnv(name, defaultValue, opts = {}) {
  const raw = process.env[name];
  if (raw === undefined || raw === '') return defaultValue;
  const n = parseInt(raw, 10);
  if (Number.isNaN(n)) {
    throw new Error(`Variable de entorno "${name}" debe ser un entero (recibido: "${raw}")`);
  }
  if (opts.min !== undefined && n < opts.min) {
    throw new Error(`"${name}" debe ser >= ${opts.min} (recibido: ${n})`);
  }
  if (opts.max !== undefined && n > opts.max) {
    throw new Error(`"${name}" debe ser <= ${opts.max} (recibido: ${n})`);
  }
  return n;
}

const config = {
  // --- Discord ---
  discord: {
    token: requireEnv('DISCORD_TOKEN'),
    clientId: requireEnv('DISCORD_CLIENT_ID'),
    // GUILD_ID es opcional: si se define, los comandos se registran en ese servidor (instantáneo).
    // Si no se define, se registran globalmente (puede tardar hasta 1 hora en propagarse).
    guildId: optionalEnv('DISCORD_GUILD_ID'),
  },

  // --- Lavalink ---
  lavalink: {
    host: optionalEnv('LAVALINK_HOST', 'lavalink'),
    port: intEnv('LAVALINK_PORT', 2333, { min: 1, max: 65535 }),
    password: optionalEnv('LAVALINK_PASSWORD', 'youshallnotpass'),
    secure: optionalEnv('LAVALINK_SECURE', 'false') === 'true',
    nodeId: 'main-node',
  },

  // --- Spotify (solo para metadata/búsqueda adicional en el bot) ---
  // La resolución principal la hace LavaSrc en Lavalink.
  spotify: {
    clientId: optionalEnv('SPOTIFY_CLIENT_ID'),
    clientSecret: optionalEnv('SPOTIFY_CLIENT_SECRET'),
  },

  // --- Comportamiento del bot ---
  bot: {
    defaultVolume: intEnv('DEFAULT_VOLUME', 80, { min: 1, max: 150 }),
    maxQueueSize: intEnv('MAX_QUEUE_SIZE', 500, { min: 1, max: 10000 }),
    // Tiempo en ms antes de desconectar si la cola está vacía
    autoDisconnectMs: intEnv('AUTO_DISCONNECT_MS', 300000, { min: 0, max: 3_600_000 }),
    // Plataforma de búsqueda por defecto cuando se escribe texto libre
    defaultSearchPlatform: optionalEnv('DEFAULT_SEARCH_PLATFORM', 'ytmsearch'),
    // Color principal de los embeds (hex sin #)
    embedColor: optionalEnv('EMBED_COLOR', '5865F2'),
  },

  // --- Entorno ---
  nodeEnv: optionalEnv('NODE_ENV', 'development'),
  isDev: optionalEnv('NODE_ENV', 'development') !== 'production',
};

module.exports = config;
