const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
    Name:String,
    Age:Number,
    Email:String,
    Phone:String,
    Address:String,
    Occupation:String,
    Salary:Number,
    MaritalStatus:String,
    Children:Number,
    Hobbies:Array,
    Education:String
})

const DataModel = mongoose.model("Data",DataSchema);

module.exports = DataModel;