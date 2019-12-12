$(document).ready(function() {
  //Set a reference to the article container div where all the dynamic content will go
  var articleContainer = $(".article-container");
  $(document).on("click", ".save", handleArticleSave);
  $(document).on("click", ".scrape-new", handleArticleScrape);

  initPage();

  function initPage() {
    //empty the article container, run an AJAX request for any unsaved headlines
    articleContainer.empty();
    $.get("/api/headlines?saved=false").then(function(data) {
      if (data && data.length) {
        renderArticles(data);
        $(".main-scrape").show();
      } else {
        $(".main-scrape").hide();
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
      <div class="card" style="width: 100%;" data-name="${article._id}">
        <div class="card-body text-center">
            <h3 class="card-title">${article.headline}
            </h3>
            <hr>
            <p class="card-text"><a href="${article.url}" target="_blank">${article.url}<a></p>
            <p class="card-text">${article.summary}</p>
            <a class="btn btn-success right-float save">Save Article</a>
        </div>
      </div>
      `;
    return panel;
  }

  function renderEmpty() {
    //To alert user that there are no articles to display
    //removed from first div: alert alert-warning
    var emptyAlert = `
      <div class= "text-center" id="welcome">
        <h4>There are no new articles</h4>
      </div> 
      <div class="card" style="width: 100%;">
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
      .parents(".card")
      .attr("data-name");
    var newArticleToSave = {
      _id: articleToSave
    };

    // Remove card from page
    $(this)
      .parents(".card")
      .remove();

    //Since this is an update to an existing article
    $.ajax({
      method: "PUT",
      url: "/api/headlines/" + articleToSave,
      data: newArticleToSave
    }).then(function(data) {
      // if successful, Mongoose sends back the data as an object, with a "ok: 1", 1 meaning true
    });
  }

  function handleArticleScrape() {
    //Triggered by clicking scrape new article buttons
    //go to the api fetch route, run the init page function again to reload new articles
    $.get("/api/fetch").then(function(data) {
      initPage();
      // bootbox.alert(data.message);
      alert(data.message);
    });
  }
});
