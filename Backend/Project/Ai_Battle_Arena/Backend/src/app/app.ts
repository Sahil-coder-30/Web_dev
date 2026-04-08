import express from "express";
import authRouter from "../routes/auth.routes.js";
import battleRouter from "../routes/battle.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

const app = express();

// Trust reverse proxy (Vercel) so secure cookies can be set correctly
app.set("trust proxy", 1);
// CORS — dynamically allow frontend URL based on environment
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,           // allow cookies to be sent cross-origin
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(morgan("dev"))
app.use(express.json());
app.use(cookieParser());          // parse incoming cookies

app.use("/auth", authRouter);
app.use("/battle", battleRouter);

export default app;
