//Require scraping and date functions
var scrape = require("../scripts/scrape");
var makeDate = require("../scripts/date");

//Require Headline and Mongoose Models
var Headline = require("../models/Headline");

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
      // Headline.collection.insertMany(articles, { ordered: false }, function(
      Headline.insertMany(articles, { ordered: false }, function(err, docs) {
        //return any errors in the docs
        cb(err, docs);
      });
    });
  },
  //Delete function allows the queried headline to be removed
  delete: function(query, cb) {
    Headline.remove(query, cb);
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
    Headline.update(
      { _id: query._id },
      { $set: query },
      { $set: query },
      { $set: query },
      { $set: query }
    );
    // .exec(function(query, cb) {
    cb(results);
    // });
  }
};

//   update: function(query, cb) {
//     Headline.update(
//       { _id: query._id },
//       {
//         $set: query
//       },
//       {},
//       cb
//     );
//   }
// };
