const Command = require("../../utils/commandClass");
const { QuoteModel } = require("./quoteModel");
const { error, quoteEmbed } = require("../../utils/embedTemplates");

const get = new Command();
get.description = "Gets a specific quote by ID.";
get.usage = "(quote ID)";

get.command = async function (msg, args) {
    if (args.length < 1) {
        await msg.channel.send({ embeds: [error("No `Quote ID` given")] });
        return;
    }
    const quote = await QuoteModel.findOne({
        where: {
            quoteId: args[0],
            guildId: msg.guild.id
        }
    });
    if (quote == null) {
        await msg.channel.send({ embeds: [error(`No Quote found with the given ID`)] });
        return;
    }
    await msg.channel.send({ embeds: [quoteEmbed(quote)] });

}

module.exports = get;