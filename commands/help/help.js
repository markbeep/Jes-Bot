const Command = require("../../utils/commandClass");
const getCommandObject = require("../../utils/commandHandler/getCommandObject");

const help = new Command();
help.isHelpCommand = true;
help.aliases = ["h"];

help.command = async function (msg, args, aliases, commands) {
    if (args.length > 0) {
        let cmd = getCommandObject(args[0], args.slice(1), aliases, commands);


        return;
    }
    // send all commands
}

module.exports = help;