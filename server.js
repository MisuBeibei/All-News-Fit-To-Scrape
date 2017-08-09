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

mongoose.connect('mongodb://localhost/model-news');
var db = mongoose.connection;

db.on('error', function(err) {
  console.log('Database Error:', err);
});
