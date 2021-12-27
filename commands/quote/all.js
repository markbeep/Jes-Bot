const Command = require("../../mods/commandClass");

const all = new Command();

all.command = (msg, args) => {
    msg.channel.send({ content: "Displaying all quotes..." });
}

module.exports = all;