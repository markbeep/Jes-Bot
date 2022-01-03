const Command = require("../../lib/commandClass");
const all = require("./all");
const add = require("./add");
const get = require("./get");
const getRandom = require("./getRandom");
const deleteQuote = require("./deleteQuote");

const quote = new Command();
quote.aliases = ["q"];
quote.subcommands = { all, add, get, getRandom, deleteQuote };
quote.description = ``
quote.usage = `[Quote ID | Name | <Subcommand>]`

quote.command = async function (msg, args) {
    if (args.length === 0) {
        if (msg.type == "REPLY") {
            let replyMessage = await msg.fetchReference();
            add.command(msg, [replyMessage.author.id, replyMessage.content]);
            return;
        }
        getRandom.command(msg, args);
        return;
    }
    if (args.length === 1) {
        // first argument is a name, quoteID, userID or mention
        let member = msg.mentions.members.first();
        if (member == undefined) member = await msg.guild.members.cache.get(args[0]);
        if (member != undefined) {
            getRandom.command(msg, args);
            return;
        }
        if (parseInt(args[0]) != NaN) get.command(msg, args); // argument is a quote index
        else getRandom.command(msg, args);  // argument is a name
        return;
    }
    // anything with more than 1 argument is a quote being added or all
    if (args[1] == "all") {
        all.command(msg, args[0]);
        return;
    }
    add.command(msg, args);
}

module.exports = quote;
