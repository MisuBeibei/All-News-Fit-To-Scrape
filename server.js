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
var ObjectId = require('mongodb').ObjectID;

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

    var scrapedData = new ScrapedData({
      title: title,
      imgURL: imgURL,
      summary: summary,
      articleURL: articleURL
    });
    scrapedData.save(function(err) {
      if (err) {
        return err
      }
    });
  });
});


app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static('public'));

app.get('/', function(req, res) {
  ScrapedData
    .findOne()
    .exec(function(err,data) {
      if (err) return console.error(err);
      res.render('index', {
        imgURL: data.imgURL,
        title: data.title,
        summary: data.summary,
        _id: data._id,
        articleURL: data.articleURL,
        comments: data.comments
      });
    })
});

app.get('/next/:id', function(req, res) {
  ScrapedData
    .find({
      _id: {$gt: req.params.id}
    })
    .sort({_id: 1 })
    .limit(1)
    .exec(function(err,data) {
      if (err) return console.error(err);
      res.json(data);
    })
});

app.get('/prev/:id', function(req, res) {
  ScrapedData
    .find({
      _id: {$lt: req.params.id}
    })
    .sort({_id: -1 })
    .limit(1)
    .exec(function(err,data) {
      if (err) return console.error(err);
      res.json(data);
    })
});

app.post('/comment/:id', function(req, res) {
  ScrapedData.findByIdAndUpdate(
    req.params.id,
    {$push: {
      comments: {
        text: req.body.comment
      }
    }},
    {upsert: true, new: true},
    function(err, data) {
      if (err) return console.error(err);
      res.json(data.comments);
    }
  );
});

app.post('/remove/:id', function(req, res) {
  ScrapedData.findByIdAndUpdate(
    req.params.id,
    {$pull: {
      comments: {
        _id: req.body.id
      }
    }},
    {new: true},
    function(err, data) {
      if (err) return console.error(err);
      res.json(data.comments);
    }
  );
});

app.listen(3000, function() {
  console.log('PORT 3000 is listening!');
});
