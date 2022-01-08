const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token } = require('../config.json');
const { getCommands, addNames } = require("../commands/quote/handleInteraction");
const fs = require("fs");
const crypto = require("crypto");
const { QuoteModel } = require("../commands/quote/quoteModel");


module.exports = async function registerSlashCommands(client) {
    // setup the options for each guild and command
    client.guilds.cache.forEach(async guild => {
        // gets all the names available
        let quotes = await QuoteModel.findAll({
            attributes: ["name"],
            where: {
                guildId: guild.id
            },
            group: ["name"]
        });
        let names = quotes.filter(e => e.name != undefined).map(e => e.name);
        addNames(guild.id, names);
    });

    const guildId = "237607896626495498";

    let slashCommands = await getCommands()
    let fp = `./data/commands.txt`;  // so we only update slash commands if they're different
    let hash = crypto.createHash("sha1").update(JSON.stringify(slashCommands)).digest("hex");
    if (fs.existsSync(fp) && fs.readFileSync(fp, "utf8") == hash) return;  // commands are already registered

    const rest = new REST({ version: '9' }).setToken(token);

    (async () => {
        try {
            console.log('Started refreshing application (/) commands.');

            await rest.put(
                Routes.applicationGuildCommands(client.user.id, guildId),
                { body: slashCommands },
            );

            console.log('Successfully reloaded application (/) commands.');
            fs.writeFileSync(fp, hash);
        } catch (error) {
            console.error(error);
        }
    })();

}
