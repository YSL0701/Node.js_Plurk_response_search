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

app.get("/",function(req,res){
    res.send("hello");
})
app.use(express.static('index'));
app.post("/api",urlencodedParser,function(req,res){
    result = [];
    replyCount = ""
    console.log(req.body.theUrl);
    urlList = req.body.theUrl.split(" ");
    account = `/${req.body.account}`;
    if(urlList!=[] && account!=""){
        urlList.reduce((pre,current) => {
            if(current!=urlList[urlList.length-1]){
                return pre.then(() => {
                    console.log(current)
                    return plurk(current)
                })
            }
            else{
                return pre.then(() => {
                    console.log(current)
                    return plurk(current)
                }).then(() => {
                    res.json(result)
                    console.log(replyCount)
                })
            }
        },Promise.resolve())
    }
})
app.listen(3000,function(){
    console.log("sever啟動");
})

function plurk(url){ 
    return new Promise(function(resolve){
        //非同步
        request({
            url: url,
            method: "GET"
        }, function(e,r,b) {
            if(e || !b) { return; }
            var $ = cheerio.load(b);
            var auther = $(".user-nick");
            var article = $(".plurk_content")
            result.push(url);
        
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
            }
            resolve();
        });
    })
}


