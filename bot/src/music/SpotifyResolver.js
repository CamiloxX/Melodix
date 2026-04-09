'use strict';

const https = require('https');
const config = require('../config/config');
const logger = require('../utils/logger');

// Timeout duro para las requests a Spotify — sin esto, una conexión colgada
// bloquearía el comando /play hasta que Discord invalide el interaction.
const REQUEST_TIMEOUT_MS = 10_000;

/**
 * SpotifyResolver — Clase auxiliar para interactuar con la API de Spotify.
 *
 * IMPORTANTE: Esta clase es complementaria. La resolución principal de Spotify
 * (metadata + búsqueda en YouTube) la realiza el plugin LavaSrc en el servidor
 * de Lavalink. Esta clase se usa como:
 *   1. Validación previa de URLs de Spotify
 *   2. Feedback detallado al usuario (nombres de tracks antes de resolverlos)
 *   3. Fallback manual si LavaSrc no está disponible
 *
 * NO extrae audio de Spotify — solo lee metadata pública de la API.
 */
class SpotifyResolver {
  constructor() {
    this.clientId = config.spotify.clientId;
    this.clientSecret = config.spotify.clientSecret;
    this.accessToken = null;
    this.tokenExpiry = null;
    this.enabled = !!(this.clientId && this.clientSecret);

    if (!this.enabled) {
      logger.warn('[Spotify] No se configuraron SPOTIFY_CLIENT_ID y SPOTIFY_CLIENT_SECRET. La resolución de metadata de Spotify en el bot estará deshabilitada. (Lavalink LavaSrc aún puede funcionar si está configurado en application.yml)');
    }
  }

  /**
   * Obtiene (o renueva) el access token de Spotify usando Client Credentials Flow.
   * Este flujo es completamente legal y no requiere autenticación de usuario.
   * @returns {Promise<string>}
   */
  async getAccessToken() {
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');

    return new Promise((resolve, reject) => {
      const body = 'grant_type=client_credentials';
      const options = {
        hostname: 'accounts.spotify.com',
        path: '/api/token',
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(body),
        },
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            if (json.access_token) {
              this.accessToken = json.access_token;
              // Renovar 60 segundos antes de que expire
              this.tokenExpiry = Date.now() + (json.expires_in - 60) * 1000;
              resolve(this.accessToken);
            } else {
              reject(new Error(`Error al obtener token de Spotify: ${JSON.stringify(json)}`));
            }
          } catch (e) {
            reject(e);
          }
        });
      });

      req.setTimeout(REQUEST_TIMEOUT_MS, () => {
        req.destroy(new Error(`Timeout (${REQUEST_TIMEOUT_MS}ms) pidiendo token de Spotify`));
      });
      req.on('error', reject);
      req.write(body);
      req.end();
    });
  }

  /**
   * Hace una request autenticada a la API de Spotify.
   * @param {string} path - Ruta de la API (sin el host)
   * @returns {Promise<object>}
   */
  async apiRequest(path) {
    const token = await this.getAccessToken();

    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.spotify.com',
        path,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            if (res.statusCode === 200) {
              resolve(json);
            } else {
              reject(new Error(`Spotify API ${res.statusCode}: ${json.error?.message || data}`));
            }
          } catch (e) {
            reject(e);
          }
        });
      });

      req.setTimeout(REQUEST_TIMEOUT_MS, () => {
        req.destroy(new Error(`Timeout (${REQUEST_TIMEOUT_MS}ms) en request a ${path}`));
      });
      req.on('error', reject);
      req.end();
    });
  }

  /**
   * Extrae el ID y tipo de un link de Spotify.
   * @param {string} url
   * @returns {{ type: 'track'|'album'|'playlist', id: string } | null}
   */
  parseSpotifyUrl(url) {
    try {
      const urlObj = new URL(url);
      if (!urlObj.hostname.includes('spotify.com')) return null;

      const parts = urlObj.pathname.split('/').filter(Boolean);
      // Estructura: /track/ID, /album/ID, /playlist/ID
      if (parts.length >= 2) {
        const type = parts[0];
        const id = parts[1];
        if (['track', 'album', 'playlist'].includes(type) && id) {
          return { type, id };
        }
      }
    } catch {
      // URL inválida
    }
    return null;
  }

  /**
   * Obtiene metadata de un track de Spotify.
   * @param {string} trackId
   * @returns {Promise<SpotifyTrackInfo>}
   */
  async getTrack(trackId) {
    const data = await this.apiRequest(`/v1/tracks/${trackId}`);
    return {
      title: data.name,
      artist: data.artists.map((a) => a.name).join(', '),
      album: data.album.name,
      duration: data.duration_ms,
      imageUrl: data.album.images?.[0]?.url || null,
      uri: data.external_urls.spotify,
      isrc: data.external_ids?.isrc || null,
    };
  }

  /**
   * Obtiene todos los tracks de un álbum de Spotify.
   * @param {string} albumId
   * @returns {Promise<Array<SpotifyTrackInfo>>}
   */
  async getAlbum(albumId) {
    const albumData = await this.apiRequest(`/v1/albums/${albumId}`);
    const albumName = albumData.name;
    const albumImage = albumData.images?.[0]?.url || null;

    // Los tracks del album vienen sin artist completo, enriquecemos
    return albumData.tracks.items.map((track) => ({
      title: track.name,
      artist: track.artists.map((a) => a.name).join(', '),
      album: albumName,
      duration: track.duration_ms,
      imageUrl: albumImage,
      uri: track.external_urls.spotify,
      isrc: null,
    }));
  }

  /**
   * Obtiene todos los tracks de una playlist de Spotify.
   * Maneja playlists grandes con paginación automática.
   * @param {string} playlistId
   * @param {number} [limit=100] - Límite de canciones a obtener
   * @returns {Promise<{ name: string, tracks: Array<SpotifyTrackInfo> }>}
   */
  async getPlaylist(playlistId, limit = 100) {
    const playlistData = await this.apiRequest(`/v1/playlists/${playlistId}?fields=name,images,tracks.items(track(name,artists,album,duration_ms,external_urls,external_ids)),tracks.next`);

    const name = playlistData.name;
    const tracks = [];

    for (const item of playlistData.tracks.items) {
      if (!item.track || item.track.type !== 'track') continue; // saltar episodios y nulos
      tracks.push({
        title: item.track.name,
        artist: item.track.artists.map((a) => a.name).join(', '),
        album: item.track.album?.name || '',
        duration: item.track.duration_ms,
        imageUrl: item.track.album?.images?.[0]?.url || null,
        uri: item.track.external_urls.spotify,
        isrc: item.track.external_ids?.isrc || null,
      });

      if (tracks.length >= limit) break;
    }

    return { name, tracks };
  }

  /**
   * Construye la query de búsqueda para YouTube a partir de metadata de Spotify.
   * Usa ISRC si está disponible (más preciso), sino usa título + artista.
   * @param {SpotifyTrackInfo} trackInfo
   * @returns {string}
   */
  buildSearchQuery(trackInfo) {
    // ISRC permite encontrar la versión exacta de una canción en plataformas que lo soportan
    // En ytmsearch de Lavalink, una búsqueda por ISRC puede dar resultados más precisos
    return `${trackInfo.artist} - ${trackInfo.title}`;
  }
}

/**
 * @typedef {Object} SpotifyTrackInfo
 * @property {string} title
 * @property {string} artist
 * @property {string} album
 * @property {number} duration
 * @property {string|null} imageUrl
 * @property {string} uri
 * @property {string|null} isrc
 */

// Exportar instancia singleton
module.exports = new SpotifyResolver();
