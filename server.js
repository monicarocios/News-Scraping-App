// Dependencies
var express = require("express");

const axios = require("axios");
const cheerio = require("cheerio");

// Initialize Express
var app = express();

axios.get("https://www.economist.com/latest/").then(function (response, html) {
    var $ = cheerio.load(response.data);
    $("article").each(function(i, element) {
        var article = $(element).children("a").attr("aria-label");
        console.log(article);
    })
});

// Listen on port 3000
app.listen(3000, function () {
    console.log("App running on port 3000!");
});