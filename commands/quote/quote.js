const Command = require("../../lib/commandClass");
const all = require("./all");
const add = require("./add");
const get = require("./get");
const getRandom = require("./getRandom");
const { QuoteModel } = require("./quoteModel");

const quote = new Command();
quote.aliases = ["q"];
quote.subcommands = { all, add, get, getRandom };

quote.command = async function (msg, args) {
    msg.channel.send({ content: "This sends a random quote" });
}

module.exports = quote;
