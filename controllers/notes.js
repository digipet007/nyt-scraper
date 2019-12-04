//Require note model and date function
var Note = require("../models/Note");
var makeDate = require("../scripts/date");

module.exports = {
  //Get function will grab all notes asociated with the articles- specifically, their headline ID. These are user-created notes.
  get: function(data, cb) {
    Note.find(
      {
        _headLineId: data._id
      },
      cb
    );
  },
  //Save function
  save: function(data, cb) {
    //Object has headline ID associated with the note that is being created, the date from the makeDate function, and the note text, which is what the user typed in
    var newNote = {
      _headLineId: data._id,
      date: makeDate(),
      noteText: data.noteText
    };
    //Create the note, log any errors. If no errors, it passes the document (the new note) to the callback function
    Note.create(newNote, function(err, doc) {
      if (err) {
        console.log(err);
      } else {
        console.log(doc);
        cb(doc);
      }
    });
  },
  //Delete function removes the note associated with that article
  delete: function(data, cb) {
    Note.remove(
      {
        _id: data._id
      },
      cb
    );
  }
};
