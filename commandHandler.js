// --------------- COMMANDS ---------------
const quote = require("./commands/quote.js");
// ----------------------------------------
const { prefix } = require("./config.json");

// Dictionary of all command objects
const commands = { quote };
// Dictionary of all aliases to their corresponding command
const aliases = generateAliases(commands);


function commandHandler(message, client) {
    // if message author is bot
    if (message.author.bot) return;
    
    // check if the message starts with the prefix
    let cmd = message.content.match(new RegExp(prefix+"(\\S+)"));
    if (cmd == null) return;
    cmd = cmd[1]  // first index is the command without the prefix
    
    // check if there are any words after the prefix
    let args = message.content.match(/\s(.+)/); 
    if (args == null) args = [];
    else args = args[1].split(" ");
    
    // If the command isn't in the list of commands, it might be an alias
    if (!Object.keys(commands).includes(cmd)) { 
        if (!Object.keys(aliases).includes(cmd)) return;  // not an alias nor command
        cmd = aliases[cmd];
    }
    commands[cmd].command(message, args);
}

function generateAliases(cmds) {
    let aliases = {};
    Object.keys(cmds).forEach(key => {
        if (cmds[key].aliases == undefined) return;
        cmds[key].aliases.forEach(ali => aliases[ali] = key);
    });
    return aliases;
}

module.exports = { commandHandler, commands, aliases };