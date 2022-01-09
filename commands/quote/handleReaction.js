const { add } = require("./add");

module.exports = async function handleReaction(reaction, user) {
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
    await add.reaction(reaction.message, reaction.message.content, user);
}
