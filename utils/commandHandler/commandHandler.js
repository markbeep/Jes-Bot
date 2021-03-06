const commands = require("../../commands");  // all commands as an object
const { prefix, debug } = require("../../config.json");
const getCommandObject = require("./getCommandObject");
const generateAliases = require("./generateAliases");
const generatePaths = require("./generatePaths");
const { setupHelp } = require("../../commands/help/help");
const { error } = require("../embedTemplates");

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
    let cmd = content.match(new RegExp("^\\" + prefix + "(\\S+)"));
    if (cmd == null) return;
    cmd = cmd[1]  // first index is the command without the prefix

    // check if there are any words after the prefix
    let args = content.match(/\s(.+)/gm);
    if (args == null) args = [];
    else args = args.map(e => e.trim()).join("\n").trim().split(" ");
    const { command, args: newArgs } = getCommandObject(cmd, args, aliases, commands);
    if (command == null) return;  // this was not a correct command
    const red = "\033[91m";
    const green = "\033[92m";
    const orange = "\033[93m";
    const esc = "\033[0m";
    try {
        if (debug)
            console.log(`${orange}${message.author.username}#${message.author.discriminator}`
                + ` (${message.author.id})${esc}`
                + ` used command: ${green}${content}${esc}`);
        await command.command(message, newArgs, client);
    } catch (e) {
        console.error(`${red}ERROR${esc}\t${e.stack}`);
        // send the error in the channel
        try {
            let sentMessage = await message.channel.send({ embeds: [error(`**${e.name}**\n\`${e.message}\``)] })
            setTimeout(() => sentMessage.delete().catch(_ => _), 10e3);
        } catch (e) { }  // couldnt sent the error message, just ignore it
    }
}

module.exports = { commandHandler, commands, aliases };