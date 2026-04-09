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
    port: parseInt(optionalEnv('LAVALINK_PORT', '2333'), 10),
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
    defaultVolume: parseInt(optionalEnv('DEFAULT_VOLUME', '80'), 10),
    maxQueueSize: parseInt(optionalEnv('MAX_QUEUE_SIZE', '500'), 10),
    // Tiempo en ms antes de desconectar si la cola está vacía
    autoDisconnectMs: parseInt(optionalEnv('AUTO_DISCONNECT_MS', '300000'), 10), // 5 minutos
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
