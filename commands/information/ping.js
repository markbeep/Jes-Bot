const Command = require("../../utils/commandClass");
const { basic } = require("../../utils/embedTemplates");

const ping = new Command();
ping.description = `Measures the time it takes for the user's message \
to arrive at the bot. This is done by subtracting the time the message was \
created from the current time (which is when the bot received and parsed \
the message).`;
ping.shortDescription = "Gets the bot's ping";

ping.command = async function (msg, args, client) {
    await msg.channel.send({ embeds: [basic("Pong!", `**Latency:** \`${Date.now() - msg.createdAt}\`ms\n**API:** \`${client.ws.ping}ms\``)] })
}

module.exports = ping;