const Command = require("../../utils/commandClass");
const { QuoteModel, sequelize } = require("./quoteModel");
const { error, quoteEmbed } = require("../../utils/embedTemplates");

const getRandom = new Command();

getRandom.command = async function (msg, args) {
    let quote;
    if (args.length > 0) {  // get random from user
        let member = msg.mentions.members.first();
        if (member == undefined) member = await msg.guild.members.cache.get(args[0]);
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
            await msg.channel.send({ embeds: [error(`There are no quotes on this server from \`${name}\``)] });
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
            await msg.channel.send({ embeds: [error(`There are no quotes on this server yet`)] });
            return;
        }
    }
    await msg.channel.send({ embeds: [quoteEmbed(quote)] });
}

module.exports = getRandom;