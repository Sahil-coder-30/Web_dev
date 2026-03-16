import dotenv from "dotenv";
dotenv.config();
import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  db: 0, // Explicitly use database 0
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
  lazyConnect: false, 
  reconnectOnError: (err) => {
    console.log("Redis reconnect on error:", err.message);
    return err.message.includes("ECONNREFUSED");
  },
  retryDelayOnClusterDown: 1000,
});

redis.on("connect", () => {
  console.log("Server is connected to Redis...");
});

redis.on("error", (err) => {
  console.error("Redis connection error:", err.message);
});

redis.on("ready", () => {
  console.log("Redis is ready to receive commands");
});

redis.on("close", () => {
  console.log("Redis connection closed");
});

redis.on("reconnecting", () => {
  console.log("Redis reconnecting...");
});

export default redis;
