const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/user.controller");
const identifyUser = require("../middleware/auth.middleware");

/**
 * @route GET /api/users/follow
 * @description api allow us to get all the follow request i have
 * @access [Protected]
 */

userRouter.get("/follow", identifyUser, userController.getAllFollowRequest);

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

/**
 * @routes /api/users/followers
 * @description use to get all the followers of a person
 * @access Private
 */

userRouter.get("/followers", identifyUser, userController.getAllFollowers);

/**
 * @routes /api/users/:username
 * @description use to get all the details of a person
 * @access Private
 */

userRouter.get("/:username", identifyUser, userController.getUserDetails);

/**
 * @routes /api/users/followers/:username
 * @description use to get all the followers of a person
 * @access Private
 */

userRouter.get(
  "/followers/:username",
  identifyUser,
  userController.getUserFollowers,
);

/**
 * @routes /api/users/following/:username
 * @description use to get all the following of a person
 * @access Private
 */

userRouter.get(
  "/following/:username",
  identifyUser,
  userController.getUserFollowing,
);

module.exports = userRouter;
