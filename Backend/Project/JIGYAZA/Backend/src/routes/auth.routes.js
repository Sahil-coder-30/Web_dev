import express from "express";
import passport from "passport";
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
  authLogoutController,
  googleCallbackController,
  sendCreatePasswordOtpController,
  createPasswordController
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
authRouter.get("/logout" , identifyUser , authLogoutController);
authRouter.post("/logout" , identifyUser , authLogoutController);

// Google OAuth routes
authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

authRouter.get(
  "/google/callback",
  (req, res, next) => {
    passport.authenticate("google", { session: false }, (err, user, info) => {
      if (err) {
        const errMsg = err.message === "email_has_password"
          ? "This email is registered with a password. Please sign in with your email and password."
          : err.message || "Google authentication failed";
        return res.redirect(`http://localhost:5173/login?error=${encodeURIComponent(errMsg)}`);
      }
      if (!user) {
        const errMsg = (info && info.message) || "Google authentication failed";
        return res.redirect(`http://localhost:5173/login?error=${encodeURIComponent(errMsg)}`);
      }
      req.user = user;
      next();
    })(req, res, next);
  },
  googleCallbackController
);

// Password creation routes for accounts without a password (e.g. Google OAuth signups)
authRouter.post("/send-create-password-otp", sendCreatePasswordOtpController);
authRouter.post("/create-password", createPasswordController);

export default authRouter;
