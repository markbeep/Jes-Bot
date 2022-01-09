let allNames = {};  // stores all the name options
let allQuoteIds = {}  // stores all the quote IDs per server

function addNames(guildId, names = []) {
    if (allNames[guildId] == undefined) allNames[guildId] = {};
    let uniqueNames = new Set(Object.values(allNames[guildId]).map(e => (e.name != undefined) ? e.name : e).concat(names));
    allNames[guildId] = Array.from(uniqueNames).map(e => ({ name: e, value: e }));
}

function removeName(guildId, name) {
    if (allNames[guildId] == undefined) return;
    allNames[guildId] = allNames[guildId].filter(e => e.name != name);
}

function addQuoteIds(guildId, quoteIds = []) {
    if (allQuoteIds[guildId] == undefined) allQuoteIds[guildId] = {};
    let uniqueQuoteIds = new Set(Object.values(allQuoteIds[guildId]).map(e => (e.name != undefined) ? e.name : e).concat(quoteIds));
    allQuoteIds[guildId] = Array.from(uniqueQuoteIds).map(e => ({ name: "" + e, value: e }));
}

function removeQuoteId(guildId, quoteId) {
    if (allQuoteIds[guildId] == undefined) return;
    allQuoteIds[guildId] = allQuoteIds[guildId].filter(e => e.name != quoteId);
}


module.exports = { addNames, removeName, addQuoteIds, removeQuoteId, allNames, allQuoteIds };