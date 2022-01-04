/*
 *
 * This file serves as a clean way to keep track of all the command files.
 * Every new command needs to be simply added here and it will work with the
 * bot.
 * 
 */

const quote = require("./quote");
const help = require("./help");
const ping = require("./ping");

module.exports = { quote, help, ping };