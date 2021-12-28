const add = require("./add");

async function handleReaction(reaction, user) {
    if (user.bot) return;  // ignores bot reactions
    if (reaction.partial) { // if the message isn't cached
        try {
            await reaction.fetch();
        } catch (error) {
            return;
        }
    }
    // a quote simply needs to be called "addquote" to trigger quote adding
    if (reaction.emoji.name.toLowerCase() != "addquote") return;
    add.command(reaction.message, [reaction.message.author.id, reaction.message.content], user, false);
}

module.exports = handleReaction;