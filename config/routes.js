module.exports = function(router) {
  //render hompage route
  router.get("/", function(req, res) {
    res.render("home");
  });
  //render saved route
  router.get("/saved", function(req, res) {
    res.render("saved");
  });
};
