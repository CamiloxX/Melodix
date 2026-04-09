'use strict';

/**
 * Script para registrar los slash commands en Discord.
 *
 * USO:
 *   node scripts/deploy-commands.js
 *
 * Si DISCORD_GUILD_ID está definido en .env, los comandos se registran
 * en ese servidor específico (instantáneo, ideal para desarrollo).
 *
 * Si no está definido, se registran globalmente (puede tardar hasta 1 hora).
 *
 * Se recomienda ejecutar este script:
 * - Una vez al configurar el bot
 * - Cuando añades/modificas/eliminas comandos
 */

require('dotenv').config();

const { REST, Routes } = require('discord.js');
const { readdirSync } = require('fs');
const path = require('path');

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;
const guildId = process.env.DISCORD_GUILD_ID;

if (!token || !clientId) {
  console.error('ERROR: DISCORD_TOKEN y DISCORD_CLIENT_ID son requeridos en .env');
  process.exit(1);
}

const commands = [];
const commandsPath = path.join(__dirname, '../src/commands');

// Cargar todos los comandos recursivamente
function loadCommandFiles(dirPath) {
  const entries = readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      loadCommandFiles(fullPath);
    } else if (entry.name.endsWith('.js')) {
      try {
        const command = require(fullPath);
        if (command.data) {
          commands.push(command.data.toJSON());
          console.log(`✅ Cargado: /${command.data.name}`);
        }
      } catch (err) {
        console.error(`❌ Error al cargar ${entry.name}: ${err.message}`);
      }
    }
  }
}

loadCommandFiles(commandsPath);

if (commands.length === 0) {
  console.error('No se encontraron comandos para registrar.');
  process.exit(1);
}

console.log(`\nRegistrando ${commands.length} comandos...`);

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    if (guildId) {
      // Registro en servidor específico (instantáneo) — recomendado para desarrollo
      console.log(`Registrando comandos en servidor: ${guildId}`);
      const data = await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: commands }
      );
      console.log(`\n✅ ${data.length} comandos registrados en el servidor ${guildId} exitosamente.`);
    } else {
      // Registro global (hasta 1 hora de propagación) — para producción
      console.log('Registrando comandos globalmente...');
      const data = await rest.put(
        Routes.applicationCommands(clientId),
        { body: commands }
      );
      console.log(`\n✅ ${data.length} comandos registrados globalmente exitosamente.`);
      console.log('⚠️  Los comandos globales pueden tardar hasta 1 hora en aparecer.');
    }
  } catch (error) {
    console.error('❌ Error al registrar comandos:', error.message);
    if (error.code === 50013) {
      console.error('El bot no tiene permisos para registrar comandos en este servidor.');
    }
    process.exit(1);
  }
})();
