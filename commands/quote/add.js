const Command = require("../../utils/commandClass");
const { QuoteModel } = require("./quoteModel");
const { error, success } = require("../../utils/embedTemplates");
const { addedQuoteId } = require("../../config.json");
const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { addNames, addQuoteIds } = require("./quoteCache");
const { Sequelize } = require("sequelize");

const add = new Command();
add.description = `Adds a quote to a user.`
add.usage = "(name | mention | user ID) (quote)"
add.slashCommand = new SlashCommandSubcommandBuilder()
    .setName("add")
    .setDescription("Add a quote to a user or name")
    .addUserOption(option => option.setName("user").setDescription("User to add a quote to"))
    .addStringOption(option => option.setName("name").setDescription("Name to add a quote to"))
    .addStringOption(option => option.setName("quote").setDescription("The quote that should be added"));


let blacklistedWords = [];
function setBlackListedWords(commands) {
    Object.keys(commands).forEach(key => {
        blacklistedWords.push(key);
        if (commands[key].aliases != null)
            Object.values(commands[key].aliases).forEach(k => blacklistedWords.push(k));
        if (commands[key].subcommands != null)
            setBlackListedWords(commands[key].subcommands);
    });
}

/*
 * Adds a quote to a user
 * Arguments
 * 1. Who to quote
 * 2. What to quote
 * If the quote adder is not the author of the message, it can be passed in via the parameter
 */
add.command = async function (msg, args) {
    if (args < 2) {
        await msg.reply({
            embeds: [error("To add a quote you need a `name` and the `quote`. You're missing those.")],
            allowedMentions: { repliedUser: false }
        });
        return;
    }
    let member = msg.mentions.members.first();
    try {
        if (member == undefined) member = await msg.guild.members.fetch(args[0]);
    } catch (e) { }
    const name = (member == undefined) ? args[0] : member.user.username;
    const userId = (member == undefined) ? null : member.id;
    let quote = args.slice(1).join(" ");
    if (quote.length > 1024) {
        await msg.reply({
            embeds: [error("Quote is too long. Max quote length is currently `1024` characters.")],
            allowedMentions: { repliedUser: false }
        });
        return;
    }
    // can't add quotes to people with names of commands
    if (member == undefined && blacklistedWords.includes(name)) {
        await msg.reply({
            embeds: [error(`Can't add quotes to names of commands: \`${name}\``)],
            allowedMentions: { repliedUser: false }
        });
        return;
    }
    if (member != undefined && (member.id == msg.author.id || member.id == msg.author.id)) {
        await msg.reply({
            embeds: [error(`Can't add quotes to yourself.`)],
            allowedMentions: { repliedUser: false }
        });
        return;
    }
    if (await checkDuplicate(quote, msg.guild.id, name)) {
        await msg.reply({
            embeds: [error("This quote has already been added to that name")],
            allowedMentions: { repliedUser: false }
        });
        return;
    }
    const addedQuote = await QuoteModel.create({
        name: name,
        addedByUserId: msg.author.id,
        userId: userId,
        guildId: msg.guild.id,
        quote: quote,
    });
    addQuoteIds(msg.guild.id, [addedQuote.quoteId]);
    addNames(msg.guild.id, [addedQuote.name]);
    await msg.reply({
        embeds: [success(`Successfully added the quote ID \`${addedQuote.quoteId}\` to \`${name}\``)],
        allowedMentions: { repliedUser: false }
    });
    allowedMentions: { repliedUser: false }
}


add.reaction = async function (msg, quote, quoteAdder) {
    if (msg.partial) msg = await msg.fetch();
    if (quote.length > 1024) {
        await msg.react("852876951407820820");  // too long quote reaction
        return;
    }
    if (msg.author.id == quoteAdder.id) {
        await msg.react("852877064515092520");  // no self quote reaction
        return;
    }
    if (await checkDuplicate(quote, msg.guild.id, msg.author.username)) {
        return;  // duplicate quote, simply ignore
    }
    const addedQuote = await QuoteModel.create({
        name: msg.author.username,
        addedByUserId: quoteAdder.id,
        userId: msg.author.id,
        guildId: msg.guild.id,
        quote: quote,
    });
    msg.react(addedQuoteId).catch(() => console.log("INFO: Do not have a \"addedQuote\" emoji setup to react with."));
    await msg.reply({
        embeds: [success(`Successfully added the quote ID \`${addedQuote.quoteId}\` to \`${msg.author.username}\``)],
        allowedMentions: { repliedUser: false }
    });
}

add.interaction = async function (interaction, quote, name, user = null) {
    if (quote.length > 1024) {
        await interaction.reply({ embeds: [error("Quote is too long. Max quote length is currently `1024` characters.")], ephemeral: true });
        return;
    }
    // can't add quotes to people with names of commands
    if (blacklistedWords.includes(name)) {
        await interaction.reply({ embeds: [error(`Can't add quotes to names of commands: \`${name}\``)], ephemeral: true });
        return;
    }
    if (interaction.member.id == user?.id) {
        await interaction.reply({ embeds: [error(`Can't add quotes to yourself.`)], ephemeral: true });
        return;
    }
    if (await checkDuplicate(quote, interaction.guild.id, name)) {
        await interaction.reply({ embeds: [error("This quote has already been added to that name")] });
        return;
    }
    const addedQuote = await QuoteModel.create({
        name: name,
        addedByUserId: interaction.member.id,
        userId: user?.id,
        guildId: interaction.guild.id,
        quote: quote,
    });
    addQuoteIds(interaction.guild.id, [addedQuote.quoteId]);
    addNames(interaction.guild.id, [addedQuote.name]);
    await interaction.reply({ embeds: [success(`Successfully added the quote ID \`${addedQuote.quoteId}\` to \`${name}\``)], ephemeral: true });
}


// returns true if its a duplicate, false otherwise
async function checkDuplicate(quote, guildId, name) {
    let result = await QuoteModel.findOne({
        where: {
            name: { [Sequelize.Op.like]: name },
            quote: { [Sequelize.Op.like]: quote },
            guildId: guildId,
        }
    });
    return result != null;
}

module.exports = { add, setBlackListedWords };