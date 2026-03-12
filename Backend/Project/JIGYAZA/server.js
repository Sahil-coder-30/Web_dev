import app from "./src/app.js";
import dotenv from 'dotenv'
import connectToDb from "./src/config/db.js";

dotenv.config();
connectToDb();
app.listen(process.env.PORT , ()=>{
    console.log(`The server is connected on the port ${process.env.PORT}`);
})