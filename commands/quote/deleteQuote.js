const Command = require("../../utils/commandClass");
const { QuoteModel } = require("./quoteModel");
const { error, success } = require("../../utils/embedTemplates");
const { Permissions } = require("discord.js");
const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");

const deleteQuote = new Command();
deleteQuote.aliases = ["del", "delete"];
deleteQuote.description = `Deletes the quote with the given ID.`
deleteQuote.usage = "(quote ID to delete)"
deleteQuote.slashCommand = new SlashCommandSubcommandBuilder()
    .setName("delete")
    .setDescription("Delete a quote by its ID")
    .addIntegerOption(option => option.setName("quoteid").setDescription("Quote ID to delete").setRequired(true));

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
            quoteId: args[0],
            guildId: msg.guild.id
        },
        force: true
    });
    if (deleted === 1) await msg.channel.send({ embeds: [success(`Successfully delete quote with ID \`${args[0]}\``)] });
    else await msg.channel.send({ embeds: [error(`No quote with ID \`${args[0]}\` on this server to delete`)] });

}

deleteQuote.interaction = async function (interaction, quoteId) {
    if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
        await interaction.reply({ embeds: [error("You don't have permissions to delete quotes. Requires `ADMINISTRATOR`.")], ephemeral: true });
        return;
    };
    const deleted = await QuoteModel.destroy({
        where: {
            quoteId: quoteId,
            guildId: interaction.guild.id
        },
        force: true
    });
    if (deleted === 1) await interaction.reply({ embeds: [success(`Successfully delete quote with ID \`${quoteId}\``)], ephemeral: true });
    else await interaction.reply({ embeds: [error(`No quote with ID \`${quoteId}\` on this server to delete`)], ephemeral: true });

}

module.exports = deleteQuote;