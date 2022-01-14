const Command = require("../../utils/commandClass");
const all = require("./all");
const { add, setBlackListedWords } = require("./add");
const get = require("./get");
const getRandom = require("./getRandom");
const deleteQuote = require("./deleteQuote");
const { prefix } = require("../../config.json");
const { SlashCommandBuilder } = require("@discordjs/builders");

const quote = new Command();
quote.aliases = ["q"];
quote.subcommands = { all, add, get, getRandom, deleteQuote };
quote.usage = `[Quote ID | Name | <Subcommand>]`
quote.description = `Sends a completely random quote from the server if all parameters are empty. \
If only a name is given, it sends a random quote from that user.
*Note: Quotes saved to a **user** (mention or user ID) also saves \
the quote to the user's username. Quotes that are simply added to a name (no mention) will only be \
viewable under that name.*
If a reaction has the name \`addQuote\` (no matter the casing) it can be used to add messages as \
quotes by reacting with that emote.
__Some examples:__
\`${prefix}quote\`   - sends a random quote from any user
\`${prefix}quote bob\`   - sends a random quote from the **name** bob
\`${prefix}quote bob haHaa\`   - adds "haHaa" as a quote to the **name** bob
\`${prefix}quote @bob#1234 all\`   - displays all quotes from the **user** bob
\`${prefix}quote 205704051856244737 23\`   - displays the 23rd indexed quote from the user with that ID
\`${prefix}quote names\`   - displays all names that have a quote`
quote.shortDescription = "Store and fetch quotes on your server."

// Sets up the slash commands
quote.slashCommand = new SlashCommandBuilder()
    .setName('quote')
    .setDescription("Display Quotes");
Object.values(quote.subcommands)
    .filter(sub => sub.slashCommand != null)
    .forEach(sub => quote.slashCommand.addSubcommand(sub.slashCommand));

setBlackListedWords(quote.subcommands);  // ensures that not quote commands are used as quote names

quote.command = async function (msg, args) {
    if (args.length === 0) {
        if (msg.type == "REPLY") {
            let replyMessage = await msg.fetchReference();
            await replyMessage.author.fetch();
            add.command(msg, [replyMessage.author.id, replyMessage.content]);
            return;
        }
        getRandom.command(msg, args);
        return;
    }
    if (args.length === 1) {
        // first argument is a name, quoteID, userID or mention
        let member = msg.mentions.members.first();
        try {
            if (member == undefined) member = await msg.guild.members.fetch(args[0]);
        } catch (e) { }
        if (member != undefined) {
            getRandom.command(msg, args);
            return;
        }
        if (parseInt(args[0]) != NaN) get.command(msg, args); // argument is a quote index
        else getRandom.command(msg, args);  // argument is a name
        return;
    }
    // anything with more than 1 argument is a quote being added or all
    if (args[1] == "all") {
        args.splice(1, 1);  // takes out the "all" argument
        all.command(msg, args);
        return;
    }
    add.command(msg, args);
}

module.exports = quote;
