const Command = require("../../utils/commandClass");
const { basic } = require("../../utils/embedTemplates");

let info = new Command();

info.command = async function (msg, args, client) {
    desc = `**Uptime:** \`${Math.round(client.uptime / 36e4) / 10}\` hours\n` // rounded to .1
        + `**Node.js Version:** \`${process.version}\`\n`
        + `**Invite:** [Invite me!](https://discord.com/api/oauth2/authorize?client_id=920348995933589554&permissions=2147485696&scope=bot)`
    await msg.channel.send({ embeds: [basic("Info", desc)] });
}

module.exports = info;