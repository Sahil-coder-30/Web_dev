import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true
    },
    contact : {
        type : String,
        required : true,
        unique : true
    },
    role : {
        type : String,
        enum : ["BUYER", "SELLER"],
        required : true,
        default : "BUYER"
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    profilePicture : {
        type : String,
        default : "",
    },
    verified : {
        type : Boolean,
        default : false
    }
} , { timestamps : true })

const userModel = mongoose.model("User", userSchema);

export default userModel;