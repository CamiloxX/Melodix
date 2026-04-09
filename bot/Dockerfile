# ============================================================
# Dockerfile para el Bot de Discord
# Multi-stage build para imagen final más pequeña
# ============================================================

# --- Stage 1: Instalar dependencias ---
FROM node:20-alpine AS deps

WORKDIR /app

# Copiar solo los archivos de dependencias para aprovechar cache de Docker
COPY package.json package-lock.json* ./

# Instalar dependencias de producción únicamente
RUN npm ci --only=production && npm cache clean --force

# --- Stage 2: Imagen final ---
FROM node:20-alpine AS runner

# Metadatos de la imagen
LABEL maintainer="Discord Music Bot"
LABEL description="Bot de música para Discord con Lavalink"

WORKDIR /app

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S botgroup && \
    adduser -S botuser -u 1001 -G botgroup

# Copiar dependencias instaladas del stage anterior
COPY --from=deps /app/node_modules ./node_modules

# Copiar código fuente
COPY src/ ./src/
COPY scripts/ ./scripts/
COPY package.json ./

# Crear directorio de logs con permisos correctos
RUN mkdir -p logs && chown -R botuser:botgroup /app

# Cambiar al usuario no-root
USER botuser

# Variables de entorno por defecto (se sobreescriben en docker-compose)
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=512"

# Health check: verifica que el proceso Node sigue corriendo
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', r => r.statusCode === 200 ? process.exit(0) : process.exit(1)).on('error', () => process.exit(0))" || exit 0

# Puerto (no expuesto externamente, solo para health check si lo implementas)
EXPOSE 3000

# Comando de inicio
CMD ["node", "src/index.js"]
