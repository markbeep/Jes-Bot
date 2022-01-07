const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

module.exports = class Page {
    constructor(userMessage, quotesList, embedTitle, description, interaction = null) {
        this.userMessage = userMessage;
        this.interaction = interaction;
        this.quotesList = quotesList;
        this.embedTitle = embedTitle;
        this.description = description;
        this.pages = createPages(this.quotesList);
        this.pageCount = 0;
        this.ownMessage;  // the pages message the bot sends
    }

    async start() {
        if (this.interaction) {
            this.ownMessage = await this.interaction.reply({ embeds: [this.#getPageEmbed()], components: [this.#getPageButtons()], fetchReply: true, ephemeral: true })
        } else {
            this.ownMessage = await this.userMessage.channel.send({ embeds: [this.#getPageEmbed()], components: [this.#getPageButtons()] })
        }
        let filter = i => i.message.id == this.ownMessage.id;
        let collector;
        if (this.interaction) {
            collector = this.interaction.channel.createMessageComponentCollector({ filter, time: 60e3 });  // 60 seconds until timeout
        } else {
            collector = this.userMessage.channel.createMessageComponentCollector({ filter, time: 60e3 });  // 60 seconds until timeout
        }
        collector.on("collect", interaction => this.#handleInteraction(interaction, collector));
        collector.on("end", () => {
            // the catch simply ignores the error if a message was already deleted
            if (this.interaction) return;
            this.userMessage?.delete().catch(_ => _);
            this.ownMessage?.delete().catch(_ => _);

        });
    }

    copy() {
        return this(this.userMessage, this.quotesList, this.embedTitle, this.description);
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
                    .setStyle((this.pageCount === 0) ? "SECONDARY" : "PRIMARY")
                    .setDisabled(this.pageCount === 0),
                new MessageButton()
                    .setCustomId("leftPageButton")
                    .setLabel("<")
                    .setStyle((this.pageCount === 0) ? "SECONDARY" : "PRIMARY")
                    .setDisabled(this.pageCount === 0),
                new MessageButton()
                    .setCustomId("closePageButton")
                    .setLabel("X")
                    .setStyle("DANGER"),
                new MessageButton()
                    .setCustomId("rightPageButton")
                    .setLabel(">")
                    .setStyle((this.pageCount === this.pages.length - 1) ? "SECONDARY" : "PRIMARY")
                    .setDisabled(this.pageCount === this.pages.length - 1),
                new MessageButton()
                    .setCustomId("lastPageButton")
                    .setLabel(">>")
                    .setStyle((this.pageCount === this.pages.length - 1) ? "SECONDARY" : "PRIMARY")
                    .setDisabled(this.pageCount === this.pages.length - 1),
            )
    }

    async #handleInteraction(i, collector) {
        if (this.interaction == null && i.user.id != this.userMessage.author.id) {
            i.reply({ content: "You can't control a Quote Menu not called by you!", ephemeral: true });
            return;
        }
        collector.resetTimer();
        switch (i.customId) {
            case "firstPageButton": this.pageCount = 0; break;
            case "leftPageButton": this.pageCount--; break;
            case "rightPageButton": this.pageCount++; break;
            case "lastPageButton": this.pageCount = this.pages.length - 1; break;
            default: {
                collector.stop();
                if (this.interaction) {
                    let embed = this.#getPageEmbed().setDescription("Quotes menu **closed**");
                    i.update({ embeds: [embed], components: [] });
                }
                return;
            };
        }
        await i.update({ embeds: [this.#getPageEmbed()], components: [this.#getPageButtons()] });
    }
}

function createPages(quotesList) {
    let filteredQuotes = quotesList.map((q, i) => `**${i + 1}:** ${cleanupQuoteString(q.quote)} \`[ID: ${q.quoteId}]\``)
    let content = filteredQuotes.join("\n");
    let pages = [];
    while (content.length > 0) {
        if (content.length <= 1000) {
            pages.push(content.trim());
            content = "";
            break;
        }
        // Looks for the last linebreak or space (not after the ranking) to make a break at
        let lastIndex = content.lastIndexOf(/(?<!:\*\*)\s/, 1000);
        if (lastIndex === -1) { // there's no space/linebreak
            pages.push(content.slice(0, 1000).trim());
            content = content.slice(1000).trim();
            continue;
        }
        pages.push(content.slice(0, lastIndex).trim());
        content = content.slice(lastIndex).trim();
    }
    return pages;
}

// removes all *, ~, \, ~, || and if there are multiple linebreaks, they are turned into a single one
const cleanupQuoteString = quoteText => quoteText.replace(/\*/g, "").replace(/~/g, "").replace(/\\/g, "").replace(/`/g, "").replace(/||/g, "").replace(/(\n){2,}/gm, "\n").trim();