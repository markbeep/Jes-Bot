const Command = require("../../mods/commandClass");
const QuoteModel = require("./quoteModel");

const add = new Command();

add.command = async function (msg, args) {
    msg.channel.send({ content: "This adds a quote" });
    if (args < 2) {
        msg.channel.send({ content: "To add a quote you need a `name` and the `quote`. You're missing those." });
        return;
    }
    const name = args[0];
    const quote = args.slice(1).join(" ");
    const addedQuote = await QuoteModel.create({
        name: name,
        addedByUserId: msg.author.id,
        guildId: msg.guild.id,
        quote: quote,
    });
    msg.channel.send({ content: `Successfully added the quote with ID \`${addedQuote.quoteID}\`` });
}

module.exports = add;