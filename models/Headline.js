const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const headLineSchema = new Schema({
  headline: {
    type: String,
    required: true,
    unique: true
  },
  summary: {
    type: String,
    required: true
  },
  date: String,
  saved: {
    type: Boolean,
    default: false
  },
  url: {
    type: String,
    required: true
  }
});

const Headline = mongoose.model("Headline", headLineSchema);

module.exports = Headline;
