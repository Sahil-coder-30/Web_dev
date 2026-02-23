const express = require('express');
const authRouter = require('./routes/auth.routes');
const cookieParser = require('cookie-parser');
const userModel = require('./models/user.model');
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRouter);

app.get("/api/getData",async (req,res) =>{
    const user = await userModel.find();
    res.status(200).json({
        message: "Data has bees retrived",
        user
    })
})


module.exports = app;

