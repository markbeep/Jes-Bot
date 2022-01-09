const Command = require("../../utils/commandClass");
const { QuoteModel, sequelize } = require("./quoteModel");
const { error, quoteEmbed } = require("../../utils/embedTemplates");
const { Sequelize } = require("sequelize");
const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");

const getRandom = new Command();
getRandom.description = "Gets a random quote from either the server or a user.";
getRandom.usage = "[name | mention | user ID]";
getRandom.slashCommand = new SlashCommandSubcommandBuilder()
    .setName("random")
    .setDescription("Get a random quote on this server")
    .addUserOption(option => option.setName("user").setDescription("User to get a random quote from"))
    .addIntegerOption(option => option.setName("name").setDescription("Name to get a random quote from"));

getRandom.command = async function (msg, args) {
    let quote;
    if (args.length > 0) {  // get random from user
        let member = msg.mentions.members.first();
        try {
            if (member == undefined) member = await msg.guild.members.fetch(args[0]);
        } catch (e) { }
        const name = (member == undefined) ? args[0] : member.user.username;
        if (member == undefined) {  // its not a mention
            quote = await QuoteModel.findOne({
                order: sequelize.random(),
                where: {
                    name: { [Sequelize.Op.like]: args[0] },
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

getRandom.interaction = async function (interaction, name = null, user = null) {
    let quote;
    if (name != null) {  // get random from user
        if (user == null) {  // its not a mention
            quote = await QuoteModel.findOne({
                order: sequelize.random(),
                where: {
                    name: { [Sequelize.Op.like]: name },
                    guildId: interaction.guild.id
                }
            });
            console.log(quote);
        } else {
            quote = await QuoteModel.findOne({
                order: sequelize.random(),
                where: {
                    userId: user.id,
                    guildId: interaction.guild.id
                }
            });
        }
        if (quote == null) {
            await interaction.reply({ embeds: [error(`There are no quotes on this server from \`${name}\``)], ephemeral: true });
            return;
        }
    } else {
        quote = await QuoteModel.findOne({
            order: sequelize.random(),
            where: {
                guildId: interaction.guild.id
            }
        });
        if (quote == null) {
            await interaction.reply({ embeds: [error(`There are no quotes on this server yet`)], ephemeral: true });
            return;
        }
    }

    await interaction.reply({ embeds: [quoteEmbed(quote)], ephemeral: true });
}

module.exports = getRandom;