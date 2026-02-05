require("dotenv").config()
const mongoose = require("mongoose");

const ConnectToDb = async ()=>{
    await mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected To Db");
    })
}

module.exports = ConnectToDb;

