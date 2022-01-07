const all = require("./all");
const { add } = require("./add");
const get = require("./get");
const getRandom = require("./getRandom");
const deleteQuote = require("./deleteQuote");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { QuoteModel } = require("./quoteModel");


async function handleInteraction(interaction) {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;
    if (commandName == "add") {
        let subCommand = options.getSubcommand(false);
        if (subCommand == "user") {
            let user = options.getUser("user");
            let quote = options.getString("quote");
            await add.interaction(interaction, quote, user.username, user);
            return;
        } if (subCommand == "name") {
            let name = options.getString("name");
            let quote = options.getString("quote");
            await add.interaction(interaction, quote, name);
            return;
        }
        return;
    }
    if (commandName == "all") {
        let subCommand = options.getSubcommand(false);
        if (subCommand == "user") {
            let user = options.getUser("user");
            await all.interaction(interaction, user.username, user);
            return;
        } if (subCommand == "name") {
            let name = options.getString("name");
            await all.interaction(interaction, user.username, null);
            return;
        }
        return;
    }
}

async function getCommandsForGuild(guildId) {
    return [
        await getAdd(),
        await getAll(guildId),
    ]
        .map(command => command.toJSON());
}

async function getAdd() {
    return new SlashCommandBuilder()
        .setName("add")
        .setDescription("Add a quote to a user or name")
        .addSubcommand(subCommand =>
            subCommand
                .setName("user")
                .setDescription("Add a quote to a Discord user")
                .addUserOption(option =>
                    option.setName("user").setDescription("The user to add a quote to").setRequired(true))
                .addStringOption(option =>
                    option.setName("quote").setDescription("The quote to add to the user").setRequired(true)))
        .addSubcommand(subCommand =>
            subCommand
                .setName("name")
                .setDescription("Add a quote to a name")
                .addStringOption(option =>
                    option.setName("name").setDescription("The name of the person you want to add a quote to").setRequired(true))
                .addStringOption(option =>
                    option.setName("quote").setDescription("The quote to add to the name").setRequired(true)));
}

async function getAll(guildId) {
    let quotes = await QuoteModel.findAll({
        attributes: ["name"],
        where: {
            guildId: guildId
        },
        group: ["name"]
    });
    let names = quotes.filter(e => e.name != undefined).map(e => [e.name, e.name]);
    return new SlashCommandBuilder()
        .setName("all")
        .setDescription("Display all quotes of a user or name")
        .addSubcommand(subCommand =>
            subCommand
                .setName("user")
                .setDescription("View all quotes of a user")
                .addUserOption(option =>
                    option.setName("user").setDescription("The user to view all quotes of").setRequired(true)))
        .addSubcommand(subCommand =>
            subCommand
                .setName("name")
                .setDescription("The name to view all quotes of")
                .addStringOption(option =>
                    option.setName("name").setDescription("The name to view all quotes of").setRequired(true).addChoices(names)))
}

module.exports = { handleInteraction, getCommandsForGuild }