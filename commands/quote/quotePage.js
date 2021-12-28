const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

module.exports = class Page {
    constructor(userMessage, quotesList, embedTitle, description) {
        this.userMessage = userMessage;
        this.quotesList = quotesList;
        this.embedTitle = embedTitle;
        this.description = description;
        this.pages = createPages(this.quotesList);
        this.pageCount = 0;
        this.ownMessage;  // the pages message the bot sends
    }

    async start() {
        this.ownMessage = await this.userMessage.channel.send({ embeds: [this.#getPageEmbed()], components: [this.#getPageButtons()] })
        const filter = i => i.message.id == this.ownMessage.id;
        const collector = this.userMessage.channel.createMessageComponentCollector({ filter, time: 60e3 });  // 60 seconds until timeout
        collector.on("collect", interaction => this.#handleInteraction(interaction, collector));
        collector.on("end", () => {
            // the catch simply ignores the error if a message was already deleted
            this.userMessage != undefined && this.userMessage.delete().catch(_ => _);
            this.ownMessage != null && this.ownMessage.delete().catch(_ => _);
        });
    }

    #getPageEmbed() {
        return new MessageEmbed()
            .setColor("#eeac60")
            .setTitle(this.embedTitle)
            .setDescription(this.description)
            .addField(`Page: ${this.pageCount + 1} / ${this.pages.length}`, this.pages[this.pageCount]);
    }

    #getPageButtons() {
        return new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("firstPageButton")
                    .setLabel("<<")
                    .setStyle("SECONDARY")
                    .setDisabled(this.pageCount === 0),
                new MessageButton()
                    .setCustomId("leftPageButton")
                    .setLabel("<")
                    .setStyle("SECONDARY")
                    .setDisabled(this.pageCount === 0),
                new MessageButton()
                    .setCustomId("closePageButton")
                    .setLabel("X")
                    .setStyle("DANGER"),
                new MessageButton()
                    .setCustomId("rightPageButton")
                    .setLabel(">")
                    .setStyle("SECONDARY")
                    .setDisabled(this.pageCount === this.pages.length - 1),
                new MessageButton()
                    .setCustomId("lastPageButton")
                    .setLabel(">>")
                    .setStyle("SECONDARY")
                    .setDisabled(this.pageCount === this.pages.length - 1),
            )
    }

    async #handleInteraction(i, collector) {
        if (i.user.id != this.userMessage.author.id) {
            i.reply({ content: "You can't control a Quote Menu not called by you!", ephemeral: true });
            return;
        }
        collector.resetTimer();
        switch (i.customId) {
            case "firstPageButton": this.pageCount = 0; break;
            case "leftPageButton": this.pageCount--; break;
            case "rightPageButton": this.pageCount++; break;
            case "lastPageButton": this.pageCount = this.pages.length - 1; break;
            default: collector.stop();
        }
    }
}

function createPages(quotesList) {
    let filteredQuotes = quotesList.map((q, i) => `**${i}:** ${cleanupQuoteString(q.quote)} \`[ID: ${q.quoteId}]\``)
    let content = filteredQuotes.join("\n");
    let pages = [];
    while (content.length > 0) {
        if (content.length <= 1000) {
            pages.push(content);
            content = "";
            break;
        }
        // Looks for the last linebreak to make a break at
        let lastIndex = content.lastIndexOf("\n");
        if (lastIndex === -1) {  // there's no linebreak
            lastIndex = content.lastIndexOf(" ");
            if (lastIndex === -1) { // there's no space
                pages.push(content.slice(0, 1000));
                content = content.slice(1000);
                continue;
            }
        }
        pages.push(content.slice(0, lastIndex));
        content = content.slice(lastIndex);
    }
    return pages;
}

const cleanupQuoteString = quoteText => quoteText.replace(/\*/g, "").replace(/~/g, "").replace(/\\/g, "").replace(/`/g, "").replace(/||/g, "");