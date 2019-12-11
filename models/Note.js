const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const noteSchema = new Schema({
  _headlineId: {
    // type: Schema.Types.ObjectId,
    type: String,
    // ref: "Headline",
    required: true
  },
  date: String,
  noteText: {
    type: String,
    // ref: "Headline",
    required: true
  }
});

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
