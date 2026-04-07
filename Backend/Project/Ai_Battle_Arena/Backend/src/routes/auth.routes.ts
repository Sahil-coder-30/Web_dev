import { Router } from "express";
import { registerUser, loginUser, logoutUser, refresh, getMe } from "../controller/authController.js";
import { validateLogin } from "../validators/loginValidator.js";
import { validateRegister } from "../validators/registerValidator.js";
import { authenticate } from "../middleware/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", validateRegister, registerUser);
authRouter.post("/login", validateLogin, loginUser);
authRouter.post("/logout", authenticate, logoutUser);
authRouter.post("/refresh", refresh);

// the frontend also expects /me to fetch profile info
authRouter.get("/me", authenticate, getMe);

export default authRouter;
