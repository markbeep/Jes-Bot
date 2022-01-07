const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token } = require('../config.json');
const { getCommandsForGuild } = require("../commands/quote/handleInteraction");
const fs = require("fs");
const crypto = require("crypto");

module.exports = async function registerSlashCommands(client) {
    // each guild has a separate list of commands
    client.guilds.cache.forEach(async guild => {
        console.log(`Setting up slash commands for guild: ${guild.id}...`);
        let slashCommands = await getCommandsForGuild(guild.id)
        let fp = `./data/${guild.id}.txt`;
        let hash = crypto.createHash("sha1").update(JSON.stringify(slashCommands)).digest("hex");
        if (fs.existsSync(fp) && fs.readFileSync(fp, "utf8") == hash) return;  // commands are already registered

        const rest = new REST({ version: '9' }).setToken(token);

        (async () => {
            try {
                console.log('Started refreshing application (/) commands.');

                await rest.put(
                    Routes.applicationGuildCommands(client.user.id, guild.id),
                    { body: slashCommands },
                );

                console.log('Successfully reloaded application (/) commands.');
                fs.writeFileSync(fp, hash);
            } catch (error) {
                console.error(error);
            }
        })();
    });

}
