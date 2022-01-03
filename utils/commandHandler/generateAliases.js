
/*
 * Links up all aliases to lead to their correct command recursively
 */
module.exports = function generateAliases(cmds) {
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