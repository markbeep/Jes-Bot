const commands = require("../../commands");  // all commands as an object
const { prefix } = require("../../config.json");
const getCommandObject = require("./getCommandObject");
const generateAliases = require("./generateAliases");
const generatePaths = require("./generatePaths");
const { setupHelp } = require("../../commands/help/help");

/*
 * Dictionary of all top level aliases to their corresponding command
 * This links up aliases into dictionaries for quick lookups.
 * Aliases of subcommands are placed into the same style of dictionaries,
 * but into an attribute of each command called "aliasesDict"
 */
const aliases = generateAliases(commands);
generatePaths(commands);
setupHelp(commands, aliases);

/*
 * Takes in a message object and correctly orders it to a message
 * if applicable.
 */
async function commandHandler(message, client) {
    // if message author is bot
    if (message.author.bot) return;

    let content = message.content.replace(/ {2,}/g, " "); // turns multiple spaces into a single space
    // check if the message starts with the prefix
    let cmd = content.match(new RegExp(prefix + "(\\S+)"));
    if (cmd == null) return;
    cmd = cmd[1]  // first index is the command without the prefix

    // check if there are any words after the prefix
    let args = content.match(/\s(.+)/gm);
    if (args == null) args = [];
    else args = args.map(e => e.trim()).join("\n").trim().split(" ");
    const { command, args: newArgs } = getCommandObject(cmd, args, aliases, commands);
    if (command == null) return;  // this was not a correct command
    command.command(message, newArgs, client);
}

module.exports = { commandHandler, commands, aliases };