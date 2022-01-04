const Command = require("../../utils/commandClass");
const { basic } = require("../../utils/embedTemplates");

let ping = new Command();

ping.command = async function (msg, args, client) {
    await msg.channel.send({ embeds: [basic("Pong!", `**Latency:** \`${Date.now() - msg.createdAt}\`ms\n**API:** \`${client.ws.ping}ms\``)] })
}

module.exports = ping;