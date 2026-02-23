const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    caption : {
        type : String,
        default : ""
    },
    imgUrl : {
        type : String,
        required : [true , "Image Url is needed to create a post..."]
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "users",
        required : [true , "user id is required to create a new post..."]
    }
})


const postModel = mongoose.model("post", postSchema);

module.exports = postModel;