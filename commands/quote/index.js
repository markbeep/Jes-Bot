const Command = require("../../mods/commandClass");
const all = require("./all");
const add = require("./add");
const QuoteModel = require("./quoteModel");

const quote = new Command();
quote.aliases = ["q"];
quote.subcommands = { all, add };

quote.command = async function (msg, args) {
    msg.channel.send({ content: "This sends a random quote" });
}

module.exports = quote;
