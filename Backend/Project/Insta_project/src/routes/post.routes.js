const express = require("express");
const postRouter = express.Router();
const postController = require("../controllers/post.controller");
const multer = require("multer");
const upload = multer({ Storage: multer.memoryStorage() });
const identifyUser = require("../middleware/auth.middleware");

/**
 *@route POST /api/posts/
 @description api to create post ...
 @access [Protected]
 */
postRouter.post(
  "/",
  upload.single("image"),
  identifyUser,
  postController.createPostController,
);

/**
 * @route GET /api/posts/
 * @description api to get post from the database ....
 * @access [Protected]
 */

postRouter.get("/", identifyUser, postController.getAllPostData);

/**
 *@route GET /api/posts/details/:postId
 *@description return an detail about the post with the id. also check weather the post belongs to the user that the user that from the the user who have req details
 *@access [Protected]
 */

postRouter.get(
  "/details/:postId",
  identifyUser,
  postController.getPostDetailsController,
);

/**
 * @route POST /api/posts/like/:postId
 * @description the api is used to like the post by providing the postId in the req.params
 * @access [Protected]
 */

postRouter.post(
  "/like/:postId",
  identifyUser,
  postController.likePostController,
);

module.exports = postRouter;
