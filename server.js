// Require Dependencies
var express = require("express");
var mongoose = require("mongoose");
var expressHandlebars = require("express-handlebars");
var bodyParser = require("body-parser");

// To avoid deprecations with Mongoose need to test still
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

// Set up port as either the host's port or port 8080
var PORT = process.env.PORT || 8080;

// Initiate Express App
var app = express();

// Set up Express Router
var router = express.Router();

//require routes file; router object passed through
require("./config/routes")(router);

// Designate public folder as a static directory
app.use(express.static(__dirname + "/public"));

// Connect Handlebars to Express App
app.engine(
  "handlebars",
  expressHandlebars({
    defaultLayout: "main"
  })
);

// Use bodyparser in app
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

// Pass every request through router middleware
app.use(router);

// If deployed, use the deployed database. Otherwise use the local database
var db = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Connect mongoose to the database
mongoose.connect(db, function(error) {
  // log any mongoose errors
  if (error) {
    console.log(error);
  }
  // or log a success message
  else {
    console.log("mongoose connection is successful");
  }
});

// Listen on the port
app.listen(PORT, function() {
  console.log("Listening on port " + PORT);
});
