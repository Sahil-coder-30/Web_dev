const express = require("express");
const postRouter = express.Router();
const postController = require("../controllers/post.controller");
const multer = require("multer");
const upload = multer({ Storage: multer.memoryStorage() });
const identifyUser = require('../middleware/auth.middleware');

/**
 * api to create post ...
 */
postRouter.post("/", upload.single("image"),identifyUser, postController.createPostController);


/**
 * api to get post from the database ....
 */

postRouter.get("/" ,identifyUser, postController.getAllPostData);

/**
 * GET api/posts/details/:postId
 * - return an detail about the post with the id. also check weather the post belongs to the user that the user that from the the user who have req details 
 */

postRouter.get("/details/:postId" ,identifyUser, postController.getPostDetailsController);


module.exports = postRouter;
