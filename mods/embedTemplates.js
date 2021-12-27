const { MessageEmbed } = require("discord.js");

const error = (desc) => new MessageEmbed()
    .setColor("#e24848")
    .setTitle("Error")
    .setDescription(desc);

const success = (desc) => new MessageEmbed()
    .setColor("#6aa84f")
    .setTitle("Success")
    .setDescription(desc);

const quoteEmbed = (quote) => new MessageEmbed()
    .setColor("#eeac60")
    .setDescription(quote.quote)
    .setFooter(`-${quote.name}, ${formatDate(quote.createdAt)} | Quote ID: ${quote.quoteId}`);

const formatDate = (date) => `${date.getUTCDate()}.${date.getUTCMonth()} ${date.getUTCFullYear()}`;

module.exports = { error, success, quoteEmbed };