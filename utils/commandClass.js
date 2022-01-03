module.exports = class Command {
    command;
    aliases;
    subcommands;
    description;
    // required, as the help command gets treated differently by the command handler
    isHelpCommand = false;
    aliasesDict;  // RESERVED for quick alias referencing
}
