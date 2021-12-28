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
    if (args.length === 0) {
        getRandom.command(msg, args);
        return;
    }
    msg.channel.send({ content: "This part isn't correctly implemented yet." });
}

module.exports = quote;
