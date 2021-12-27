const fs = require("fs");
const { exit } = require("process");

// Checks if the config.json file exists
module.exports = function checkFiles() {
    let wrote = { config: false, db: false };
    if (!fs.existsSync("./config.json")) {
        fs.writeFileSync("./config.json", JSON.stringify({ token: "", prefix: ";" }, null, 4));
        wrote.config = true;
    }
    if (Object.values(wrote).some(e => e)) {
        console.log("\033[4m\nNew files have been created:\033[0m");
        wrote.config && console.log("\t- \033[91mconfig.json\033[0m");
        wrote.db && console.log("\t- \033[91mquotes.db\033[0m");
        exit();
    }
}