/*
 * Generates the command paths for each command and subcommands
 */
module.exports = function generatePaths(cmds, start = []) {
    Object.keys(cmds).forEach(key => {
        let copy = start.map(e => e);
        copy.push(key);
        cmds[key].commandPath = copy;
        if (cmds[key].subcommands != null) generatePaths(cmds[key].subcommands, copy);
    });
}