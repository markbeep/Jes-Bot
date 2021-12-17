const quote = new Object;

quote.aliases = ["q"];

quote.command = (msg, args) => {
    msg.channel.send({content: "No working quote command yet."});
}

module.exports = quote;
