class Command {
    command = null;
    aliases = null;
    subcommands = null;
    parent = null;
    aliasesDict = null;  // RESERVED for quick alias referencing
}

module.exports = Command;