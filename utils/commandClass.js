module.exports = class Command {
    command;
    aliases;
    subcommands;
    usage = "";
    description = "";
    aliasesDict;  // RESERVED for quick alias referencing
    // Path to a command: ex.: quote all => ["quote", "all"]
    commandPath = [];  // RESERVED, gets generated on its own
    helpEmbed; // RESERVED, stores the help embed for the command
}