import jwt from "jsonwebtoken";
import redis from '../config/dgCache.js';

export const identifyUser =async  (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    const err = new Error("token is required");
    err.statusCode = 401;
    return next(err);
  }
  const blacklistedToken = await redis.get(`blacklist:${token}`);
  if (blacklistedToken) {
    const err = new Error("blacklisted token");
    err.statusCode = 401;
    return next(err);
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    const err = new Error("Unauthorized");
    err.statusCode = 401;
    return next(err);
  }
};
