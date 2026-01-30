// schema create karna
// it defines the format in which the data should be stored in the datanbase


const mongoose = require("mongoose");
const noteSchema = new mongoose.Schema({
    title:String,
    description:String
})

const NewModel = mongoose.model("notes",noteSchema);

module.exports = NewModel;