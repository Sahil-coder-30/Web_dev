const express = require('express');
const { default: mongoose } = require('mongoose');
const authRouter = express.Router();
const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model');

authRouter.post("/register", async (req, res) => {
    const { email , password , name} = req.body;
    const isUserAlreadyExist = await userModel.findOne({email});
    if(isUserAlreadyExist){
        return res.status(400).json({
            message:"User already exist..."
        })
    }
    const user = await userModel.create({
         email,
         password,
         name
    })

    const token = jwt.sign(
        {
            id:user._id,
            email:user.email

        },
        process.env.JWT_SECRET
    )

    res.cookie('jwt_token' , token)

    res.status(201).json({
        message:"The user is created successfully...",
        user,
        token
    })
})




module.exports = authRouter;