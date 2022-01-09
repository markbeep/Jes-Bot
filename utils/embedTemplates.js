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

const basic = (title, desc, color = "#808080") => new MessageEmbed()
    .setColor(color)
    .setTitle(title)
    .setDescription(desc);

const formatDate = (date) => `${pad(date.getUTCDate(), 2)}.${pad(date.getUTCMonth() + 1, 2)} ${date.getUTCFullYear()}`;

module.exports = { error, success, quoteEmbed, basic };

// used to 0 pad a numnber so it is n characters long
function pad(num, n) {
    let z = num.toString();
    while (z.length < n) z = "0" + z;
    return z;
}