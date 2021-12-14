const { Client, Intents } = require("discord.js");
const { token } = require("./config.json");
const Sequelize = require("sequelize");

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.once("ready", () => console.log("Ready!"));

client.on("interactionCreate", async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;
    console.log(commandName);
});

client.login(token);