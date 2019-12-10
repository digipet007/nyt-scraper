const cheerio = require("cheerio");
const axios = require("axios");

// Make a request via axios to grab the HTML body from the site of your choice
const scrape = function(cb) {
  axios.get("https://www.nytimes.com").then(function(response) {
    // Load the HTML into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands
    var $ = cheerio.load(response.data);

    // An empty array to save the data that we'll scrape
    var results = [];

    // Select each element in the HTML body from which you want information.
    // NOTE: Cheerio selectors function similarly to jQuery's selectors
    $("article.css-8atqhb").each(function(i, element) {
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

      var dataToAdd = {
        headline: headline,
        summary: summary,
        url: url
      };

      results.push(dataToAdd);
    });
    cb(results);
  });
};

module.exports = scrape;
