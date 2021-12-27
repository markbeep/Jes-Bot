const Command = require("../../lib/commandClass");
const { QuoteModel } = require("./quoteModel");
const { error, success } = require("../../lib/embedTemplates");

const add = new Command();

add.command = async function (msg, args) {
    if (args < 2) {
        msg.channel.send({ embeds: [error("To add a quote you need a `name` and the `quote`. You're missing those.")] });
        return;
    }
    const member = msg.mentions.members.first();
    const name = (member == undefined) ? args[0] : member.user.username;
    const userId = (member == undefined) ? null : member.id;
    const quote = args.slice(1).join(" ");
    const addedQuote = await QuoteModel.create({
        name: name,
        addedByUserId: msg.author.id,
        userId: userId,
        guildId: msg.guild.id,
        quote: quote,
    });
    msg.channel.send({ embeds: [success(`Successfully added the quote ID \`${addedQuote.quoteId}\` to \`${name}\``)] });
}

module.exports = add;