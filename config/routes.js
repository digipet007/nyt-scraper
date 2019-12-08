//Require scrape function
const scrape = require("../scripts/scrape");

//Require headlines and notes controllers
const headlinesController = require("../controllers/headlines");
const notesController = require("../controllers/notes");

module.exports = function(router) {
  //render hompage route
  router.get("/", function(req, res) {
    res.render("home");
  });
  //render saved route
  router.get("/saved", function(req, res) {
    res.render("saved");
  });

  //api route to fetch the articles- calls the fetch function within headlines.js. Then it alerts the user of how many articles it added
  router.get("/api/fetch", function(req, res) {
    headlinesController.fetch(function(err, doc) {
      if (!doc || Object.keys(doc).length === 0) {
        res.json({
          message: "No new articles today." //doesn't render
        });
      } else {
        res.json({
          message: "Scraped " + Object.keys(doc).length + " new articles!"
        });
      }
    });
  });

  //api route grabs all the headlines from the database that match the user's query. If the user doesn't specify anything, return everything
  router.get("/api/headlines", function(req, res) {
    var query = {};
    if (req.query.saved) {
      query = req.query;
    }

    headlinesController.get(query, function(data) {
      res.json(data);
    });
  });

  //api route deletes headline with specific id
  router.delete("/api/headlines/:id", function(req, res) {
    var queryId = {};
    queryId = req.params.id;
    //NOTE: I changed the param here from query to query._id
    headlinesController.delete(queryId, function(err, data) {
      res.json(data);
    });
  });

  //Route updates headlines, as needed. Runs headlines controller update function on whatever the user sends in their request
  //NOTE: patch??
  router.patch("/api/headlines", function(req, res) {
    headlinesController.update(req.body, function(err, data) {
      res.json(data);
    });
  });
  //Route grabs all notes associated with an article to display to user
  //Runs route on notes associated with headline id
  router.get("/api/notes/:headline", function(req, res) {
    var queryId = {};
    if (req.params.headline_id) {
      queryId = req.params.headline_id;
    }

    notesController.get(queryId, function(err, data) {
      res.json(data);
    });
  });

  //Route for deleting notes
  router.delete("/api/notes/:id", function(req, res) {
    var queryId = {};
    queryId = req.params.id;
    notesController.delete(query, function(err, data) {
      res.json(data);
    });
  });

  //route for posting new notes to articles
  router.post("/api/notes", function(req, res) {
    notesController.save(req.body, function(data) {
      res.json(data);
    });
  });
};
