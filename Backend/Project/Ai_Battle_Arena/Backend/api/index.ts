import app from "../src/app/app.js";
import { connectDB } from "../src/config/db.js";

// Connect to MongoDB using the environment variable provided by Vercel
connectDB();

export default app;
