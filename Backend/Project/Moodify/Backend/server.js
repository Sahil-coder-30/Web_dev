import dotenv from "dotenv";
dotenv.config();
import app from "./src/app.js";
import { connectToDb } from "./src/config/dataBase.js";
import redis from "./src/config/cache.js";

const PORT = process.env.PORT;

async function startServer() {
  try {
    // Wait for database connection
    await connectToDb();

    // Wait for Redis connection (it should already be connecting due to lazyConnect: false)
    console.log("Waiting for Redis connection...");
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Redis connection timeout"));
      }, 10000);

      if (redis.status === "ready") {
        clearTimeout(timeout);
        resolve();
      } else {
        redis.once("ready", () => {
          clearTimeout(timeout);
          resolve();
        });
        redis.once("error", (err) => {
          clearTimeout(timeout);
          reject(err);
        });
      }
    });

    app.listen(PORT || 3000, () => {
      console.log(`SERVER IS RUNNING ON PORT ${PORT || 3000}...`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
