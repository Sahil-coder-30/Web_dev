import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema({
    username : {
        type : String,
        unique : true,
        required : [true , "username is required to create new user.."]
    },
    email : {
        type : String ,
        unique : true ,
        required : [true , "email is required to create a new user.."]
    },
    password : {
        type : String,
        required : [true , "password is required to create a new user.."],
        select : false
    },
    verified : {
        type : Boolean,
        enum : [true , false],
        default : false
    }
} , {timestamps : true})

userSchema.pre("save" , async function(next){
    if(!this.isModified("password")){
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password , salt);
})

const User = mongoose.model("User" , userSchema);

export default User;