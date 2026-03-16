import jwt from "jsonwebtoken";
import redis from "../config/cache.js";

const identifyUser = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "No token found in cookies." });
  }

  try {
    const isBlacklisted = await redis.get(token);
    if (isBlacklisted) {
      return res
        .status(401)
        .json({ message: "Token has been blacklisted. Please log in again." });
    }
  } catch (error) {
    console.error("Failed to check token blacklist:", error.message);
    // If Redis is down, allow the request to proceed (fail open for auth)
    // You might want to log this for monitoring
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    req.user = decoded; // Attach user info to request object
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

export default identifyUser;
