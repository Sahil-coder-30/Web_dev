const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
    title:String,
    description: String
})

const NoteModel = mongoose.model("notes",noteSchema);

module.exports = NoteModel;