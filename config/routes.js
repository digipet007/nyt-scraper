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
      if (doc) {
        res.json({
          message:
            "I have found " + Object.keys(doc).length + " new articles for you."
        });
      } else {
        res.json({
          message: "Articles are up to date!"
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
  router.delete("/api/headlines/delete/:id", function(req, res) {
    headlinesController.delete(req.body._id, function(err, data) {
      res.json(data);
    });
  });

  //Route updates headlines, as needed. Runs headlines controller update function on whatever the user sends in their request
  //NOTE: patch??
  router.put("/api/headlines/:id", function(req, res) {
    headlinesController.update(req.body._id, function(err, data) {
      res.json(data);
    });
  });

  //Route grabs all notes associated with an article to display to user
  //Runs route on notes associated with headline id
  router.get("/api/notes/:id", function(req, res) {
    notesController.get(req.params, function(data) {
      res.json(data);
    });
  });

  //Route for deleting notes
  router.delete("/api/notes/delete/", function(req, res) {
    notesController.delete(req.body, function(err, data) {
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
