const Command = require("../../utils/commandClass");
const { QuoteModel } = require("./quoteModel");
const { error, success } = require("../../utils/embedTemplates");
const { addedQuoteId } = require("../../config.json");

const add = new Command();
add.description = `Adds a quote to a user.`
add.usage = "(name | mention | user ID) (quote)"

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
add.command = async function (msg, args, quoteAdder = null, sendMessage = true) {
    if (sendMessage && args < 2) {
        await msg.channel.send({ embeds: [error("To add a quote you need a `name` and the `quote`. You're missing those.")] });
        return;
    }
    let member = msg.mentions.members.first();
    try {
        if (member == undefined) member = await msg.guild.members.fetch(args[0]);
    } catch (e) { }
    const name = (member == undefined) ? args[0] : member.user.username;
    const userId = (member == undefined) ? null : member.id;
    const quote = args.slice(1).join(" ");
    if (quote.length > 1024) {
        await msg.channel.send({ embeds: [error("Quote is too long. Max quote length is currently `1024` characters.")] });
        return;
    }
    // can't add quotes to people with names of commands
    if (member == undefined && blacklistedWords.includes(name)) {
        sendMessage && await msg.channel.send({ embeds: [error(`Can't add quotes to names of commands: \`${name}\``)] });
        return;
    }
    if (member != undefined && (member.id == msg.author.id || member.id == msg.author.id)) {
        sendMessage && await msg.channel.send({ embeds: [error(`Can't add quotes to yourself.`)] });
        return;
    }
    const addedQuote = await QuoteModel.create({
        name: name,
        addedByUserId: (quoteAdder == null) ? msg.author.id : quoteAdder.id,
        userId: userId,
        guildId: msg.guild.id,
        quote: quote,
    });
    sendMessage && await msg.channel.send({ embeds: [success(`Successfully added the quote ID \`${addedQuote.quoteId}\` to \`${name}\``)] });
    if (!sendMessage) msg.react(addedQuoteId).catch(() => console.log("INFO: Do not have a \"addedQuote\" emoji setup to react with."));
}

module.exports = { add, setBlackListedWords };