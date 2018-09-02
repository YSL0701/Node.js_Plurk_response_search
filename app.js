var request = require("request");
var cheerio = require("cheerio");
var express = require("express");
var bodyParser = require('body-parser');
var fs = require("fs");
var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var urlList = [];
var account = ""
var result = [];
var replyCount = "";
var j = 0;
app.get("/",function(req,res){
    res.send("hello");
})
app.use(express.static('index'));
app.post("/api",urlencodedParser,function(req,res){
    
    console.log(req.body.theUrl);
    urlList = req.body.theUrl.split(" ");
    account = `/${req.body.account}`;
    if(urlList!=[] && account!=""){
        plurk(function(){
            res.json(result)
            console.log("傳完");
            console.log(replyCount);
            finishied = false;
            result = [];
            urlList = [];
            replyCount = 0;
        });
    }
})
app.listen(3000,function(){
    console.log("sever啟動");
})

function plurk(callback){ 
    
    request({
        url: urlList[j],
        method: "GET"
    }, function(e,r,b) {
        if(e || !b) { return; }
        var $ = cheerio.load(b);
        var auther = $(".user-nick");
        var article = $(".plurk_content")
        result.push(urlList[j]);
        
        for(let t=0;t<auther.length;t++){
            if($(auther[t]).attr("href")==account){
                if($($("article")[t]).attr("class")!="clearfix"){
                    result.push("*");
                }
                result.push($(article[t]).html());
                if($($("article")[t]).attr("class")!="clearfix"){
                    result.push("*");
                }
                if($($("article")[t]).attr("class")=="clearfix"){
                    replyCount ++;
                }
            }
            if(t==auther.length-1 && j==urlList.length-1){
                console.log("來了");
                j = 0;
                return callback();
            }
        }
        j++
        if(j<urlList.length){
            plurk(callback);
        }
    });
    
}
// function plurk(callback){ 
//     for(let j = 0;j<urlList.length;j++){
        
//         request({
//             url: urlList[j],
//             method: "GET"
//         }, function(e,r,b) {
//             if(e || !b) { return; }
//             var $ = cheerio.load(b);
//             var auther = $(".user-nick");
//             var article = $(".plurk_content")
//             result.push(urlList[j]);
            
//             for(let t=0;t<auther.length;t++){
//                 // console.log($(auther[t]).attr("href"),t);
//                 console.log(urlList[j],"12345",j);
//                 if($(auther[t]).attr("href")==account){
//                     // console.log($($("article")[t]).attr("class"))
//                     if($($("article")[t]).attr("class")!="clearfix"){
//                         result.push("*");
//                     }
//                     // console.log("1",result);
//                     result.push($(article[t]).html());
//                     if($($("article")[t]).attr("class")!="clearfix"){
//                         result.push("*");
//                     }
//                     if($($("article")[t]).attr("class")=="clearfix"){
//                         replyCount ++;
//                     }
//                 }
//                 if(t==auther.length-1 && j==urlList.length-1){
//                     finishied = true;
//                     console.log("來了")
//                     callback();
//                 }
//                 // console.log(finishied);
//                 // console.log(t,auther.length,urlList.length)
//             }
//             // console.log("2",result)
//         });
//     }
// }
function saveContent(){
    fs.writeFileSync("result.json", JSON.stringify(result));
    console.log("3")
}
// plurk();
// saveContent();

