import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_arena_key";

const COOKIE_OPTIONS = {
  httpOnly: true,       // JS cannot read the cookie — prevents XSS token theft
  secure: process.env.NODE_ENV === "production",  // HTTPS only in prod
  sameSite: "lax" as const,  // lax works for same-site navigation; use "none" if deployed cross-site
  maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "User already exists", statusCode: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id, email: newUser.email }, JWT_SECRET, { expiresIn: "24h" });

    // Set token as an httpOnly cookie instead of returning it in the body
    res.cookie("arena_token", token, COOKIE_OPTIONS);

    res.status(201).json({
      success: true,
      user: { id: newUser._id, username: newUser.username, email: newUser.email }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server error", statusCode: 500, errors: [error.message] });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials", statusCode: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials", statusCode: 401 });
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: "24h" });

    // Set token as an httpOnly cookie instead of returning it in the body
    res.cookie("arena_token", token, COOKIE_OPTIONS);

    res.status(200).json({
      success: true,
      user: { id: user._id, username: user.username, email: user.email }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server error", statusCode: 500, errors: [error.message] });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  // Clear the cookie on logout
  res.clearCookie("arena_token", { ...COOKIE_OPTIONS, maxAge: 0 });
  res.status(200).json({ success: true, message: "Logged out successfully" });
};



export const refresh = async (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "Refresh logic pending" });
};

export const getMe = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found", statusCode: 404 });
    }

    res.status(200).json({
      success: true,
      user: { id: user._id, username: user.username, email: user.email }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server error", statusCode: 500, errors: [error.message] });
  }
};
