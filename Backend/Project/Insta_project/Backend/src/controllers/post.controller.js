const postModel = require("../models/post.model");
const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");
const jwt = require("jsonwebtoken");
const likeModel = require('../models/like.model');
const { post } = require("../routes/user.routes");

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATEKEY,
});

async function createPostController(req, res) {
  // console.log(req.file);
  
  const file = await imagekit.files.upload({
    file: await toFile(Buffer.from(req.file.buffer), "file"),
    fileName: "Test",
    folder: "cohort-2/insta-clone-project",
  });

  const post = await postModel.create({
    caption: req.body.caption,
    imgUrl: file.url,
    user: req.user.id,
  });

  return res.status(201).json({
    message: "post created successfully ....",
    post,
  });
}

async function getAllPostData(req, res) {
  const posts = await postModel.find({
    user: req.user.id,
  });

  return res.status(200).json({
    message: "post retrived successfully ....",
    posts,
  });
}

async function getPostDetailsController(req, res) {
  const userId = req.user.id;
  const postId = req.params.postId;

  const post = await postModel.findById(postId);

  if (!post) {
    return res.status(404).json({
      message: "post not found ...",
    });
  }

  const isValidUser = post.user.toString() === userId.toString();

  if (!isValidUser) {
    return res.status(403).json({
      message: "forbidden content...",
    });
  }

  return res.status(200).json({
    message: "post fetched successfully ...",
    post,
  });
}

async function likePostController(req, res) {
    const postId = req.params.postId;
    const username = req.user.username;

    const isPostExist = await postModel.findById(postId);

    if(!isPostExist){
        return res.status(404).json({
            message : "post does not exist ..."
        })
    }

    const postAlreadyLiked = await likeModel.findOne({
        post : postId,
        user : username,
    })

    if(postAlreadyLiked){
        return res.status(400).json({
            message : "cannot like one post multiple times ..."
        })
    }

    const like = await likeModel.create({
        post : postId,
        user : username
    })

    return res.status(201).json({
        message : "post has been liked successfully...",
        like
    })

}

module.exports = {
  createPostController,
  getAllPostData,
  getPostDetailsController,
  likePostController
};
