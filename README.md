# 🎵 Discord Music Bot

Bot de música para Discord con soporte multi-plataforma, construido con **Node.js**, **discord.js v14** y **Lavalink v4**. Listo para producción con Docker Compose.

---

## Características

- Reproducción desde **YouTube**, **YouTube Music**, **SoundCloud**, **Bandcamp**, **Twitch**, URLs HTTP directas
- **Spotify**: carga tracks, álbumes y playlists completos (metadata via API → reproducción en YouTube)
- Slash commands nativos de Discord
- Sistema de cola por servidor con shuffle, skip múltiple, remove y más
- Embeds elegantes con progreso, miniaturas y duración
- Auto-desconexión cuando el canal queda vacío
- Manejo de errores descriptivo y amigable
- Arquitectura limpia y modular, fácil de extender

---

## Tecnologías

| Componente | Tecnología | Versión |
|---|---|---|
| Lenguaje | Node.js | 20.x LTS |
| API Discord | discord.js | 14.x |
| Cliente Lavalink | lavalink-client | 2.x |
| Servidor de audio | Lavalink | 4.x |
| Plugin YouTube | youtube-source | 1.x |
| Plugin multi-fuente | LavaSrc | 4.x |
| Contenedores | Docker + Compose | — |
| Logging | Winston | 3.x |

---

## Requisitos previos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y corriendo
- Una cuenta de Discord con acceso al [Developer Portal](https://discord.com/developers/applications)
- (Opcional pero recomendado) Una aplicación en [Spotify for Developers](https://developer.spotify.com/dashboard)

---

## Configuración paso a paso

### 1. Crear el bot en Discord Developer Portal

1. Ve a [discord.com/developers/applications](https://discord.com/developers/applications)
2. Haz clic en **"New Application"**, ponle un nombre
3. En el menú lateral, entra a **"Bot"**
4. Haz clic en **"Add Bot"** → confirma
5. En la sección **"Privileged Gateway Intents"**, activa:
   - ✅ `SERVER MEMBERS INTENT`
   - ✅ `MESSAGE CONTENT INTENT` (aunque no lo usamos activamente, algunas librerías lo requieren)
6. Copia el **Token** del bot (botón "Reset Token" si no lo ves) — guárdalo, lo necesitarás
7. Ve a **"OAuth2" → "General"** y copia el **Application ID**

### 2. Invitar el bot a tu servidor

1. Ve a **"OAuth2" → "URL Generator"**
2. En **Scopes**, selecciona: `bot` + `applications.commands`
3. En **Bot Permissions**, selecciona:
   - `Connect` (unirse a canales de voz)
   - `Speak` (hablar en canales de voz)
   - `Send Messages`
   - `Embed Links`
   - `Read Message History`
   - `View Channels`
4. Copia la URL generada y ábrela en el navegador
5. Selecciona tu servidor y autoriza

**Permisos mínimos necesarios:** `Connect`, `Speak`, `Send Messages`, `Embed Links`

### 3. (Opcional) Configurar Spotify

Spotify solo se necesita para cargar sus playlists/álbumes/tracks. El audio **no** viene de Spotify.

1. Ve a [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
2. Haz clic en **"Create app"**
3. Rellena nombre y descripción, acepta los términos
4. En la aplicación creada, ve a **"Settings"** y copia:
   - **Client ID**
   - **Client Secret**

> Sin estas credenciales, los links de Spotify no funcionarán, pero YouTube/SoundCloud/etc. sí.

### 4. Configurar el archivo .env

```bash
# En la raíz del proyecto:
cp .env.example .env
```

Abre `.env` y completa los valores:

```env
# Obligatorio
DISCORD_TOKEN=tu_token_aqui
DISCORD_CLIENT_ID=tu_application_id_aqui

# Para desarrollo (registro instantáneo de comandos)
DISCORD_GUILD_ID=id_de_tu_servidor_de_prueba

# Spotify (opcional)
SPOTIFY_CLIENT_ID=tu_spotify_client_id
SPOTIFY_CLIENT_SECRET=tu_spotify_client_secret

# Lavalink — dejar los valores por defecto para Docker Compose
LAVALINK_PASSWORD=una_contraseña_segura_aqui
LAVALINK_HOST=lavalink
LAVALINK_PORT=2333
```

> **Seguridad**: Cambia `LAVALINK_PASSWORD` por algo seguro. Nunca compartas tu `.env`.

---

## Cómo levantar el proyecto con Docker

### Primera vez (arranque completo)

```bash
# 1. Clonar/entrar al directorio del proyecto
cd DiscordMusicBot

# 2. Crear y completar el .env
cp .env.example .env
# Edita .env con tus credenciales

# 3. Construir y levantar los servicios
docker compose up -d

# 4. Ver los logs en tiempo real
docker compose logs -f

# 5. Registrar los slash commands en Discord
#    (hacer solo una vez, o cuando cambies los comandos)
docker compose exec discord-bot node scripts/deploy-commands.js
```

### Comandos útiles de Docker

```bash
# Ver estado de los servicios
docker compose ps

# Ver logs de Lavalink solamente
docker compose logs -f lavalink

# Ver logs del bot solamente
docker compose logs -f discord-bot

# Reiniciar el bot sin bajar Lavalink
docker compose restart discord-bot

# Bajar todo
docker compose down

# Bajar y eliminar volúmenes (borra logs)
docker compose down -v

# Reconstruir la imagen del bot (después de cambiar código)
docker compose build discord-bot
docker compose up -d discord-bot
```

### Primera descarga de plugins

Al arrancar por primera vez, Lavalink descargará automáticamente:
- `youtube-source` plugin (~5MB)
- `LavaSrc` plugin (~15MB)

Esto puede tardar 1-3 minutos dependiendo tu conexión. Monitorea con:
```bash
docker compose logs -f lavalink
```

Busca esta línea que indica que está listo:
```
Lavalink is ready to accept connections.
```

---

## Comandos del bot

| Comando | Descripción |
|---|---|
| `/play <query>` | Reproduce una canción, URL o playlist |
| `/pause` | Pausa la reproducción |
| `/resume` | Reanuda la reproducción |
| `/skip [cantidad]` | Salta 1 o más canciones |
| `/stop` | Detiene todo y limpia la cola |
| `/queue [página]` | Muestra la cola de reproducción |
| `/nowplaying` | Muestra la canción actual con barra de progreso |
| `/volume [nivel]` | Muestra o ajusta el volumen (1-150) |
| `/shuffle` | Mezcla la cola aleatoriamente |
| `/remove <posición>` | Elimina una canción de la cola |
| `/clear` | Limpia toda la cola |
| `/disconnect` | Desconecta el bot del canal de voz |
| `/help` | Muestra ayuda con todos los comandos |

### Ejemplos de uso del comando /play

```
/play Never Gonna Give You Up
/play https://www.youtube.com/watch?v=dQw4w9WgXcQ
/play https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT
/play https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M
/play https://open.spotify.com/album/4aawyAB9vmqN3uQ7FjRGTy
/play https://soundcloud.com/artista/cancion
/play https://bandcamp.com/artista/album
```

---

## Solución de problemas comunes

### "No se pudo conectar al servidor de audio"
**Causa**: Lavalink no está corriendo o no está listo todavía.
**Solución**:
```bash
docker compose logs lavalink
# Espera a ver: "Lavalink is ready to accept connections."
docker compose restart discord-bot
```

### "Los slash commands no aparecen"
**Causa**: No se han registrado los comandos.
**Solución**:
```bash
docker compose exec discord-bot node scripts/deploy-commands.js
```
Si usas `DISCORD_GUILD_ID`, los comandos aparecen al instante. Sin él, puede tardar hasta 1 hora.

### "Error con Spotify / No se pudo resolver el link de Spotify"
**Causas posibles**:
1. `SPOTIFY_CLIENT_ID` o `SPOTIFY_CLIENT_SECRET` incorrectos o no configurados
2. El plugin LavaSrc no se descargó correctamente
3. La playlist/álbum está configurado como privado

**Soluciones**:
```bash
# Verificar que los plugins se descargaron
ls lavalink/plugins/

# Ver logs de Lavalink para errores de Spotify
docker compose logs lavalink | grep -i spotify

# Reiniciar para que re-descargue plugins
docker compose restart lavalink
```

### "Video unavailable / Video no disponible"
**Causa**: El video fue eliminado de YouTube o no está disponible en tu región.
**Solución**: El bot omitirá automáticamente el track. Nada que hacer.

### El bot entra al canal pero no suena nada
**Causas posibles**:
1. Lavalink no tiene conectividad con YouTube
2. El video requiere inicio de sesión en YouTube

**Solución**:
```bash
# Probar desde un comando del bot con una URL conocida
/play https://www.youtube.com/watch?v=dQw4w9WgXcQ

# Ver logs en tiempo real
docker compose logs -f lavalink discord-bot
```

### El bot usa mucha RAM
**Solución**: Ajusta los límites en `docker-compose.yml`:
```yaml
deploy:
  resources:
    limits:
      memory: 512M  # Aumentar para Lavalink si hay muchos usuarios
```

### Error 429 (Rate limit) de YouTube
**Causa**: Demasiadas requests a YouTube desde la misma IP.
**Soluciones**:
1. Usa el cliente `ANDROID_TESTSUITE` en `application.yml` (ya configurado)
2. Espera unos minutos antes de reintentar
3. Considera usar un proxy (avanzado)

---

## Notas importantes sobre Spotify

### Qué hace el bot con Spotify

1. **Lee** metadata de la API pública de Spotify (Client Credentials Flow)
2. **Busca** el equivalente en YouTube Music usando título + artista o ISRC
3. **Reproduce** desde YouTube — Spotify nunca transmite audio

### Limitaciones

- La coincidencia no es perfecta al 100%. Una búsqueda de "artista - canción" puede traer versiones en vivo, remixes u otras variantes.
- Playlists muy grandes (>600 tracks) pueden tardar varios minutos en cargarse.
- Canciones exclusivas de Spotify sin equivalente en YouTube no se podrán reproducir.
- El bot respeta los [Términos de Uso de Spotify](https://developer.spotify.com/terms). No extrae audio, no cachea audio, no viola DRM.

---

## Advertencias legales y uso responsable

- Este bot utiliza YouTube como fuente de audio. Asegúrate de cumplir con los [Términos de Servicio de YouTube](https://www.youtube.com/t/terms).
- El uso en servidores grandes puede violar los ToS de YouTube si se hacen demasiadas requests automáticas. Este bot está pensado para uso personal/comunitario de pequeña escala.
- No uses este bot para transmitir contenido con copyright en contextos comerciales.
- Spotify se usa únicamente mediante su [API oficial](https://developer.spotify.com/documentation/web-api). No se hace bypass de DRM ni extracción de audio.
- El autor no se hace responsable del uso indebido de este software.

---

## Medidas de seguridad recomendadas para producción

```bash
# 1. Cambiar la contraseña de Lavalink (en .env)
LAVALINK_PASSWORD=contraseña_muy_larga_y_aleatoria

# 2. No exponer el puerto 2333 de Lavalink al exterior si no es necesario
# En docker-compose.yml, comenta o elimina:
# ports:
#   - "2333:2333"

# 3. Usar variables de entorno, nunca hardcodear tokens
# (ya implementado en este proyecto)

# 4. Mantener node_modules y .env en .gitignore
# (ya configurado)

# 5. Ejecutar el contenedor como usuario no-root
# (ya configurado en el Dockerfile)

# 6. Usar Docker secrets en producción empresarial
# (para credenciales en Docker Swarm/Kubernetes)
```

---

## Estructura del proyecto

```
DiscordMusicBot/
├── bot/
│   ├── src/
│   │   ├── commands/music/     # Un archivo por comando slash
│   │   ├── events/
│   │   │   ├── discord/        # Eventos de discord.js
│   │   │   └── lavalink/       # Eventos del manager de Lavalink
│   │   ├── music/
│   │   │   ├── LavalinkManager.js  # Configuración del manager
│   │   │   └── SpotifyResolver.js  # Helper para API de Spotify
│   │   ├── utils/
│   │   │   ├── embeds.js       # Generadores de embeds
│   │   │   ├── formatters.js   # Formateo de duración, detección de fuente, etc.
│   │   │   └── logger.js       # Logger centralizado (Winston)
│   │   ├── config/
│   │   │   └── config.js       # Variables de entorno centralizadas
│   │   └── index.js            # Punto de entrada del bot
│   ├── scripts/
│   │   └── deploy-commands.js  # Registrar slash commands en Discord
│   ├── Dockerfile
│   └── package.json
├── lavalink/
│   ├── application.yml         # Configuración de Lavalink + plugins
│   └── plugins/                # Los plugins se descargan aquí automáticamente
├── docker-compose.yml
├── .env.example                # Plantilla de variables de entorno
├── .gitignore
└── README.md
```

---

## Posibles mejoras futuras

Ver sección al final del README o en el código para ideas de extensión.

---

## Licencia

MIT — Úsalo, modifícalo y distribúyelo libremente, con atribución.
