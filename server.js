// Dependencies
var express = require("express");

const axios = require("axios");
const cheerio = require("cheerio");

// Initialize Express
var app = express();

axios.get("https://www.economist.com/latest/").then(function (response, html) {
    var $ = cheerio.load(response.data);
    $("article").each(function(i, element) {
        var title = $(element).children("a").attr("aria-label");
        var link = $(element).children("a").attr("href");
        var summary = $(element).children("a").children("div").last().find("div.teaser__text").text();


        console.log(title);
        console.log(link);
        console.log(summary);

    })
});

// Listen on port 3000
app.listen(3000, function () {
    console.log("App running on port 3000!");
});