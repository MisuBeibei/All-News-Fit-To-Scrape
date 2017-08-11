
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NewSchema = new Schema({

  title: {
    type: String,
    trim: true,
    unique: true
  },

  imgURL: {
    type: String,
    required: true
  },

  summary: {
    type: String,
    required: true
  },

  articleURL: {
    type: String,
    required: true
  },

  comments: [{
    text: {
      type: String
    }
  }]

});

var ScrapedData = mongoose.model('ScrapedDate', NewSchema);

module.exports = ScrapedData;
