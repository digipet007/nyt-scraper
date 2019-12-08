const cheerio = require("cheerio");
const axios = require("axios");

// Make a request via axios to grab the HTML body from the site of your choice
const scrape = function(cb) {
  axios.get("https://www.nytimes.com").then(function(response) {
    // Load the HTML into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    var $ = cheerio.load(response.data);

    // An empty array to save the data that we'll scrape
    var results = [];
    // var results = {};

    // Select each element in the HTML body from which you want information.
    // NOTE: Cheerio selectors function similarly to jQuery's selectors
    // $(".theme-summary").each(function(i, element) {
    // $("div.esl82me1").each(function(i, element) {
    $("article.css-8atqhb").each(function(i, element) {
      // var head = $(element)
      //   .children(".esl82me0")
      //   .text()
      //   .trim();
      // var sum = $(element)
      //   .children(".e1n8kpyg0")
      //   .text()
      //   .trim();

      headline = $(element)
        .find("h2")
        .text()
        .trim();
      url =
        "https://www.nytimes.com" +
        $(element)
          .find("a")
          .attr("href");

      summary = $(element)
        .find("p")
        .text()
        .trim();

      if (!summary) {
        summary = " ";
      }
      if (!url) {
        url += "URL Unavailable";
      }

      // if (head && sum) {
      //   var headNeat = head.replace(/(\r\n|\n|r|\t|\s+)/gm, " ").trim();
      //   var sumNeat = sum.replace(/(\r\n|\n|r|\t|\s+)/gm, " ").trim();

      var dataToAdd = {
        headline: headline,
        summary: summary,
        url: url
        // headline: headNeat,
        // summary: sumNeat
      };

      results.push(dataToAdd);
      // }
    });
    cb(results);
    // Log the results once you've looped through each of the elements found with cheerio
    console.log(results);
  });
};

module.exports = scrape;
