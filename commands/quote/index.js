const Command = require("../../mods/commandClass");
const all = require("./all");

const quote = new Command();
quote.aliases = ["q"];
quote.subcommands = { all };

quote.command = (msg, args) => {
    msg.channel.send({ content: "This sends a random quote" });
}

module.exports = quote;
