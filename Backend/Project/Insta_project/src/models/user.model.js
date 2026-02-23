const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        unique : [true , "user with this username is already present ..."],
        required : [true , "username is required..."]
    },
    email : {
        type : String,
        unique : [true , "user with this email already exists..."],
        required : [true , "email is required..."]
    },
    password : {
        type : String,
        required : [true , "password is required..."]
    },
    bio : String,
    profileImage : {
        type : String,
        default : "https://ik.imagekit.io/smamgckyw/avatar-gender-neutral-silhouette-vector-600nw-2470054311.jpg.webp"
    }
    /**
     * one id  = 12bytes,
     * we cannot store the id in the array bcz at scale. of millions of users the storage cross the multiple gb of storage.
     * sollution to this is edge collections supported doc is there in the files for refrence.
     */
})






const userModel = mongoose.model("user" , userSchema);
module.exports = userModel;








