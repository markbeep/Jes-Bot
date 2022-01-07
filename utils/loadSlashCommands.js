const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token } = require('../config.json');
const { SlashCommandBuilder, SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { getCommandsForGuild } = require("../commands/quote/handleInteraction");
const fs = require('fs');

module.exports = async function registerSlashCommands() {
    // Place your client and guild ids here
    const clientId = '928038803568996365';
    const guildId = "237607896626495498";

    let slashCommands = await getCommandsForGuild(guildId)

    const rest = new REST({ version: '9' }).setToken(token);

    (async () => {
        try {
            console.log('Started refreshing application (/) commands.');

            await rest.put(
                Routes.applicationGuildCommands(clientId, guildId),
                { body: slashCommands },
            );

            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }
    })();
}
