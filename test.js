var request = require("request");
var cheerio = require("cheerio");
var fs = require("fs");
request({
    url: "https://www.plurk.com/p/muiw5d",
    method: "GET"
}, function(e,r,b) {
    if(e || !b) { return; }
    var $ = cheerio.load(b);
    var result = [];
    var titles = $(".highlight_owner span");
    for(var i=0;i<titles.length;i++) {
        // console.log(titles)
      result.push($(titles[i]).text());
    }
    fs.writeFileSync("result.json", JSON.stringify(result));
});