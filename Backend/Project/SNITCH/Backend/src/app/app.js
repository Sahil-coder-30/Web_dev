import express from "express";
import cookieParser from "cookie-parser";
import { errorHandler } from "../error/catch.error.js";
import authRouter from "../routes/auth.routes.js";
const app = express();
app.use(express.json());
app.use(cookieParser());

// routes would go here
// app.use('/api/auth', authRoutes);

// error handler must be last
app.use(errorHandler);

app.use("/api/auth" , authRouter);

export default app;
