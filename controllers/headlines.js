//Require scraping and date functions
const scrape = require("../scripts/scrape");
const makeDate = require("../scripts/date");

//Require Headline and Mongoose Models
const Headline = require("../models/Headline");

module.exports = {
  //fetch will run the scrape function and grab all articles and insert them into Headline collection in Mongo DB, setting saved to false
  fetch: function(cb) {
    scrape(function(data) {
      var articles = data;
      for (let i = 0; i < articles.length; i++) {
        articles[i].date = makeDate();
        articles[i].saved = false;
      }
      //Mongo function- the callback in insertMany allows the function to skip over any failed articles and continue loading
      Headline.insertMany(articles, { ordered: false }, function(err, docs) {
        //return any errors in the docs
        cb(err, docs);
      });
    });
  },
  //Delete function allows the queried headline to be removed
  delete: function(query, cb) {
    // console.log("==================");
    // console.log("headlines.js delete function query: ");
    // console.log(query);
    Headline.findOneAndUpdate(
      { _id: query },
      { $set: { saved: false } },
      { new: true }
    ).exec(function(err, doc) {
      // console.log("======================================");
      // console.log("doc from headlines.js update/delete method:");
      // console.log(doc);
      cb(doc);
    });

    // Headline.findOneAndDelete({ _id: query }).exec(function(err, doc) {
    //   console.log("======================================");
    //   console.log("doc from headlines.js findOneAndDelete method:");
    //   console.log(doc);
    //   cb(doc);
    // });
  },
  //find all the headlines in a query and sort them from most recent to least recent
  get: function(query, cb) {
    Headline.find(query)
      .sort({
        _id: -1
      })
      //once tht is done, pass those headlines to the callback function
      .exec(function(err, doc) {
        cb(doc);
      });
  },
  //Update function updates any new articles that are scraped with a relevant id, and updates any information that's passed to those articles with the same id
  update: function(query, cb) {
    console.log("======================================");
    console.log("query from headlines.js update method:");
    console.log(query);
    // Headline.updateOne({ _id: query }, { $set: { saved: true } }, cb()).exec(
    Headline.findOneAndUpdate(
      { _id: query },
      { $set: { saved: true } },
      { new: true }
    ).exec(function(err, doc) {
      console.log("======================================");
      console.log("doc from headlines.js update method:");
      console.log(doc);
      cb(doc);
    });
  }
};
