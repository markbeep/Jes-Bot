const { MessageEmbed } = require("discord.js");
const Command = require("../../utils/commandClass");
const getCommandObject = require("../../utils/commandHandler/getCommandObject");
const { error } = require("../../utils/embedTemplates");
const { prefix } = require("../../config.json");

const help = new Command();
help.aliases = ["h"];
help.description = "Calls the help page.";
help.usage = "[command]";

let commands;
let aliases;
let helpPageEmbed;

help.command = async function (msg, args) {
    if (args.length > 0) {
        let { command: cmd, args: newArgs } = getCommandObject(args[0], args.slice(1), aliases, commands);
        if (cmd == null) {
            await msg.channel.send({ embeds: [error(`The command \`${args.join(" ").slice(0, 20)}\` does not exist.`)] })
            return;
        }
        await msg.channel.send({ embeds: [cmd.helpEmbed] });
        return;
    }
    // send all commands
    await msg.channel.send({ embeds: [helpPageEmbed] });
}

/*
 * Makes all commands and aliases available to the help page and
 * pre-generates the help page so it can be instantly sent later on
 */
function setupHelp(cmds, alis) {
    commands = cmds;
    aliases = alis;
    helpPageEmbed = new MessageEmbed()
        .setColor("#6aa84f")
        .setTitle("Help Page")
        .setDescription("Here are all the currently available commands listed:");
    Object.keys(commands).forEach(k => helpPageEmbed.addField(k, (cmds[k].description.length == 0) ? "*No Description*" : cmds[k].description));
    generateEmbeds(commands);
}

/*
 * Pre-Generates the embed pages for all the commands
 */
function generateEmbeds(cmds) {
    Object.keys(cmds).forEach(key => {
        cmds[key].helpEmbed = createEmbed(key, cmds);
        if (cmds[key].subcommands != null) generateEmbeds(cmds[key].subcommands);
    });
}

/*
 * Creates the embed page for a specific command
 */
function createEmbed(key, commands) {
    let cmd = commands[key];
    let embed = new MessageEmbed()
        .setColor("#6aa84f")
        .setTitle("Help Page")
        .setDescription((cmd.description.length == 0) ? "*No Description*" : cmd.description)
        .addField("Usage", `\`${prefix}${cmd.commandPath.join(" ")}${((cmd.usage.length > 0) ? " " : "") + cmd.usage}\``);
    if (cmd.aliases != null) embed.addField("Aliases", `\`${cmd.aliases.join(", ")}\``);
    if (cmd.subcommands != null) embed.addField("Subcommands", `\`${Object.keys(cmd.subcommands).join(", ")}\``);
    return embed;
}

module.exports = { help, setupHelp };