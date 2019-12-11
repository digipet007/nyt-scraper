//Require note model and date function
var Note = require("../models/Note");
var makeDate = require("../scripts/date");

module.exports = {
  //Get function will grab all notes asociated with the articles- specifically, their headline ID. These are user-created notes.
  get: function(data, cb) {
    Note.find({ _headlineId: data.id }).exec(function(err, doc) {
      cb(doc);
    });
  },
  //Save function
  save: function(data, cb) {
    var newNote = {
      _headlineId: data._id,
      date: makeDate(),
      noteText: data.noteText
    };
    //Create the note, log any errors. If no errors, it passes the document (the new note) to the callback function
    Note.create(newNote, function(err, doc) {
      if (err) {
      } else {
        cb(doc);
      }
    });
  },
  //Delete function removes the note associated with that article
  delete: function(data, cb) {
    Note.findOneAndDelete({ noteText: data.noteText }).exec(function(err, doc) {
      cb(doc);
    });
  }
};
