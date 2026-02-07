const express = require('express');
const authRouter = require('./routes/auth.routes');
const userModel = require('./models/user.model');
const app = express();
const cookieparser = require('cookie-parser')
app.use(express.json());
app.use(cookieparser())

app.use("/api/auth",authRouter)

app.get("/api/authData",async (req,res)=>{

    const user = await userModel.find()
    res.status(200).json({
        message:"The data is...",
        user
    })
})

module.exports = app;




