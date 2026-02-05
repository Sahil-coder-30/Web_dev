const mongoose = require('mongoose');

const connectDb = () => {
    mongoose.connect(process.env.Mongo_URI)
        .then(() => {
            console.log("database connected.....");
        })
}



module.exports = connectDb;