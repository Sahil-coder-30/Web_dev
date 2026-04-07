import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_arena_key";

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Read token from httpOnly cookie instead of Authorization header
  const token = req.cookies?.arena_token;

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized", statusCode: 401 });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token", statusCode: 401 });
  }
};
