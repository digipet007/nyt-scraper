$(document).ready(function() {
  //Set a reference to the article container div where all the dynamic content will go
  var articleContainer = $(".saved-article-container");
  $(document).on("click", ".delete", handleArticleDelete);
  $(document).on("click", ".notes", handleArticleNotes);
  $(document).on("click", ".note-save", handleNoteSave);
  $(document).on("click", ".note-delete", handleNoteDelete);

  initPage();

  function initPage() {
    articleContainer.empty();
    $.get("/api/headlines?saved=true").then(function(data) {
      //if we have headlines, render them to the page
      if (data && data.length) {
        renderArticles(data);
      } else {
        renderEmpty();
      }
    });
  }

  function renderArticles(articles) {
    //Append HTML w/ aticle data to the page
    //Passed an array of JSON w/ all available articles in the database
    var articlePanels = [];
    for (let i = 0; i < articles.length; i++) {
      articlePanels.push(createPanel(articles[i]));
    }
    articleContainer.append(articlePanels);
  }

  function createPanel(article) {
    //Takes in a single JSON object (article/headline) and adds it to the DOM, when called in renderArticles
    var panel = `
    <div class="card" style="width: 100%;" data-name="${article._id}">
      <div class="card-body">
          <h3 class="card-title">${article.headline}
              <a class="btn btn-danger delete">Delete From Saved</a>
              <a class="btn btn-info notes">Article Notes</a>
          </h3>
          <p class="card-text">${article.summary}</p>
      </div>
    </div>
    `;
    // $(".card").data("_id", article._id);
    // panel.attr("_id", article._id);
    return panel;
  }

  function renderEmpty() {
    //To alert user that there are no articles to display
    var emptyAlert = `

    <div class="text-center" id="welcome">
      <h4>There are no saved articles</h4>
    </div> 
    <div class="card" style="width: 100%;">
      <div class="card-body">
          <h3 class="card-title">What would you like to do?</h3>
          <h4><a class="btn btn-success scrape-new" href="/">Try Scraping New Articles</a></h4>
      </div>
    </div>
      `;
    articleContainer.append(emptyAlert);
  }

  function renderNotesList(data) {
    //renders note list items in notes modal
    var notesToRender = [];
    var currentNote;
    if (!data.notes.length) {
      currentNote = [
        `
          <li class="list-group-item note">No notes for this article yet</li>
          `
      ];
      notesToRender.push(currentNote);
    } else {
      for (let i = 0; i < data.notes.length; i++) {
        currentNote = $([
          `
            <li class="list-group-item note">${data.notes[i].noteText}<button class="btn btn-danger note-delete" data-name="${data.notes[i]._id}">x</button></li>
            `
        ]);
        // $(".note")
        //   .children("button")
        //   .data("_id", data.notes[i]._id);
        // currentNote.children("button").attr("_id", data.notes[i]._id);
        notesToRender.push(currentNote);
      }
    }
    // $(".note-container").append(notesToRender); //did I make a note container?
  }

  function handleArticleDelete() {
    //Deletes articles/headlines
    //triggered on click of save article function
    var articleToDelete = $(this)
      .parents(".card")
      .attr("data-name");
    console.log("==========================================");
    console.log("article to delete: ");
    console.log(articleToDelete);

    var newArticleToDelete = {
      _id: articleToDelete
    };

    $(this)
      .parents(".card")
      .remove();

    $.ajax({
      method: "DELETE",
      url: "/api/headlines/" + articleToDelete,
      data: newArticleToDelete
    }).then(function(data) {
      //if successful, Mongoose sends back the data as an object, with a "ok: 1", 1 meaning true
      if (data.ok) {
        initPage();
      }
    });
  }

  function handleArticleNotes() {
    //append notes and display notes
    //Triggered by clicking scrape new article buttons
    //go to the api fetch route, run the init page function again to reload new articles
    var currentArticle = $(this)
      .parents(".card")
      .attr("data-name");

    //grab notes with particular headline/article id
    $.get("/api/notes/" + currentArticle._id).then(function(data) {
      var modalText = [
        `
        <div class="container-fluid text-center">
            <h4>Notes for Article: ${currentArticle._id}</h4>
            <hr>
            <ul class="container-fluid text-center"></ul>
            <textarea placeholder="New Note" rows="4" cols="60"></textarea>
            <button class="btn btn-success note-save">Save Note</button>
        </div>
        `
      ];
      bootbox.dialog({
        message: modalText,
        closeButton: true
      });
      var noteData = {
        _id: currentArticle._id,
        notes: data || []
      };
      //add info to the button
      $(".btn.save").data("article", noteData);
      // $(".btn.save").attr("article", noteData);
      // renderNotesList(noteData);
    });
  }

  function handleNoteSave() {
    //for when a user tries to save a note
    var noteData;
    // var newNote = $(".bootbox-body textarea")
    //   .val()
    //   .trim();
    //if there is typed data in the note input field, format it and post it to /api/notes route
    // if (newNote) {
    //   noteData = {
    //     id: $(this).data("article").id,
    //     noteText: newNote
    //   };
    // $.post("/api/notes", noteData).then(function() {
    //when complete, hide the modal
    // bootbox.hideAll();
    // });
    // }
  }

  function handleNoteDelete() {
    //delete notes- target note to delete with data _id, created above
    var noteToDelete = $(this).data("_id");
    //delete request sent to /api/notes w/ id of the note to delete as a parameter
    $.ajax({
      url: "/api/notes/" + noteToDelete,
      method: "DELETE"
    }).then(function() {
      //when finished, hide the modal
      // bootbox.hideAll();
    });
  }
});
