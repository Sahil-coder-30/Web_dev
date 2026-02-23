const express = require('express');
const userModel = require('../models/user.model');
const authRouter = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function authRegisterController (req,res){
    const {username , email , password , bio , profileImage} = req.body
    const isUserAlreadyExist = await userModel.findOne({
        $or:[
            {email},
            {username}
        ]
    })

    if(isUserAlreadyExist){
        return res.status(409).json({
            message : (isUserAlreadyExist.email == email ? "user exist with this email already.." : "user exist with this username already...")
        })
    }

    const hash = await bcrypt.hash(password , 10);

    const user = await userModel.create({
        email ,
        username,
        bio,
        profileImage,
        password : hash
    })

    const token = jwt.sign({
        id: user._id
    },process.env.JWT_SECRET , {expiresIn : "1d"})

    res.cookie("token", token);

    res.status(200).json({
        message : "user has been registered successfully...",
        user :{
        email : user.email,
        username : user.username,
        bio : user.bio,
        profileImage : user.profileImage
    }})

}

async function  authLoginController(req, res) {
    const {username , email , password } = req.body;

    const isUserExist = await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
    })

    if(!isUserExist){
        return res.status(409).json({
            message : "user does not exist..."
        })
    }
    
    const isPasswordCorect = await bcrypt.compare(password , isUserExist.password);

    if(!isPasswordCorect){
        return res.status(404).json({
            message : "incorrect password entered..."
        })
    }

    const token = jwt.sign({
        id: isUserExist._id
    },process.env.JWT_SECRET,{expiresIn : "1d"});

    res.cookie("token" , token);

    res.status(200).json({
        message : "user loged in successfully..."
    })

}

module.exports = {
    authRegisterController,
    authLoginController
}