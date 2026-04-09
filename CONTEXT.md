# CONTEXT.md — Melodix Music Bot

> **Propósito:** archivo condensado para que Claude (u otro agente) entienda el proyecto sin leer 37 archivos. Siempre leer este archivo primero.

## Identidad
- **Nombre:** Melodix — bot de música para Discord.
- **Repo:** https://github.com/CamiloxX/Melodix (origin/main)
- **Dueño:** Camilo (`CamiloxX`).
- **Raíz local:** `D:\DescargasCamilo\Bottdiscord`

## Stack
- **Bot:** Node.js 20 + `discord.js` v14 + `lavalink-client` v2 (Tomato6966).
- **Audio:** Lavalink v4 (Docker) con plugins:
  - `youtube-source` v1.11.2 (YouTube/YT Music; YT nativo de Lavalink 4 está deshabilitado).
  - `LavaSrc` v4.3.0 (Spotify → resuelve a YouTube via ISRC).
- **Web (landing):** Next.js 14 + Tailwind + framer-motion en `web/`.
- **Infra:** Docker Compose, 2 servicios (`lavalink`, `discord-bot`) en red `musicbot-net`.
- **Logs:** Winston + daily rotate (solo producción).

## Estructura (bot/)
```
bot/
├── Dockerfile                 # multi-stage, usuario no-root (botuser:1001)
├── package.json               # engines: node >=20
├── scripts/deploy-commands.js # registra slash commands
└── src/
    ├── index.js               # bootstrap: client, commands, lavalink, eventos
    ├── config/config.js       # env loader + validación
    ├── music/
    │   ├── LavalinkManager.js # setup del nodo + eventos
    │   └── SpotifyResolver.js # fallback cliente Spotify API (Client Credentials)
    ├── commands/music/        # 13 slash commands (play, skip, queue, stop...)
    ├── events/
    │   ├── discord/           # ready, interactionCreate, voiceStateUpdate
    │   └── lavalink/          # trackStart/End/Error, queueEnd
    └── utils/
        ├── embeds.js          # embed builders estandarizados
        ├── formatters.js      # duration, progressBar, detectSourceType...
        ├── checks.js          # sameVoice + cooldowns (guardias reutilizables)
        └── logger.js          # winston
```

## Variables de entorno críticas (`.env`)
| Var | Obligatorio | Default | Nota |
|---|---|---|---|
| `DISCORD_TOKEN` | sí | — | bot token |
| `DISCORD_CLIENT_ID` | sí | — | application ID |
| `DISCORD_GUILD_ID` | no | — | si está, comandos guild (instantáneo) |
| `LAVALINK_PASSWORD` | sí* | `youshallnotpass` | ⚠️ cambiar en prod; el bot avisa si es default |
| `LAVALINK_HOST` | no | `lavalink` | nombre del servicio docker |
| `LAVALINK_PORT` | no | `2333` | |
| `SPOTIFY_CLIENT_ID/SECRET` | opcional | — | habilita LavaSrc + fallback resolver |
| `DEFAULT_VOLUME` | no | `80` | |
| `MAX_QUEUE_SIZE` | no | `500` | enforced en `/play` |
| `AUTO_DISCONNECT_MS` | no | `300000` | 5 min de cola vacía |
| `DEFAULT_SEARCH_PLATFORM` | no | `ytmsearch` | |
| `EMBED_COLOR` | no | `5865F2` | hex sin `#` |

## Comandos slash (13)
`play, pause, resume, skip, stop, disconnect, queue, nowplaying, volume, shuffle, remove, clear, help`

## Flujo Spotify
1. Usuario pasa URL `spotify.com/track|album|playlist/...` a `/play`.
2. Bot pasa la query tal cual a `player.search({query, source: 'spsearch'})`.
3. **LavaSrc** (Lavalink) lee metadata via `clientId/Secret` del `application.yml` y resuelve a YouTube por ISRC → ytmsearch → ytsearch.
4. **Fallback:** si LavaSrc falla, `SpotifyResolver.js` parsea la URL, pide metadata a Spotify API (Client Credentials, sin login de usuario) y hace búsqueda manual en YouTube Music.

## Decisiones arquitectónicas clave
- **Solo intent `Guilds` + `GuildVoiceStates`** (no `GuildMessages`; no hay message commands).
- **`ephemeral: true` → `flags: MessageFlags.Ephemeral`** (API moderna).
- **`sameVoiceChannel()` obligatorio** en todos los comandos de control (skip/stop/pause/volume/clear/remove/shuffle/disconnect). Previene que cualquiera manipule música desde fuera.
- **Cooldown por usuario 2s** en `interactionCreate` para evitar spam.
- **`uncaughtException` hace `process.exit(1)` en producción** — dejar que Docker reinicie el container es más seguro que seguir corriendo con estado corrupto.
- **`applyVolumeAsFilter: false` + `volumeDecrementer: 0.75`** — máx real es 150*0.75=112.5% para evitar clipping.
- **`selfDeaf: true`** al crear player (ahorra bandwidth, buena práctica Discord).
- **Player se destruye** 5 min después de cola vacía (`onEmptyQueue.destroyAfterMs`).
- **`voiceStateUpdate`:** si todos los humanos salen del canal, pausa auto y el auto-disconnect termina el trabajo.

## Seguridad
- `.env` gitignored; solo `.env.example` versionado.
- Dockerfile: usuario no-root `botuser` uid 1001.
- Sin intents privilegiados (no `MessageContent`, no `GuildMembers`).
- Slash commands rechazados en DM.
- `MAX_QUEUE_SIZE` limita uso de memoria por guild.
- Input del usuario se escapa con `escapeMarkdown()` antes de meterse en embeds.
- SpotifyResolver: requests con timeout 10s (evita hang).
- Lavalink image pineada (no `:4` flotante) → builds reproducibles.
- Warn al arrancar si `LAVALINK_PASSWORD` sigue en el default.
- Dependabot/manual: revisar `discord.js` y `lavalink-client` mensualmente.

## Comandos útiles de desarrollo
```bash
# Levantar todo
docker compose up -d
docker compose logs -f discord-bot

# Registrar slash commands (después de editar cualquier comando)
cd bot && npm run deploy

# Desarrollo local (sin docker del bot)
cd bot && npm run dev   # usa --watch de Node 20

# Solo lavalink en docker, bot local
docker compose up -d lavalink
cd bot && LAVALINK_HOST=localhost npm run dev
```

## Troubleshooting rápido
- **"No pude unirme al canal"** → revisar permisos `Connect` y `Speak` del bot en el canal de voz.
- **Spotify no resuelve** → verificar `SPOTIFY_CLIENT_ID/SECRET` en `.env` (los lee tanto el bot como LavaSrc).
- **Nodo Lavalink no conecta** → `docker compose logs lavalink`; comprobar que plugins descargaron en `lavalink/plugins/`.
- **Comando nuevo no aparece** → correr `npm run deploy` (y usar `DISCORD_GUILD_ID` en dev para propagación instantánea).
- **YouTube age-restricted / bloqueado** → el cliente `TVHTML5EMBEDDED` en `application.yml` suele pasarlos.

## Lo que NO hace el bot (por diseño)
- No lee mensajes (no hay prefix commands, no hay MessageContent intent).
- No extrae audio de Spotify (solo metadata pública → YouTube).
- No guarda playlists de usuarios (sin base de datos).
- No tiene sistema de premium / paywalls.
- No usa voice recognition / TTS.

## Próximos pasos razonables (backlog sugerido)
- [ ] Botones interactivos en `/nowplaying` (pause/skip/stop/loop).
- [ ] `/loop` modo track/queue.
- [ ] `/seek` para saltar dentro del track.
- [ ] Tests de integración con Lavalink dockerizado.
- [ ] Persistir configuración por guild (prefix de búsqueda, volumen default) en SQLite.
