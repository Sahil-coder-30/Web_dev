const userModel = require('../models/user.model');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const authRouter = express.Router();
const crypto = require('crypto')


authRouter.post("/register",async (req,res)=>{
    const {email , password , name} = req.body;

    const isUserAlreadyExist = await userModel.findOne({email});
    if(isUserAlreadyExist){
        return res.status(409).json({
            message:"user already exists..."
        })
    }
    const hash = crypto.createHash('md5').update(password).digest('hex')
    
    const user = await userModel.create({
        email,
        password : hash,
        name
    })

    const token = jwt.sign({
       id: user._id
    },
    process.env.JWT_SECRET
)

    res.cookie('JWT_Token',token);

    res.status(201).json({
        message:"The user has been created successfully...",
        user,
        token
    })
    
})

authRouter.post("/protected",async (req,res) =>{
    console.log(req.cookies);
    res.status(200).json({
        message:"This is a protected route."
    })
})

authRouter.post("/login",async (req,res)=>{
    const {email, password} = req.body;

    const user  = await userModel.findOne({email});
    if(!user){
        return res.status(404).json({
            message:"user does not exist!!"
        })
    }

    const isPasswordSame = user.password == crypto.createHash("md5").update(password).digest('hex');
    if(!isPasswordSame){
        return res.status(401).json({
            message:"Invalid password..."
        })
    }

    const token = jwt.sign({
        id:user._id
    },process.env.JWT_SECRET)

    res.cookie("JWT_Token",token);

    res.status(200).json({
        message:"user login successfully...",
        user,
        token
    })

})


module.exports = authRouter;