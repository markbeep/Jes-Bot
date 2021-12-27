const checkFiles = require("./mods/firstStartup");
checkFiles();  // makes sure all the needed files are here

const { Client, Intents } = require("discord.js");
const { commandHandler } = require("./mods/commandHandler");

const { token } = require("./config.json");


const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.once("ready", () => console.log("Bot Successfully started up!"));

client.on("messageCreate", message => commandHandler(message, client));

client.login(token);
