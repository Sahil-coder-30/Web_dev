import express from "express";
import {
  authRegisterController,
  authLoginController,
  authVerifyController,
  authGetMeController
} from "../controller/authController.js";
import {
  registerValidator,
} from "../validators/registerValidator.js";
import { identifyUser } from "../middleware/auth.middleware.js";
import { loginValidator } from "../validators/loginValidator.js";

const authRouter = express.Router();

authRouter.post("/register", registerValidator, authRegisterController);
authRouter.post("/login", loginValidator, authLoginController);
authRouter.get("/verify", authVerifyController);
authRouter.get("/getMe", identifyUser, authGetMeController);

export default authRouter;
