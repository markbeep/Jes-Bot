const fs = require("fs");
const { exit } = require("process");

// Checks if the config.json file exists
module.exports = function checkFiles() {
    if (fs.existsSync("./config.json")) return;

    fs.writeFileSync("./config.json", JSON.stringify({ token: "", prefix: ";" }, null, 4));
    console.log("\033[103;90mATTENTION\033[0m\nNew files have been created:\n\t- \033[91mconfig.json\033[0m");
    exit();
}