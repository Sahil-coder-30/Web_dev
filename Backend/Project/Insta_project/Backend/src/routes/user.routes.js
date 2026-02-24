const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/user.controller");
const identifyUser = require("../middleware/auth.middleware");


/**
 * @route GET /api/users/follow
 * @description api allow us to get all the follow request i have
 * @access [Protected]
 */

userRouter.get(
  "/follow",
  identifyUser,
  userController.getAllFollowRequest
)

/**
 * @routes POST /api/users/follow/request/:username.
 * @description use to follow any user.
 * @access Private.
 */

userRouter.post(
  "/follow/request/:username",
  identifyUser,
  userController.followRequestUserController,
);

/**
 * @routes POST /api/users/follow/accept/:username.
 * @description use to follow any user.
 * @access Private.
 */

userRouter.post(
  "/follow/accept/:username",
  identifyUser,
  userController.followRequestAcceptController,
);

/**
 * @route /api/users/follow/reject/:username
 * @description this api is used to reject any follow request which is in pending state
 * @access [Protected]
 */

userRouter.post(
  "/follow/reject/:username",
  identifyUser,
  userController.followRequestRejectController,
);

/**
 * @routes /api/users/unfollow/:username
 * @description use to unfollow the user
 * @access Private
 */

userRouter.post(
  "/unfollow/:username",
  identifyUser,
  userController.unfollowUserController,
);

module.exports = userRouter;
