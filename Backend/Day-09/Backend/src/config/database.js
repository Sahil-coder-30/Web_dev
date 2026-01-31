require("dotenv").config()

const mongoose = require("mongoose");

async function  connectToDb (){
    await mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("connected to Db");
        
    })
    
}

module.exports = connectToDb