const commands = require("../commands");
const { prefix } = require("../config.json");

/*
 * Dictionary of all top level aliases to their corresponding command
 * This links up aliases into dictionaries for quick lookups.
 * Aliases of subcommands are placed into the same style of dictionaries,
 * but into an attribute of each command called "aliasesDict"
 */
const aliases = generateAliases(commands);

function commandHandler(message, client) {
    // if message author is bot
    if (message.author.bot) return;

    // check if the message starts with the prefix
    let cmd = message.content.match(new RegExp(prefix + "(\\S+)"));
    if (cmd == null) return;
    cmd = cmd[1]  // first index is the command without the prefix

    // check if there are any words after the prefix
    let args = message.content.match(/\s(.+)/);
    if (args == null) args = [];
    else args = args[1].split(" ");

    const { command, args: newArgs } = getCommandObject(cmd, args, aliases, commands);
    if (command == null) return;  // this was not a correct command
    command.command(message, newArgs);
}

function getCommandObject(cmd, args, aliases, commands) {
    let alias = aliases[cmd];
    if (alias == undefined) return { command: null, args: null };  // invalid command in this scope
    let command = commands[alias];  // we have a command object at this point
    if (args.length > 0 && command.aliasesDict != null && command.subcommands != null) {
        // checks if its a lower command call
        let lowerScope = getCommandObject(args[0], args.slice(1), command.aliasesDict, command.subcommands);
        if (lowerScope.command != null) return lowerScope;  // there was a match at the lower scope
    }
    return { command, args };
}

function generateAliases(cmds) {
    if (cmds == null) return {};
    let aliases = {};
    Object.keys(cmds).forEach(key => {
        aliases[key] = key;  // add itself first (so we can quickly check if a command exists)
        if (cmds[key].aliases == undefined) return;
        cmds[key].aliases.forEach(ali => aliases[ali] = key);
        // add all subcommands
        cmds[key].aliasesDict = generateAliases(cmds[key].subcommands);
    });
    return aliases;
}

module.exports = { commandHandler, commands, aliases };