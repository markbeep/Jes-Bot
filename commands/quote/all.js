const { MessageEmbed } = require("discord.js");
const Command = require("../../lib/commandClass");
const { QuoteModel, sequelize } = require("./quoteModel");
const { error, success, quoteEmbed } = require("../../lib/embedTemplates");
const Page = require("./quotePage");

const all = new Command();

all.command = async function (msg, args) {
    if (args.length === 0) {
        msg.channel.send({ embeds: [error(`No mention or name given to fetch quotes from`)] })
        return;
    }
    const member = msg.mentions.members.first();
    const name = (member == undefined) ? args[0] : member.user.username;
    let quotes;
    if (member == undefined) {
        quotes = await QuoteModel.findAll({
            where: {
                name: name,
                guildId: msg.guild.id
            }
        });
    } else {
        quotes = await QuoteModel.findAll({
            where: {
                userId: member.id,
                guildId: msg.guild.id
            }
        });
    }
    if (quotes.length === 0) {
        msg.channel.send({ embeds: [error(`The user \`${name}\` doesn't have any quotes`)] })
        return;
    }
    let p = new Page(msg, quotes, "All Quotes", "Hello");
    p.start();
}

module.exports = all;