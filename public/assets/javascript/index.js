//global "bootbox" functions occur on load
$(document).ready(function() {
  //Set a reference to the article container div where all the dynamic content will go
  var articleContainer = $(".article-container");
  $(document).on("click", ".btn.save", handleArticleSave);
  $(document).on("click", ".scrape-new", handleArticleScrape);

  initPage();

  function initPage() {
    //empty the article container, run an AJAX request for any unsaved headlines
    articleContainer.empty();
    $.get("/api/headlines?saved=false").then(function(data) {
      if (data && data.length) {
        renderArticles(data);
      } else {
        renderEmpty();
      }
    });
  }

  function renderArticles(articles) {
    //append HTML with article data to the page
    //incoming array of JSON containing all available articles in database
    var articlePanels = [];
    //pass each JSON object to the createPanel function which will return a card with article data inside
    for (let i = 0; i < articles.length; i++) {
      articlePanels.push(createPanel(articles[i]));
    }
    //articles are stored in articlePanels array and appended to the article container
    articleContainer.append(articlePanels);
  }

  function createPanel(article) {
    //Takes in a single JSON object (article/headline) and adds it to the DOM
    var panel = `
      <div class="card" style="width: 100%;">
        <div class="card-body">
            <h3 class="card-title">${article.headline}
                <a class="btn btn-success save">Save Article</a>
            </h3>
            <p class="card-text">${article.summary}</p>
        </div>
      </div>
      `;
    //   panel.join("");
    panel.data("_id", article._id);
    return panel;
  }

  function renderEmpty() {
    //To alert user that there are no articles to display
    var emptyAlert = `
      <div class= "alert alert-warning text-center>
        <h4>There are no new articles</h4>
      </div> 
      <div class="card" style="width: 17em;">
        <div class="card-body">
            <h3 class="card-title">What would you like to do?</h3>
            <h4><a class="btn btn-success scrape-new">Try Scraping New Articles</a></h4>
            <h4><a class="btn btn-primary" href="/saved">Go To Saved Articles</a></h4>
        </div>
      </div>
      `;
    articleContainer.append(emptyAlert);
  }

  function handleArticleSave() {
    //triggered on click of save article function, using the headline id created above with panel.data("_id", article._id);
    var articleToSave = $(this)
      .parents(".panel")
      .data();
    articleToSave.saved = true;
    //Since this is an update to an existing article, I am using the semantic patch method
    $.ajax({
      method: "PATCH",
      url: "/api/headlines",
      data: articleToSave
    }).then(function(data) {
      //if successful, Mongoose sends back the data as an object, with a "ok: 1", 1 meaning true
      if (data.ok) {
        initPage();
      }
    });
  }

  function handleArticleScrape() {
    //Triggered by clicking scrape new article buttons
    //go to the api fetch route, run the init page function again to reload new articles
    //alert data.message, from router function
    $.get("/api/fetch").then(function(data) {
      initPage();
      bootbox.alert(
        "<h3 class='text-center m-top-80'>" + data.message + "</h3>"
      );
    });
  }
});
