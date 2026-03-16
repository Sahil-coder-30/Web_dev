import express from "express";
import cookieParser from "cookie-parser";

import authRouter from "./routes/auth.routes.js";
import { authVerifyController } from "./controller/authController.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(cookieParser());
app.use(express.json());

// Expose a direct /verify endpoint for email verification links.
app.get("/verify", authVerifyController);

app.use("/api/auth", authRouter);

// global error handler (should be last middleware)
app.use(errorHandler);

export default app;
