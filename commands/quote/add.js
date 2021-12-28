const Command = require("../../lib/commandClass");
const { QuoteModel } = require("./quoteModel");
const { error, success } = require("../../lib/embedTemplates");
const { addedQuoteId } = require("../../config.json");

const add = new Command();

const blacklistedWords = ["add", "get", "all", "getRandom"];

/*
 * Adds a quote to a user
 * Arguments
 * 1. Who to quote
 * 2. What to quote
 * If the quote adder is not the author of the message, it can be passed in via the parameter
 */
add.command = async function (msg, args, quoteAdder = null, sendMessage = true) {
    if (sendMessage && args < 2) {
        msg.channel.send({ embeds: [error("To add a quote you need a `name` and the `quote`. You're missing those.")] });
        return;
    }
    let member = msg.mentions.members.first();
    if (member == undefined) member = await msg.guild.members.cache.get(args[0]);
    const name = (member == undefined) ? args[0] : member.user.username;
    const userId = (member == undefined) ? null : member.id;
    const quote = args.slice(1).join(" ");
    // can't add quotes to people with names of commands
    if (member == undefined && blacklistedWords.includes(name)) {
        sendMessage && msg.channel.send({ embeds: [error(`Can't add quotes to names of commands:\`${name}\``)] });
        return;
    }
    if (member != undefined && (member.id == msg.author.id || member.id == user.id)) {
        sendMessage && msg.channel.send({ embeds: [error(`Can't add quotes to yourself.`)] });
        return;
    }
    const addedQuote = await QuoteModel.create({
        name: name,
        addedByUserId: (quoteAdder == null) ? msg.author.id : quoteAdder.id,
        userId: userId,
        guildId: msg.guild.id,
        quote: quote,
    });
    sendMessage && msg.channel.send({ embeds: [success(`Successfully added the quote ID \`${addedQuote.quoteId}\` to \`${name}\``)] });
    if (!sendMessage) msg.react(addedQuoteId).catch(() => console.log("INFO: Do not have a \"addedQuote\" emoji setup to react with."));
}

module.exports = add;