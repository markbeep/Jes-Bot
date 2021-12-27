const Command = require("../../lib/commandClass");
const { QuoteModel, sequelize } = require("./quoteModel");
const { error, success, quoteEmbed } = require("../../lib/embedTemplates");

const get = new Command();

get.command = async function (msg, args) {
    if (args.length < 1) {
        msg.channel.send({ embeds: [error("No `Quote ID` given")] });
        return;
    }
    const quote = await QuoteModel.findOne({
        where: {
            quoteId: args[0],
            guildId: msg.guild.id
        }
    });
    if (quote == null) {
        msg.channel.send({ embeds: [error(`No Quote found with the given ID`)] });
        return;
    }
    msg.channel.send({ embeds: [quoteEmbed(quote)] });

}

module.exports = get;