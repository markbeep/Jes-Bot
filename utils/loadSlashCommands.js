const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token } = require('../config.json');
const { SlashCommandBuilder, SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const commands = require("../commands");
const fs = require('fs');

module.exports = function registerSlashCommands() {
    // Place your client and guild ids here
    const clientId = '928038803568996365';
    const guildId = "237607896626495498";
    let cmds = Object.values(commands).filter(v => v.slashCommand != null).map(v => v.slashCommand.toJSON());

    const rest = new REST({ version: '9' }).setToken(token);

    (async () => {
        try {
            console.log('Started refreshing application (/) commands.');

            await rest.put(
                Routes.applicationGuildCommands(clientId, guildId),
                { body: cmds },
            );

            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }
    })();
}
