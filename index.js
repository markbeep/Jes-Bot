const { Client, Intents } = require("discord.js");
const { token } = require("./config.json");
const { commandHandler } = require("./commandHandler");

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.once("ready", () => console.log("Ready!"));

client.on("messageCreate", message => commandHandler(message, client));

client.login(token);
