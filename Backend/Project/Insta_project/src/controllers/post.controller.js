const postModel = require('../models/post.model');
const ImageKit = require('@imagekit/nodejs');
const {toFile} = require('@imagekit/nodejs');
const { Folders } = require('@imagekit/nodejs/resources.js');
const jwt = require("jsonwebtoken");

const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATEKEY
})

async function createPostController (req, res) {

    const file = await imagekit.files.upload({
        file :await toFile(Buffer.from(req.file.buffer) , 'file'),
        fileName : "Test",
        folder : "cohort-2/insta-clone-project"
    })

    const post = await postModel.create({
        caption : req.body.caption,
        imgUrl : file.url,
        user : req.user.id
    })

    return res.status(201).json({
        message : "post created successfully ....",
        post
    })
}

async function getAllPostData(req,res) {
    
    const posts = await postModel.find({
       user : req.user.id
    })

    return res.status(200).json({
        message : "post retrived successfully ....",
        posts
    })

}   

async function getPostDetailsController (req , res ){
    

    const userId = req.user.id;
    const postId = req.params.postId;

    const post = await postModel.findById(postId);

    if(!post){
        return res.status(404).json({
            message : "post not found ..."
        })
    }

    const isValidUser = post.user.toString() === userId.toString()

    if(!isValidUser){
        return res.status(403).json({
            message : "forbidden content..."
        })
    }

    return res.status(200).json({
        message : "post fetched successfully ...",
        post
    })
}






module.exports = {
    createPostController,
    getAllPostData,
    getPostDetailsController
}