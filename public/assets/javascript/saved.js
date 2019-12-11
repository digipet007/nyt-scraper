$(document).ready(function() {
  //Set a reference to the article container div where all the dynamic content will go
  var articleContainer = $(".saved-article-container");
  var modal = $("#appendModalBody");
  var currentArticleId;
  var currentArticleHeadline;
  $(document).on("click", ".delete", handleArticleDelete);
  $(document).on("click", ".notes", handleArticleNotes);
  $(document).on("click", ".note-save", handleNoteSave);
  $(document).on("click", ".note-delete", handleNoteDelete);
  $(document).on("click", ".closer", handleModalClose);

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
    <div class="card" style="width: 100%;" data-name="${article._id}" data-article-name="${article.headline}">
      <div class="card-body">
          <h3 class="card-title">${article.headline}</h3>
          <hr>
          <p class="card-text"><a href="${article.url}" target="_blank">${article.url}<a></p>
          <p class="card-text">${article.summary}</p>
          <a class="btn btn-danger right-float delete">Delete From Saved</a>
          
          <a class="btn btn-info right-float notes">Article Notes</a>
          
          </div>
          </div>
          `;

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

  function handleArticleDelete() {
    //Deletes articles/headlines triggered on click of save article function
    var articleToDelete = $(this)
      .parents(".card")
      .attr("data-name");

    var newArticleToDelete = {
      _id: articleToDelete
    };

    $(this)
      .parents(".card")
      .remove();

    $.ajax({
      method: "Delete",
      url: "/api/headlines/delete/" + articleToDelete,
      data: newArticleToDelete
    }).then(function(data) {
      //if successful, Mongoose sends back the data as an object, with a "ok: 1", 1 meaning true
    });
    // location.reload();
    initPage();
  }

  function renderNotesList(note) {
    var currentNote = $(`
          <div class="container-fluid note"><li>${note.noteText}<button class="btn btn-danger right-float note-delete" data-id="${note._id}" data-name="${note.noteText}">x</button></li></div>
      `);

    return currentNote;
  }

  function renderNotes(theNotes) {
    var noteArray = [];
    var noteList = $("#noted-stuff");
    for (let i = 0; i < theNotes.length; i++) {
      noteArray.push(renderNotesList(theNotes[i]));
    }
    noteList.append(noteArray);
  }

  function handleArticleNotes() {
    //append notes and display notes
    //Triggered by clicking article notes button

    currentArticleId = $(this)
      .parents(".card")
      .attr("data-name");

    currentArticleHeadline = $(this)
      .parents(".card")
      .attr("data-article-name");

    console.log("===========================");
    console.log("currentArticleId from saved.js: ");
    console.log(currentArticleId);
    console.log("===========================");
    console.log("currentArticleHeadline from saved.js: ");
    console.log(currentArticleHeadline);

    var url = `/api/notes/${currentArticleId}`;

    $.get(url, {
      data: currentArticleId
    }).then(function(response) {
      renderNotes(response);
    });

    var modalText = $(`
      <div class="container-fluid text-center">
      <ul class="container-fluid text-center"></ul>
      <textarea id="user-note" placeholder="New Note" rows="4" cols="60"></textarea>
      <button class="btn btn-success note-save" data-id="${currentArticleId}">Save Note</button>
      </div>
      `);

    $("#article-title").append(currentArticleHeadline);
    modal.append(modalText);
    $("#my-modal").removeClass("hidden");
    $("#moodChange").removeClass("hidden");
  }

  function handleNoteSave() {
    //for when a user tries to save a note
    var noteId = $(this).attr("data-id");

    var newNote = $("#user-note")
      .val()
      .trim();

    console.log(newNote);
    console.log(noteId);
    //if there is typed data in the note input field, format it and post it to /api/notes route
    if (newNote) {
      noteData = {
        _id: noteId,
        noteText: newNote
      };

      $.ajax({
        method: "POST",
        url: "/api/notes",
        data: noteData
      }).then(function(data) {
        console.log("=======================================");
        console.log(data);
        renderNotes([data]); //====================================================
      });
    }
    $("#user-note").val("");
  }

  function handleNoteDelete() {
    //delete notes- target note to delete with data _id, created above
    var noteToDelete = $(this).attr("data-name");
    var noteToDeleteId = $(this).attr("data-id");
    console.log("====================");
    console.log("note to delete:");
    console.log(noteToDelete);
    var newNoteToDelete = { noteText: noteToDelete };

    //delete request sent to /api/notes w/ id of the note to delete as a parameter
    $.ajax({
      method: "DELETE",
      url: "/api/notes/delete",
      data: newNoteToDelete
    }).then(function() {});

    $(this)
      .parents(".note")
      .remove();
  }

  function handleModalClose() {
    $("#my-modal").addClass("hidden");
    $("#moodChange").addClass("hidden");
    modal.empty();
    $("#article-title").empty();
    location.reload();
  }
});
