'use strict';

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize, errors } = format;

/**
 * Logger centralizado con Winston.
 * En producción escribe a archivos rotativos; en desarrollo solo a consola.
 */

const isDev = process.env.NODE_ENV !== 'production';

// Formato para consola (colorido y legible)
const consoleFormat = printf(({ level, message, timestamp: ts, stack }) => {
  const msg = stack || message;
  return `${ts} [${level}] ${msg}`;
});

// Formato para archivo (JSON estructurado)
const fileFormat = format.combine(
  timestamp(),
  errors({ stack: true }),
  format.json()
);

const loggerTransports = [
  new transports.Console({
    format: combine(
      colorize({ all: true }),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      errors({ stack: true }),
      consoleFormat
    ),
    level: isDev ? 'debug' : 'info',
  }),
];

// En producción, también guardar logs en archivo
if (!isDev) {
  try {
    const DailyRotateFile = require('winston-daily-rotate-file');
    loggerTransports.push(
      new DailyRotateFile({
        filename: 'logs/bot-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        format: fileFormat,
        level: 'info',
      })
    );
  } catch {
    // Si no está disponible winston-daily-rotate-file, continuar sin él
  }
}

const logger = createLogger({
  level: isDev ? 'debug' : 'info',
  transports: loggerTransports,
  exitOnError: false,
});

module.exports = logger;
