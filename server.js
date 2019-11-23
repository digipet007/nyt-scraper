// Require Dependencies
var express = require("express");
var expressHandlebars = require("express-handlebars");
var bodyParser = require("body-parser");

// Set up port as either the host's port or port 8080
var PORT = process.env.PORT || 8080;

// Initiate Express App
var app = express();

// Set up Express Router
var router = express.Router();

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

// Listen on the port
app.listen(PORT, function() {
  console.log("Listening on port " + PORT);
});
