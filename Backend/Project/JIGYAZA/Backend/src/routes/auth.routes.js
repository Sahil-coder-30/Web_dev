import express from "express";
import {
  authRegisterController,
  authLoginController,
  authVerifyController,
} from "../controller/authController.js";
import { registerValidator } from "../validators/registerValidator.js";

const authRouter = express.Router();

authRouter.post("/register", registerValidator, authRegisterController);
authRouter.post("/login", authLoginController);
authRouter.get("/verify", authVerifyController);

export default authRouter;
