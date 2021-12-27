const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./data/quotes.sqlite",
    logging: console.log
});

const QuoteModel = sequelize.define("Quotes", {
    quoteId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    quote: DataTypes.STRING,
    name: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    addedByUserId: DataTypes.INTEGER,
    guildId: DataTypes.INTEGER,
});

sequelize.sync();

module.exports = QuoteModel;
