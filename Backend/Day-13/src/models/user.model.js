const mongoose = require('mongoose');

const userSchema =new mongoose.Schema({
    email:{
        type:String,
        unique:[true,"user already exist..."]
    },
    password: String,
    name: String
})

const userModel = mongoose.model("user",userSchema);

module.exports = userModel