// let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard";
// venue date opponent result runs balls fours sixes sr
const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const xlsx=require("xlsx");
//HomePage request
function processScorecard(url) {
    request(url, cb);
}
function cb(err, response, html) {
    if (err) {
        console.log(err);
    } else {
        // console.log(html);
        extractMatchDetails(html);
    }
}
function extractMatchDetails(html) {
    // venue date opponent result runs balls fours sixes sr
    // ipl
    // team
    //     player
    //         runs balls fours sixes opponent venue date
    // venue date ->.ds-bg-fill-content-prime .ds-text-tight-m.ds-font-regular.ds-text-ui-typo-mid 
    // result-> .ds-font-regular.ds-truncate.ds-text-typo-title
    let $ = cheerio.load(html);
    let descArr = $(".ds-bg-fill-content-prime .ds-text-tight-m.ds-font-regular.ds-text-ui-typo-mid");
    let descElem = $(descArr[0]).text();
    let descElemArr = descElem.split(",");
    let venue = descElemArr[1];
    let result = $(".ds-font-regular.ds-truncate.ds-text-typo-title").text();
    let date = descElemArr[2] + descElemArr[3];
    let teamNameElems = $(".ds-bg-ui-fill-translucent-hover .ds-capitalize");
    let innings = $(".ci-scorecard-table tbody");
    for (let i = 0; i < teamNameElems.length; i++) {
        let teamName = $(teamNameElems[i]).text();
        let oppoIndex = i == 0 ? 1 : 0;
        let oppoName = $(teamNameElems[oppoIndex]).text();
        console.log(`${venue}| ${date}| ${teamName}| ${oppoName} |${result}`);
        let inningsElem = $(innings[i]).find("tr");
        for (let k = 0; k < inningsElem.length - 3; k++) {
            let hasClass = $(inningsElem[k]).hasClass("ds-hidden");
            let hasClass1 = $(inningsElem[k]).hasClass("ds-text-tight-s");
            if (!(hasClass || hasClass1)) {
                let allCols = $(inningsElem[k]).find("td");
                let playerName = $(allCols[0]).text().trim();
                let runs = $(allCols[2]).text().trim();
                let balls = $(allCols[3]).text().trim();
                let fours = $(allCols[5]).text().trim();
                let sixes = $(allCols[6]).text().trim();
                let sr = $(allCols[7]).text().trim();
                console.log(`${playerName}| ${runs}| ${balls}| ${fours}| ${sixes}| ${sr}`);
                processPlayer(teamName, playerName, runs, balls, fours, sixes, sr, oppoName, venue, date, result);
            }
        }
    }
}
function processPlayer(teamName, playerName, runs, balls, fours, sixes, sr, oppoName, venue, date, result) {
    let teamPath = path.join(__dirname, "ipl", teamName);
    dirCreator(teamPath);
    let filePath = path.join(teamPath, playerName + ".xlsx");
    let content = excelReader(filePath, playerName);
    let playerObj = {
        teamName,
        playerName,
        runs,
        balls,
        fours,
        sixes,
        sr,
        oppoName,
        venue,
        date,
        result
    }
    content.push(playerObj);
    excelWriter(filePath, content, playerName);
}
function dirCreator(filePath) {
    if (!(fs.existsSync(filePath))) {
        fs.mkdirSync(filePath);
    }
}
function excelWriter(filePath, json, sheetName) {

    let newWB = xlsx.utils.book_new();
    let newWS = xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
    xlsx.writeFile(newWB, filePath);
}
function excelReader(filePath, sheetName) {
    if (fs.existsSync(filePath) == false) {
        return [];
    }

    let wb = xlsx.readFile(filePath);
    let excelData = wb.Sheets[sheetName];
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ans;
}
module.exports = {
    ps: processScorecard
}
