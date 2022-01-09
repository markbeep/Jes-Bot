const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token } = require('../config.json');
const { getCommands } = require("../commands/quote/handleInteraction");
const { addNames, addQuoteIds } = require("../commands/quote/quoteCache");
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
        // gets all the quote IDs per server
        quotes = await QuoteModel.findAll({
            attributes: ["quoteId"],
            where: {
                guildId: guild.id
            }
        })
        let quoteIds = quotes.filter(e => e.quoteId != undefined).map(e => e.quoteId);
        addQuoteIds(guild.id, quoteIds)
    });

    let slashCommands = await getCommands(); // gets the currently defined slash Commands
    let fp = `./data/commands.txt`;  // so we only update slash commands if they're different
    let hash = crypto.createHash("sha1").update(JSON.stringify(slashCommands)).digest("hex");
    if (fs.existsSync(fp) && fs.readFileSync(fp, "utf8") == hash) return;  // commands are already registered

    // updates the slash commands globally 
    const rest = new REST({ version: '9' }).setToken(token);

    (async () => {
        try {
            console.log('Started refreshing application (/) commands.');
            await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: slashCommands },
            );

            console.log('Successfully reloaded application (/) commands.');
            fs.writeFileSync(fp, hash);
        } catch (error) {
            console.error(error);
        }
    })();

}
