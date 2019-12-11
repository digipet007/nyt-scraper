const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const noteSchema = new Schema({
  _headlineId: {
    type: String,
    required: true
  },
  date: String,
  noteText: {
    type: String,
    required: true
  }
});

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
