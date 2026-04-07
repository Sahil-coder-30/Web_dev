import app from "./src/app/app.js";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

app.listen(PORT , ()=>{
    console.log(`Server is running on port ${PORT}`);
})  


 