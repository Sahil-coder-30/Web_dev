import express from "express";
import { authLoginController, authRegisterController, authVerifyEmailController } from "../controllers/auth.controller.js";
import { validateLogin, validateRegister } from "../validators/auth.validator.js";

const authRouter = express.Router();



authRouter.post("/register" ,validateRegister, authRegisterController);
authRouter.post("/login" , validateLogin , authLoginController);
authRouter.get("/verify-email/:token", authVerifyEmailController);

export default authRouter;