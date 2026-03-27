import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();    

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
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
