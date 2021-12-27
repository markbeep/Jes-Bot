/*

░░░░░██╗███████╗░██████╗  ██████╗░░█████╗░████████╗
░░░░░██║██╔════╝██╔════╝  ██╔══██╗██╔══██╗╚══██╔══╝
░░░░░██║█████╗░░╚█████╗░  ██████╦╝██║░░██║░░░██║░░░
██╗░░██║██╔══╝░░░╚═══██╗  ██╔══██╗██║░░██║░░░██║░░░
╚█████╔╝███████╗██████╔╝  ██████╦╝╚█████╔╝░░░██║░░░
░╚════╝░╚══════╝╚═════╝░  ╚═════╝░░╚════╝░░░░╚═╝░░░
*/

const checkFiles = require("./mods/firstStartup");
checkFiles();  // makes sure all the needed files are here

const { Client, Intents } = require("discord.js");
const { commandHandler } = require("./mods/commandHandler");

const { token } = require("./config.json");


const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.once("ready", sendStartupMessage);

client.on("messageCreate", message => commandHandler(message, client));

client.login(token);

function sendStartupMessage() {
    let text = "\033[92m✓\033[3;94m Jes\033[0m successfully started up! \033[92m✓\033[0m"
    let msg = `░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░\n░ ${text} ░\n░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░`
    console.log(msg);
}