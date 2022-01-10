/*

░░░░░██╗███████╗░██████╗  ██████╗░░█████╗░████████╗
░░░░░██║██╔════╝██╔════╝  ██╔══██╗██╔══██╗╚══██╔══╝
░░░░░██║█████╗░░╚█████╗░  ██████╦╝██║░░██║░░░██║░░░
██╗░░██║██╔══╝░░░╚═══██╗  ██╔══██╗██║░░██║░░░██║░░░
╚█████╔╝███████╗██████╔╝  ██████╦╝╚█████╔╝░░░██║░░░
░╚════╝░╚══════╝╚═════╝░  ╚═════╝░░╚════╝░░░░╚═╝░░░
*/

const checkFiles = require("./utils/firstStartup");
checkFiles();  // makes sure all the needed files are here

const { Client, Intents } = require("discord.js");
const { commandHandler } = require("./utils/commandHandler");
const handleReaction = require("./commands/quote/handleReaction");
const { handleInteraction } = require("./commands/quote/handleInteraction");
const registerSlashCommands = require("./utils/loadSlashCommands");

const { token } = require("./config.json");


const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
    partials: ["MESSAGE", "CHANNEL", "REACTION"],
});

client.once("ready", sendStartupMessage);

client.on("messageCreate", message => commandHandler(message, client));

client.on('interactionCreate', handleInteraction);
client.on("messageReactionAdd", handleReaction);

client.login(token);


function sendStartupMessage() {
    let text = "\033[92m✓\033[3;94m " + client.user.username + "\033[0m successfully started up! \033[92m✓\033[0m"
    let msg = "░".repeat(33 + client.user.username.length) + `\n░ ${text} ░\n` + "░".repeat(33 + client.user.username.length);
    console.log(msg);
    client.user.setPresence({ activities: [{ name: 'to ;help', type: 2 }] });  // 2 = listening to...
    registerSlashCommands(client);
}

