const Command = require("../../lib/commandClass");
const { QuoteModel, sequelize } = require("./quoteModel");
const { error, success, quoteEmbed } = require("../../lib/embedTemplates");

const getRandom = new Command();

getRandom.command = async function (msg, args) {
    let quote;
    if (args.length > 0) {  // get random from user
        const member = msg.mentions.members.first();
        const name = (member == undefined) ? args[0] : member.user.username;
        if (member == undefined) {  // its not a mention
            quote = await QuoteModel.findOne({
                order: sequelize.random(),
                where: {
                    name: args[0],
                    guildId: msg.guild.id
                }
            });
        } else {
            quote = await QuoteModel.findOne({
                order: sequelize.random(),
                where: {
                    userId: member.id,
                    guildId: msg.guild.id
                }
            });
        }
        if (quote == null) {
            msg.channel.send({ embeds: [error(`There are no quotes on this server from \`${name}\``)] });
            return;
        }
    } else {
        quote = await QuoteModel.findOne({
            order: sequelize.random(),
            where: {
                guildId: msg.guild.id
            }
        });
        if (quote == null) {
            msg.channel.send({ embeds: [error(`There are no quotes on this server yet`)] });
            return;
        }
    }
    msg.channel.send({ embeds: [quoteEmbed(quote)] });
}

module.exports = getRandom;