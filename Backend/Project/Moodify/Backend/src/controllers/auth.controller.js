import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";

export const registerController = async (req, res) => {
  const { username, email, password } = req.body;

  const findUser = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (findUser) {
    return res.status(409).json({
      message: `user already exist with this ${username === findUser.username ? (email === findUser.email ? "email and username.." : "username..") : "email.."}`,
      user: findUser,
    });
  }

  const user = await userModel.create({
    username,
    email,
    password,
  });

  const token = jwt.sign(
    {
      username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );

  const verificationUrl = `${process.env.FRONTEND_URL || "http://localhost:3000/api/auth"}/verify?token=${token}`;

  await sendEmail({
    to: email,
    subject: "Welcome to Moodify — Verify your email",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification - Moodify.io</title>
        <style>
          body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
          .content { padding: 40px 30px; color: #333333; line-height: 1.6; }
          .content h2 { color: #4a5568; font-size: 22px; margin-bottom: 20px; }
          .btn { display: inline-block; padding: 15px 30px; background-color: #667eea; color: white; text-decoration: none; border-radius: 5px; font-weight: 600; font-size: 16px; margin: 20px 0; transition: background-color 0.3s; }
          .btn:hover { background-color: #5a67d8; }
          .footer { background-color: #f8f9fa; padding: 30px; text-align: center; color: #666666; font-size: 14px; }
          .footer p { margin: 5px 0; }
          @media (max-width: 600px) { .container { margin: 10px; } .header, .content, .footer { padding: 20px; } .header h1 { font-size: 24px; } }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Moodify by Sahil Sharma</h1>
            <p>Enhance Your Mood with AI</p>
          </div>
          <div class="content">
            <h2>Welcome aboard, ${username}!</h2>
            <p>Thank you for joining Moodify by Sahil Sharma. We're excited to have you as part of our community of innovators and creators.</p>
            <p>To get started and unlock all the features of your account, please verify your email address by clicking the button below:</p>
            <a href="${verificationUrl}" class="btn">Verify My Email Address</a>
            <p><strong>This verification link will expire in 1 hour.</strong></p>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background-color: #f8f9fa; padding: 10px; border-radius: 4px; font-family: monospace;">${verificationUrl}</p>
            <p>If you didn't create an account with Moodify by Sahil Sharma, please disregard this email. Your email address will not be used.</p>
          </div>
          <div class="footer">
            <p><strong>Moodify by Sahil Sharma Team</strong></p>
            <p>Enhance Your Mood with AI</p>
            <p>Questions? Contact us at <a href="mailto:support@moodify.com" style="color: #667eea;">support@moodify.com</a></p>
            <p>&copy; 2026 Moodify by Sahil Sharma. All rights reserved.</p>
            <p style="margin-top: 20px; font-style: italic; color: #888;">Best regards,<br />Sahil Sharma</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Welcome to Moodify by Sahil Sharma, ${username}!

Thank you for joining us. To verify your email and activate your account, please visit:
${verificationUrl}

This link expires in 1 hour.

If you didn't sign up, you can ignore this email.

Best regards,
The Moodify by Sahil Sharma Team
support@moodify.com

Sahil Sharma
    `,
  });

  return res.status(201).json({
    message:
      "User registered successfully! Please check your email to verify your account.",
    user,
  });
};

export const verifyEmailController = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: "Verification token is missing." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { username } = decoded;

    const user = await userModel.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.verified) {
      return res.status(400).json({ message: "Email is already verified." });
    }

    user.verified = true;
    await user.save();

    return res.status(200).json({ message: "Email verified successfully!" });
  } catch (err) {
    console.error("Email verification failed:", err);
    return res
      .status(400)
      .json({ message: "Invalid or expired verification token." });
  }
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return res.status(404).json({ message: "User not found with this email." });
  }

  if (!user.verified) {
    return res
      .status(403)
      .json({ message: "Please verify your email before logging in." });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return res.status(200).json({
    message: "Login successful!",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
};

export const logoutController = (req, res) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(400).json({ message: "No token found in cookies." });
  }

  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  return res.status(200).json({ message: "Logout successful!" });
};
