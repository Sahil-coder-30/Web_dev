import express from "express";
import {
  authRegisterController,
  authLoginController,
  authVerifyController,
  authGetMeController,
  authVerifyOtpController,
  authResendOtpController,
  authForgetPasswordController,
  authResetPasswordController,
  authCheckAutoVerifyController,
  authLogoutController
} from "../controller/authController.js";
import { registerValidator } from "../validators/registerValidator.js";
import { identifyUser } from "../middleware/auth.middleware.js";
import { loginValidator } from "../validators/loginValidator.js";

const authRouter = express.Router();

authRouter.post("/register", registerValidator, authRegisterController);
authRouter.post("/login", loginValidator, authLoginController);
authRouter.get("/verify", authVerifyController);
authRouter.get("/getMe", identifyUser, authGetMeController);
authRouter.post("/verify-otp", authVerifyOtpController);
authRouter.post("/resend-otp", authResendOtpController); // Reuse OTP controller for resending
authRouter.post("/forget-password", authForgetPasswordController);
authRouter.post("/reset-password", authResetPasswordController);
authRouter.post("/auto-verify", authCheckAutoVerifyController);
authRouter.post("/logout" , identifyUser , authLogoutController);

export default authRouter;
