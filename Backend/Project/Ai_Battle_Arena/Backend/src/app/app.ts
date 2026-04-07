import express from "express";
import authRouter from "../routes/auth.routes.js";
import battleRouter from "../routes/battle.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// CORS — allow the Vite dev server with credentials (cookies)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,           // allow cookies to be sent cross-origin
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());          // parse incoming cookies

app.use("/auth", authRouter);
app.use("/battle", battleRouter);

export default app;
