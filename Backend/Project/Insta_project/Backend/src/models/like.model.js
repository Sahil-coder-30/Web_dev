const mongoose = require('mongoose');


const likeSchema = new mongoose.Schema({
    post : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "posts",
        required : [true , "post id is required to like a post ..."]
    },
    user : {
        type : String,
        required : [true , "username is required to like a post..."]
    }
} , {
    timestamps : true
})

likeSchema.index({post : 1 , user : 1} , {unique : true});

likeModel = mongoose.model("like" , likeSchema);

module.exports = likeModel;