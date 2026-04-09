'use strict';

const { SlashCommandBuilder } = require('discord.js');
const {
  errorEmbed,
  trackAddedEmbed,
  playlistAddedEmbed,
  warningEmbed,
} = require('../../utils/embeds');
const { detectSourceType, detectSpotifyType } = require('../../utils/formatters');
const spotifyResolver = require('../../music/SpotifyResolver');
const config = require('../../config/config');
const logger = require('../../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Reproduce o añade una canción/playlist a la cola')
    .addStringOption((option) =>
      option
        .setName('query')
        .setDescription('URL de YouTube, Spotify, SoundCloud, o texto de búsqueda')
        .setRequired(true)
        .setMaxLength(500)
    ),

  /**
   * Ejecuta el comando /play.
   * Maneja búsquedas por texto y URLs de múltiples plataformas.
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    await interaction.deferReply();

    const member = interaction.member;
    const guild = interaction.guild;
    const query = interaction.options.getString('query', true).trim();

    // --- Validación: usuario debe estar en canal de voz ---
    const voiceChannel = member.voice?.channel;
    if (!voiceChannel) {
      return interaction.editReply({
        embeds: [errorEmbed('Sin canal de voz', 'Debes estar en un canal de voz para usar este comando.')],
      });
    }

    // --- Validación: bot necesita permisos en ese canal ---
    const permissions = voiceChannel.permissionsFor(guild.members.me);
    if (!permissions.has('Connect')) {
      return interaction.editReply({
        embeds: [errorEmbed('Sin permisos', `No tengo permiso para unirme al canal ${voiceChannel.name}.`)],
      });
    }
    if (!permissions.has('Speak')) {
      return interaction.editReply({
        embeds: [errorEmbed('Sin permisos', `No tengo permiso para hablar en el canal ${voiceChannel.name}.`)],
      });
    }

    const lavalink = interaction.client.lavalink;

    // --- Crear o recuperar el player para este servidor ---
    let player;
    try {
      player = await lavalink.createPlayer({
        guildId: guild.id,
        voiceChannelId: voiceChannel.id,
        textChannelId: interaction.channelId,
        selfDeaf: true,
        selfMute: false,
        volume: config.bot.defaultVolume,
        instaUpdateFiltersFix: true,
      });
    } catch (err) {
      logger.error(`[Play] Error al crear player: ${err.message}`);
      return interaction.editReply({
        embeds: [errorEmbed('Error de conexión', 'No se pudo conectar al servidor de audio. ¿Está Lavalink corriendo?')],
      });
    }

    // Conectar si no está conectado
    if (!player.connected) {
      try {
        await player.connect();
      } catch (err) {
        logger.error(`[Play] Error al conectar player: ${err.message}`);
        await player.destroy().catch(() => {});
        return interaction.editReply({
          embeds: [errorEmbed('Error de voz', `No pude unirme al canal de voz. Error: ${err.message}`)],
        });
      }
    }

    const sourceType = detectSourceType(query);
    logger.debug(`[Play] Query: "${query}" — Fuente detectada: ${sourceType}`);

    // ==============================================================
    // MANEJO DE SPOTIFY
    // La resolución real la hace LavaSrc en Lavalink.
    // Aquí solo damos feedback previo al usuario si es posible.
    // ==============================================================
    if (sourceType === 'spotify') {
      return handleSpotifyQuery(interaction, player, query, member);
    }

    // ==============================================================
    // MANEJO DE OTRAS URLs / BÚSQUEDAS DE TEXTO
    // ==============================================================
    return handleGenericQuery(interaction, player, query, sourceType, member);
  },
};

/**
 * Maneja queries de Spotify.
 * LavaSrc en Lavalink resuelve el link automáticamente buscando en YouTube.
 */
async function handleSpotifyQuery(interaction, player, query, requester) {
  const spotifyType = detectSpotifyType(query);

  try {
    // Mostrar mensaje de carga para Spotify (puede tardar)
    if (spotifyType === 'playlist' || spotifyType === 'album') {
      await interaction.editReply({
        embeds: [
          {
            color: 0x1DB954,
            description: `💚 Cargando ${spotifyType === 'playlist' ? 'playlist' : 'álbum'} de Spotify... Esto puede tardar un momento.`,
          },
        ],
      });
    }

    // Pasar la URL directamente a Lavalink — LavaSrc la resuelve
    const res = await player.search(
      { query, source: 'spsearch' },
      requester
    );

    return processSearchResult(interaction, player, res, query, requester);
  } catch (err) {
    logger.error(`[Play/Spotify] Error al resolver Spotify: ${err.message}`);

    // Fallback: intentar buscar el texto en YouTube si tenemos credentials de Spotify
    if (spotifyResolver.enabled && spotifyType === 'track') {
      logger.info('[Play/Spotify] Intentando fallback manual vía SpotifyResolver...');
      try {
        const parsed = spotifyResolver.parseSpotifyUrl(query);
        if (parsed) {
          const trackInfo = await spotifyResolver.getTrack(parsed.id);
          const searchQuery = spotifyResolver.buildSearchQuery(trackInfo);
          const fallbackRes = await player.search(
            { query: searchQuery, source: 'ytmsearch' },
            requester
          );
          return processSearchResult(interaction, player, fallbackRes, searchQuery, requester);
        }
      } catch (fallbackErr) {
        logger.error(`[Play/Spotify] Fallback también falló: ${fallbackErr.message}`);
      }
    }

    return interaction.editReply({
      embeds: [
        errorEmbed(
          'Error con Spotify',
          'No se pudo resolver el link de Spotify.\n\n' +
          '**Posibles causas:**\n' +
          '• El plugin LavaSrc no está configurado en Lavalink\n' +
          '• Las credenciales de Spotify en `application.yml` son incorrectas\n' +
          '• La canción/playlist no está disponible en tu región\n\n' +
          'Prueba buscando el nombre de la canción directamente.'
        ),
      ],
    });
  }
}

/**
 * Maneja queries genéricas: URLs directas y texto libre.
 */
async function handleGenericQuery(interaction, player, query, sourceType, requester) {
  // Determinar la plataforma de búsqueda según el sourceType
  let searchSource;
  let isDirectUrl = false;

  if (sourceType === 'youtube' || sourceType === 'soundcloud' || sourceType === 'bandcamp' || sourceType === 'twitch' || sourceType === 'url') {
    // URLs directas: se pasan tal cual a Lavalink
    isDirectUrl = true;
    searchSource = undefined; // Lavalink auto-detecta la fuente
  } else {
    // Búsqueda de texto: usar la plataforma por defecto (ytmsearch)
    searchSource = config.bot.defaultSearchPlatform;
  }

  try {
    const res = await player.search(
      { query, source: isDirectUrl ? undefined : searchSource },
      requester
    );

    return processSearchResult(interaction, player, res, query, requester);
  } catch (err) {
    logger.error(`[Play] Error al buscar "${query}": ${err.message}`);
    return interaction.editReply({
      embeds: [
        errorEmbed(
          'Error de búsqueda',
          `No se pudo completar la búsqueda.\n\`${err.message}\`\n\n` +
          'Asegúrate de que Lavalink está corriendo y los plugins están instalados.'
        ),
      ],
    });
  }
}

/**
 * Procesa el resultado de búsqueda de Lavalink y lo añade a la cola.
 */
async function processSearchResult(interaction, player, res, originalQuery, requester) {
  // Tipos de loadType en Lavalink v4:
  // "track" - un track directo (URL)
  // "playlist" - una playlist
  // "search" - resultados de búsqueda
  // "empty" - sin resultados
  // "error" - error

  if (!res || res.loadType === 'empty') {
    return interaction.editReply({
      embeds: [
        warningEmbed(
          'Sin resultados',
          `No encontré nada para: **${originalQuery}**\n\nIntenta con otro término de búsqueda o una URL diferente.`
        ),
      ],
    });
  }

  if (res.loadType === 'error') {
    const errMsg = res.exception?.message || 'Error desconocido de Lavalink';
    logger.error(`[Play] loadType=error: ${errMsg}`);
    return interaction.editReply({
      embeds: [errorEmbed('Error al cargar', `Lavalink reportó un error: \`${errMsg}\``)],
    });
  }

  const queueWasEmpty = player.queue.tracks.length === 0 && !player.queue.current;

  if (res.loadType === 'playlist') {
    // Playlist completa
    const tracks = res.tracks;
    const playlistName = res.playlist?.name || 'Playlist sin nombre';
    const sourceName = tracks[0]?.info?.sourceName || 'desconocida';

    if (tracks.length === 0) {
      return interaction.editReply({
        embeds: [warningEmbed('Playlist vacía', 'La playlist no contiene tracks reproducibles.')],
      });
    }

    // Añadir todos los tracks a la cola
    player.queue.add(tracks);

    // Iniciar reproducción si no estaba reproduciendo
    if (!player.playing) {
      await player.play({ paused: false });
    }

    return interaction.editReply({
      embeds: [playlistAddedEmbed(playlistName, tracks.length, sourceName, requester)],
    });
  }

  if (res.loadType === 'track' || res.loadType === 'search') {
    // Track único o primer resultado de búsqueda
    const track = res.tracks[0];

    if (!track) {
      return interaction.editReply({
        embeds: [warningEmbed('Sin resultados', `No encontré ningún track para: **${originalQuery}**`)],
      });
    }

    // Añadir a la cola
    player.queue.add(track);

    const positionInQueue = player.queue.tracks.length;

    // Iniciar reproducción si no estaba reproduciendo
    if (!player.playing) {
      await player.play({ paused: false });
      // Si empieza a reproducirse, trackStart enviará el embed de "Ahora reproduciendo"
      return interaction.editReply({ content: '▶️ Iniciando reproducción...', embeds: [] });
    }

    // Si ya estaba reproduciendo, confirmar que se añadió a la cola
    return interaction.editReply({
      embeds: [trackAddedEmbed(track, positionInQueue, requester)],
    });
  }

  // Fallback para loadTypes no esperados
  logger.warn(`[Play] loadType inesperado: ${res.loadType}`);
  return interaction.editReply({
    embeds: [warningEmbed('Resultado inesperado', `Lavalink devolvió un tipo de resultado no esperado: ${res.loadType}`)],
  });
}
