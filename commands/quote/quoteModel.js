const { Sequelize, DataTypes } = require("sequelize");
const { debug } = require("../../config.json");

let type = { dialect: "sqlite", storage: "./data/quotes.sqlite" }
type.logging = (debug) ? console.log : false;
const sequelize = new Sequelize(type);

const QuoteModel = sequelize.define("Quotes", {
    quoteId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    quote: DataTypes.TEXT,
    name: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    addedByUserId: DataTypes.INTEGER,
    guildId: DataTypes.INTEGER,
});

sequelize.sync();

module.exports = { QuoteModel, sequelize };
