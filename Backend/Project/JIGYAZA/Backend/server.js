import app from "./src/app.js";
import dotenv from "dotenv";
import connectToDb from "./src/config/db.js";
import redis from "./src/config/dgCache.js";
import http from 'http';
import { initSocket } from "./src/sockets/server.socket.js";

dotenv.config();
connectToDb();

const httpServer = http.createServer(app);
initSocket(httpServer);

// Wait for Redis connection with timeout (non-blocking)
const waitForRedis = async (timeoutMs = 10000) => {
  if (redis.status === "ready") {
    console.log("Redis already connected");
    return;
  }

  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      console.warn("⚠️  Redis connection timeout — server starting without Redis. Caching/OTP features may be unavailable.");
      redis.removeListener("ready", onReady);
      resolve();
    }, timeoutMs);

    const onReady = () => {
      clearTimeout(timeout);
      console.log("Redis connected successfully");
      resolve();
    };

    redis.once("ready", onReady);
  });
};

await waitForRedis();

httpServer.listen(process.env.PORT, () => {
  console.log(`The server is connected on the port ${process.env.PORT}`);
});
