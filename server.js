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
  // For each element with a "new-content-block" class
  $('div.new-content-block').each(function(i, element) {
    // Save div and tag
    var $a = $(this).children('a');
    var $div = $(this).children('div');
    // Save article url
    var articleURL = $a.attr('href');
    // Save img url of each element
    var imgURL = $a.children('img').attr('src');
    // Save title
    var title = $div.children('h4').text();
    // Save summary
    var summary = $div.children('p').text();
    // Create mongoose model
    var scrapedData = new ScrapedData({
      title: title,
      imgURL: imgURL,
      summary: summary,
      articleURL: articleURL
    });
    // Save data
    scrapedData.save(function(err) {
      if (err) {
        //console.log(err);
      }
      //console.log('Saved');
    });
  });
});
