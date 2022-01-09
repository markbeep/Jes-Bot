const all = require("./all");
const { add } = require("./add");
const get = require("./get");
const getRandom = require("./getRandom");
const deleteQuote = require("./deleteQuote");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { allNames, allQuoteIds } = require("./quoteCache");

async function handleInteraction(interaction) {
    // gives back the correct option when using a slash command with autocomplete
    if (interaction.isAutocomplete()) {
        const { commandName, options } = interaction;
        const value = options.getFocused();  // the typed value from the user
        console.log(allNames);
        if (commandName == "all" || commandName == "random")
            await interaction.respond(allNames[interaction.guild.id].filter(e => e.name.toLowerCase().includes(value.toLowerCase())));
        if (commandName == "get" || commandName == "delete")
            await interaction.respond(allQuoteIds[interaction.guild.id].filter(e => e.name.includes(value)));
        return;
    }

    if (!interaction.isCommand()) return;
    // decides what to do when what command is used
    const { commandName, options } = interaction;
    // command to add a quote
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
    // command to view all quotes on the server
    if (commandName == "all") {
        let subCommand = options.getSubcommand(false);
        if (subCommand == "user") {
            let user = options.getUser("user");
            await all.interaction(interaction, user.username, user);
            return;
        } if (subCommand == "name") {
            let name = options.getString("name");
            await all.interaction(interaction, name, null);
            return;
        }
        return;
    }
    // command to delete a quote
    if (commandName == "delete") {
        let quoteId = options.getInteger("quoteid");
        await deleteQuote.interaction(interaction, quoteId);
        return;
    }
    // command to get a certain quote by ID
    if (commandName == "get") {
        let quoteId = options.getInteger("quoteid");
        await get.interaction(interaction, quoteId);
        return;
    }
    // command to get a random quote
    if (commandName == "random") {
        let subCommand = options.getSubcommand(false);
        if (subCommand == "guild") {
            await getRandom.interaction(interaction);
        } else if (subCommand == "name") {
            let name = options.getString("name");
            console.log("Name", name);
            await getRandom.interaction(interaction, name);
        } else if (subCommand == "user") {
            let user = options.getUser("user");
            await getRandom.interaction(interaction, user.username, user);
        }
    }
}


async function getCommands() {
    return [
        addCommand,
        allCommand,
        deleteCommand,
        getCommand,
        randomCommand,
    ]
        .map(command => command.toJSON());
}


const addCommand = new SlashCommandBuilder()
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

const allCommand = new SlashCommandBuilder()
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
                option.setName("name").setDescription("The name to view all quotes of").setRequired(true).setAutocomplete(true)));

const deleteCommand = new SlashCommandBuilder()
    .setName("delete")
    .setDescription("Delete a quote on this server. Requires Administrator permissions")
    .addIntegerOption(option =>
        option.setName("quoteid").setDescription("Quote ID to delete. Needs to be an integer").setRequired(true));

const getCommand = new SlashCommandBuilder()
    .setName("get")
    .setDescription("Get a quote from this server")
    .addIntegerOption(option =>
        option.setName("quoteid").setDescription("Quote ID to fetch. Needs to be an integer").setRequired(true));

const randomCommand = new SlashCommandBuilder()
    .setName("random")
    .setDescription("Get a random quote from the server or a user")
    .addSubcommand(subCommand =>
        subCommand
            .setName("guild")
            .setDescription("Get a random quote from the server"))
    .addSubcommand(subCommand =>
        subCommand
            .setName("name")
            .setDescription("Get a random quote from a name")
            .addStringOption(option =>
                option.setName("name").setDescription("The name to get a random quote from").setRequired(true).setAutocomplete(true)))
    .addSubcommand(subCommand =>
        subCommand
            .setName("user")
            .setDescription("Get a random quote from a user")
            .addUserOption(option =>
                option.setName("user").setDescription("The user to get a random quote from").setRequired(true)));


module.exports = { handleInteraction, getCommands }