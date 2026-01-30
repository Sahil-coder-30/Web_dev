// server start karna 
// database se connect karna
require("dotenv").config()
const { default: mongoose } = require('mongoose');
const app = require('./src/app');
const connectDb = require('./src/config/dataBase')






app.listen(3000, () => {
    console.log("server is running on the port 3000.");
    connectDb()
})