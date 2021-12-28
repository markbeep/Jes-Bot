const fs = require("fs");
const { exit } = require("process");
const { exec } = require("child_process");
const { checkForUpdates } = require("../config.json");

// Checks if the config.json file exists
module.exports = function checkFiles() {
    let wrote = { config: false };
    if (!fs.existsSync("./config.json")) {
        fs.writeFileSync("./config.json", JSON.stringify({ token: "", prefix: ";", debug: false, checkForUpdates: true, addedQuoteId: "0" }, null, 4));
        wrote.config = true;
    }
    if (Object.values(wrote).some(e => e)) {
        console.log("\033[4m\nNew files have been created:\033[0m");
        wrote.config && console.log("\t- \033[91mconfig.json\033[0m");
        wrote.db && console.log("\t- \033[91mquotes.db\033[0m");
        exit();
    }
    // if enabled, fetches from git and checks for updates
    checkForUpdates && checkVersion();
}

function checkVersion() {
    exec("git fetch");
    exec('git status')
        .stdout
        .on('data', function (data) {
            let st = data.toString();
            if (st.includes("Your branch is behind")) {
                console.log("\033[1;93m〖 INFO: There's a new update available 〗\033[0m")
                console.log("\033[1;93mDownload at \033[4mhttps://github.com/markbeep/Jes-Bot \033[0m");
                console.log("\033[93mOr write \033[1;38;5;111mgit pull\033[0m\033[93m in the console \033[0m");
            } else if (st.includes("not a git repository")) {
                console.log("\033[31mNot a git repository, can't check for updates.\033[0m")
            }
        });
}