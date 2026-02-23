const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/user.controller');
const identifyUser = require('../middleware/auth.middleware');

/**
 * @routes POST /api/users/follow/:username.
 * @description use to follow any user.
 * @access Private.
 */


userRouter.post("/follow/:username" ,identifyUser, userController.followUserController);


/**
 * @routes /api/users/unfollow/:username
 * @description use to unfollow the user
 * @access Private
 */

userRouter.post("/unfollow/:username" , identifyUser , userController.unfollowUserController);


module.exports = userRouter;
