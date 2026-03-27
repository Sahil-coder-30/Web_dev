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

// Wait for Redis connection with timeout
const waitForRedis = async (timeoutMs = 10000) => {
  if (redis.status === "ready") {
    return; // Already connected
  }

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error("Redis connection timeout"));
    }, timeoutMs);

    const onReady = () => {
      clearTimeout(timeout);
      redis.removeListener("error", onError);
      resolve();
    };

    const onError = (err) => {
      clearTimeout(timeout);
      redis.removeListener("ready", onReady);
      reject(err);
    };

    redis.once("ready", onReady);
    redis.once("error", onError);
  });
};

await waitForRedis();

httpServer.listen(process.env.PORT, () => {
  console.log(`The server is connected on the port ${process.env.PORT}`);
});
