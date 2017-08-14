var express = require("express");
var router = express.Router();
var request = require("request");
var cheerio = require("cheerio");
var mongoose = require("mongoose");
mongoose.Promise = Promise;

var Note = require("../models/Note.js");
var Article = require("../models/Article.js");

router.get("/", function(req, res) {
  res.render("index");
});

router.get("/save", function(req, res) {
  Article.find({}, function(error, doc) {
    if (error) {
      console.log(error);
    }
    else {
      var hbsArticleObject = {
        articles: doc
      };
      res.render("save", hbsArticleObject);
    }
  });
});


// A GET request to scrape the nytimes website
router.post("/scrape", function(req, res) {
  // grabs the body of content with a request
  request("http://www.nytimes.com/", function(error, response, html) {
    // load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);
    var scrapedArticles = {};
    $("article h2").each(function(i, element) {
      var result = {};
      result.title = $(this).children("a").text();
      console.log("Title from results: " + result.title);
      result.link = $(this).children("a").attr("href");
      scrapedArticles[i] = result;
    });
    console.log("Scraped Articles: " + scrapedArticles);
    var hbsArticleObject = {
        articles: scrapedArticles
    };
    res.render("index", hbsArticleObject);
  });
});


// posts to the saved route
router.post("/save", function(req, res) {
  console.log("Title: " + req.body.title);
  var newArticleObject = {};

  newArticleObject.title = req.body.title;
  newArticleObject.link = req.body.link;
  var entry = new Article(newArticleObject);
  console.log("Save Articles: " + entry);
  entry.save(function(err, doc) {
    if (err) {
      console.log(err);
    }
    else {
      console.log(doc);
    }
  });
  res.redirect("/save");
});


// delete by id
router.get("/delete/:id", function(req, res) {
  //console.log("ID is getting read for delete" + req.params.id);
  console.log("Delete function is ready.");
  Article.findOneAndRemove({"_id": req.params.id}, function (err, offer) {
    if (err) {
      console.log("Not able to delete:" + err);
    } else {
      console.log("Able to delete, Yay");
    }
    res.redirect("/save");
  });
});


// delete notes by id
router.get("/notes/:id", function(req, res) {
  //console.log("ID is getting read for delete" + req.params.id);
  console.log("Delete function ready.");
  Note.findOneAndRemove({"_id": req.params.id}, function (err, doc) {
    if (err) {
      console.log("Not able to delete:" + err);
    } else {
      console.log("Able to delete, Yay");
    }
    res.send(doc);
  });
});
