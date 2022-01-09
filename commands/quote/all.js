const Command = require("../../utils/commandClass");
const { QuoteModel } = require("./quoteModel");
const { error } = require("../../utils/embedTemplates");
const Page = require("./quotePage");
const { Sequelize } = require("sequelize");
const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");

const all = new Command();
all.description = `Gets all quotes from a user. If there are too many quotes, \
the quotes are shown in a menu with buttons.
*Note:* The message is removed after a minute of no button being pressed.`
all.usage = "(name | mention | user ID)"
all.slashCommand = new SlashCommandSubcommandBuilder()
    .setName("all")
    .setDescription("Show all quotes from a user")
    .addUserOption(option => option.setName("user").setDescription("User to get all quotes from"))
    .addStringOption(option => option.setName("name").setDescription("Name to get all quotes from"));

all.command = async function (msg, args) {
    if (args.length === 0) {
        await msg.channel.send({ embeds: [error(`No mention or name given to fetch quotes from`)] })
        return;
    }
    let member = msg.mentions.members.first();
    try {
        if (member == undefined) member = await msg.guild.members.fetch(args[0]);
    } catch (e) { }
    const name = (member == undefined) ? args[0] : member.user.username;
    let quotes;
    if (member == undefined) {
        quotes = await QuoteModel.findAll({
            where: {
                name: { [Sequelize.Op.like]: name },
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
        await msg.channel.send({ embeds: [error(`The user \`${name}\` doesn't have any quotes`)] })
        return;
    }
    let p = new Page(msg, quotes, "All Quotes", `All quotes from ${name}:`);
    p.start();
}

all.interaction = async function (interaction, name, user = null) {
    let quotes;
    if (user == undefined) {
        quotes = await QuoteModel.findAll({
            where: {
                name: { [Sequelize.Op.like]: name },
                guildId: interaction.guild.id
            }
        });
    } else {
        quotes = await QuoteModel.findAll({
            where: {
                userId: user.id,
                guildId: interaction.guild.id
            }
        });
    }
    if (quotes.length === 0) {
        await interaction.reply({ embeds: [error(`The user \`${name}\` doesn't have any quotes`)], ephemeral: true })
        return;
    }
    let p = new Page(null, quotes, "All Quotes", `All quotes from ${name}:`, interaction);
    p.start();
}

module.exports = all;