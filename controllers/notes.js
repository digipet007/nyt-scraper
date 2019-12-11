//Require note model and date function
var Note = require("../models/Note");
var makeDate = require("../scripts/date");

module.exports = {
  //Get function will grab all notes asociated with the articles- specifically, their headline ID. These are user-created notes.
  get: function(data, cb) {
    console.log("========================");
    console.log("notes.js get function data :");
    console.log(data);
    Note.find({ _headlineId: data.id }).exec(function(err, doc) {
      console.log("========================");
      console.log("notes.js note.find callback doc :");
      console.log(doc);
      cb(doc);

      // Note.find({ _id: data }, function(err, docs) {
      //   console.log("========================");
      //   console.log("notes.js get function's callback doc :");
      //   console.log(docs);
      // });
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
        console.log(err);
      } else {
        console.log("==================");
        console.log(doc);
        cb(doc);
      }
    });
  },
  //Delete function removes the note associated with that article
  delete: function(data, cb) {
    console.log("===============================");
    console.log("notes.js delete data");
    console.log(data.noteText);
    Note.findOneAndDelete({ noteText: data.noteText }).exec(function(err, doc) {
      console.log("======================================");
      console.log("doc from notes.js findOneAndDelete method:");
      console.log(doc);
      cb(doc);
    });
  }
};
