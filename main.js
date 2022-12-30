let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";
const fs = require("fs");
const path = require("path");
// venue date opponent result runs balls fours sixes sr
const request = require("request");
const cheerio = require("cheerio");
const AllMatchObj = require("./AllMatch");
//HomePage 
const iplPath = path.join(__dirname, "ipl");
request(url, cb);
function cb(err, response, html) {
    if (err) {
        console.log(err);
    } else {
        // console.log(html);
        extractLink(html);
    }
}
dirCreator(iplPath);
function extractLink(html) {
    let $ = cheerio.load(html);
    let anchorElem = $(".ds-block .ds-border-t.ds-py-2 a");
    let link = anchorElem.attr("href");
    // console.log(link);
    let fullLink = "https://www.espncricinfo.com" + link;
    // console.log(fullLink);
    AllMatchObj.gAlmatches(fullLink);
}

function dirCreator(filePath) {
    if (!(fs.existsSync(filePath))) {
        fs.mkdirSync(filePath);
    }
}