import express from 'express'
import { registerValidation  , loginValidation} from "../validators/auth.validator.js";
import { registerController ,verifyEmailController , loginController, logoutController } from "../controllers/auth.controller.js";
const authRouter = express.Router();


/**
 * @route POST /api/auth/register
 * @desc Register a new user with strong validation and sanitization
 * @access Public
 */

authRouter.post("/register", registerValidation , registerController);


/** * @route POST /api/auth/login
 * @desc Login user with strong validation and security checks
 * @access Public
 */


authRouter.post("/login", loginValidation, loginController);

/**
 * @route GET /api/auth/verify
 * @desc Verify user's email using JWT token
 * @access Public
 */

authRouter.get("/verify" , verifyEmailController);

/**
 * @route POST /api/auth/logout
 * @desc Logout user by clearing authentication cookies
 * @access Private
 */

authRouter.post("/logout" , logoutController);

export default authRouter;