const Command = require("../utils/commandClass");
const { basic } = require("../utils/embedTemplates");

let ping = new Command();

ping.command = function (msg, args) {
    msg.channel.send({ embeds: [basic("Pong!", `Latency: \`${Date.now() - msg.createdAt}\`ms`)] })
}

module.exports = ping;