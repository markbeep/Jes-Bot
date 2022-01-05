const all = require("./all");
const { add } = require("./add");
const get = require("./get");
const getRandom = require("./getRandom");
const deleteQuote = require("./deleteQuote");

module.exports = async function handleInteraction(interaction) {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;
    if (commandName == "quote") {
        console.log(interaction);
        let subCommand = options.getSubcommand(false);
        console.log(subCommand);
        if (subCommand == "add") {
            let args = [];
            let user = options.getUser("user")?.id;
            if (user == undefined || user == null) user = options.getString("name");
            let quote = options.getString("quote");
            if (user != null) args.push(user);
            if (quote != null) args.push(quote);
            await add.command(interaction, args, sendMessage = false, interaction = interaction);
            return;
        }
    }
}