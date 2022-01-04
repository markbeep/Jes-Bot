const Command = require("../../utils/commandClass");
const { QuoteModel } = require("./quoteModel");
const { error, success } = require("../../utils/embedTemplates");
const { Permissions } = require("discord.js");

const deleteQuote = new Command();
deleteQuote.aliases = ["del", "delete"];

deleteQuote.command = async function (msg, args) {
    if (!msg.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
        await msg.channel.send({ embeds: [error("You don't have permissions to delete quotes. Requires `ADMINISTRATOR`.")] });
        return;
    };
    if (args.length === 0) {
        await msg.channel.send({ embeds: [error("No quote ID given. Don't know what to delete.")] });
        return;
    }
    const deleted = await QuoteModel.destroy({
        where: {
            quoteId: args[0]
        },
        force: true
    });
    if (deleted === 1) await msg.channel.send({ embeds: [success(`Successfully delete quote with ID \`${args[0]}\``)] });
    else await msg.channel.send({ embeds: [error(`No quote with ID \`${args[0]}\` to delete`)] });

}

module.exports = deleteQuote;