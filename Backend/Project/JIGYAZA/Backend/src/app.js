import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";
import "./config/passport.js";
import authRouter from "./routes/auth.routes.js";
import { authVerifyController } from "./controller/authController.js";
import { errorHandler } from "./middleware/errorHandler.js";
import morgan from "morgan";
import chatRouter from "./routes/chat.routes.js";

const app = express();
app.use(cors({
    origin : 'http://localhost:5173',
    credentials : true
}));

app.get("/status/healthz", (req, res) => {
    res.status(200).send("OK");
})

app.get("/status/readyz", (req, res) => {
    res.status(200).send("OK");
})

app.use(cookieParser());
app.use(express.json());
app.use(morgan("combined"));
app.use(passport.initialize());

// Expose a direct /verify endpoint for email verification links.
app.get("/verify", authVerifyController);

app.use("/api/auth", authRouter);
app.use("/api/chats" , chatRouter);

// global error handler (should be last middleware)
app.use(errorHandler);

export default app;
