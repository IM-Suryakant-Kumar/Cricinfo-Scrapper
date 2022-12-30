const request = require("request");
const cheerio = require("cheerio");
const scoreCardObj = require("./scorecard");
function getAllMatchesLink(url) {
    request(url, function (err, response, html) {
        if (err) {
            console.log(err);
        } else {
            extractAllLink(html);
        }
    });
}
function extractAllLink(html) {
    let $ = cheerio.load(html);
    let scorecardElems = $(".ds-grow.ds-px-4 .ds-no-tap-higlight");
    let resultsArr = $(".ds-grow.ds-px-4 .ds-line-clamp-2");
    for (let i = 0; i < scorecardElems.length; i++) {
        // let link = $(scorecardElems[i]).attr("href");
        // let fullLink = "https://www.espncricinfo.com" + link;
        // console.log(fullLink);
        // scoreCardObj.ps(fullLink);
        
        // checking
        if (i == 0) {
            let link = $(scorecardElems[i]).attr("href");
            let fullLink = "https://www.espncricinfo.com" + link;
            console.log(fullLink);
            scoreCardObj.ps(fullLink);
        }
    }
}
module.exports = {
    gAlmatches: getAllMatchesLink
}