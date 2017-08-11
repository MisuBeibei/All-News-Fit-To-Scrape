// Dependencies
var path = require('path');
var bodyParser = require('body-parser');

var express = require('express');
var app = express();

var exphbs = require('express-handlebars');
var hbs = exphbs.create({
  defaultLayout: 'main',
  helpers: {
    addOne: function(value, options){
      return parseInt(value) + 1;
    }
  }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

var request = require('request');
var cheerio = require('cheerio');

var mongoose = require('mongoose');
var ObjectId = require('mongojs').ObjectID;

mongoose.connect('mongodb://localhost/model-news-scraper');
var db = mongoose.connection;

db.on('error', function(err) {
  console.log('Database Error:', err);
});

var ScrapedData = require('./modelNews')

request("http://www.nytimes.com/trending/", function(error, response, html) {

  var $ = cheerio.load(html);

  var results = [];

  // Select each element in the HTML body from which you want information.
  // NOTE: Cheerio selectors function similarly to jQuery's selectors,
  // but be sure to visit the package's npm page to see how it works
  $("h2.story-heading").each(function(i, element) {

    var link = $(element).children().attr("href");
    var title = $(element).children().text();

    // Save these results in an object that we'll push into the results array we defined earlier
    results.push({
      title: title,
      link: link
    });
  });

  // Log the results once you've looped through each of the elements found with cheerio
  console.log(results);
});
