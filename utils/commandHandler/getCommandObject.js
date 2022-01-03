/*
 * Recursively determines the correct command object with the given input arguments
 */
module.exports = function getCommandObject(cmd, args, aliases, commands) {
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