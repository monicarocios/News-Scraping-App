// Dependencies
var express = require("express");
var mongojs = require ("mongojs");

// Require axios and cheerio for scraping
const axios = require("axios");
const cheerio = require("cheerio");

// Initialize Express
var app = express();

// Database configuration
var databaseUrl = "scraper";
var collections = ["scrapedData"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
    console.log("Database Error:", error);
});

// Main route (display main html page)
app.get("/", function(req, res) {
    res.send("Hello world")
})

// Retrieve data from the db
app.get("/all", function(req, res) {
    // Find all results from the scrapedData collection in the db
    db.scrapedData.find({}, function(error, found) {
        // throw any errors to the console
        if (error) {
            console.log(error);
        }
        // If there are no errors, send the data to the browser as json
        else {
            res.json(found);
        }
    });
});


// Scrape data from one site and place it into the mongodb db
app.get("/scrape", function(req, res) {
    // Make a request via axios for headline news from the economist
axios.get("https://www.economist.com/latest/").then(function (response) {
    // Load the html body from axios into cheerio
    var $ = cheerio.load(response.data);
    // For each element in the "article" tag
    $("article").each(function(i, element) {
        // save the title, href, and summary of each link enclosed in the current element
        var title = $(element).children("a").attr("aria-label");
        var link = $(element).children("a").attr("href");
        var summary = $(element).children("a").children("div").last().find("div.teaser__text").text();

        // If this found element had a title, link, and summary
        if (title && link) {
            // Insert the data in the scrapedData db
            db.scrapedData.insert({
                title: title,
                link: link,
                summary: summary
            },
            function(err, inserted) {
                if (err){
                    // Log the error is one is encountered during the query
                }
                else {
                    // Otherwise, log the inserted data
                    console.log(inserted);
                }
            })
        }
    });
});

// Send a "Scrape Complete" message to the browser
res.send("Scrape Complete");
});


// Listen on port 3000
app.listen(3000, function () {
    console.log("App running on port 3000!");
});