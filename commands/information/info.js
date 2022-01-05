const Command = require("../../utils/commandClass");
const { basic } = require("../../utils/embedTemplates");

const info = new Command();
info.description = "Displays a variaty of statistics about the bot.";
info.shortDescription = "Displays bot information & the bot invite link";

info.command = async function (msg, args, client) {
    desc = `**Uptime:** \`${Math.round(client.uptime / 36e4) / 10}\` hours\n` // rounded to .1
        + `**Node.js Version:** \`${process.version}\`\n`
        + `**Invite:** [Invite me!](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=2147485696&scope=bot%20applications.commands)`
    await msg.channel.send({ embeds: [basic("Info", desc)] });
}

module.exports = info;