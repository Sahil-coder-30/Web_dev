import dotenv from "dotenv";
dotenv.config();
import app from "./src/app.js";
import { connectToDb } from "./src/config/dataBase.js";

const PORT = process.env.PORT;

connectToDb();

app.listen(PORT || 3000, () => {
  console.log("SERVER IS RUNNING ON PORT 3000...");
});
