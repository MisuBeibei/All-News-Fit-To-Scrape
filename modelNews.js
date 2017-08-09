
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var News = new Schema({

  articleTitle: {
    type: String,
    trim: true,
    required: "This is your article Title."
  },

  articleImage: {

  },

  articleLink: {

  },

  articleSummary: {

  },

  articleComments: {

  }
  
});

//var User = mongoose.model("", New);

module.exports = User;
