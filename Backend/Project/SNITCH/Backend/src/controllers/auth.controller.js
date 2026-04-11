import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";

export const authRegisterController = async (req, res, next) => {
  try {
    const { username, email, password, contact, role } = req.body;

    const userAlreadyExists = await userModel.findOne({
      $or: [{ email: email }, { username: username }],
    });
    console.log(userAlreadyExists);

    if (userAlreadyExists) {
      return res.status(400).json({
        message: "User with the given email or username already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      username,
      email,
      password: hashedPassword,
      contact,
      role,
    });

    const emailVerificationToken = jwt.sign(
      {
        userId: newUser._id,
        email: newUser.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    const verificationLink = `http://localhost:3000/api/auth/verify-email/${emailVerificationToken}`;

    await sendEmail({
      to: newUser.email,
      subject: "Verify Your Email Address - SNITCH",
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0; }
        .email-container { max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 16px; color: #333; margin-bottom: 20px; }
        .greeting strong { color: #667eea; }
        .message { font-size: 15px; color: #555; line-height: 1.6; margin: 20px 0; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 12px 40px; border-radius: 5px; font-weight: 600; margin: 30px 0; text-align: center; }
        .cta-button:hover { opacity: 0.9; }
        .info-box { background-color: #f0f4ff; padding: 15px; border-left: 4px solid #667eea; border-radius: 4px; margin: 25px 0; font-size: 14px; color: #555; }
        .footer { background-color: #f8f8f8; padding: 25px; text-align: center; border-top: 1px solid #e0e0e0; }
        .footer p { margin: 8px 0; font-size: 13px; color: #888; }
        .divider { height: 1px; background-color: #e0e0e0; margin: 25px 0; }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>✓ Verify Your Email</h1>
        </div>
        
        <div class="content">
            <p class="greeting">Hi <strong>${newUser.username}</strong>,</p>
            
            <p class="message">Thank you for creating an account with <strong>SNITCH</strong>. We're excited to have you on board!</p>
            
            <p class="message">To complete your registration and unlock all features, please verify your email address by clicking the button below:</p>
            
            <div style="text-align: center;">
                <a href="${verificationLink}" class="cta-button">Verify Email Address</a>
            </div>
            
            <p class="message">Or copy and paste this link in your browser:</p>
            <p style="font-size: 13px; color: #666; word-break: break-all; background-color: #f0f4ff; padding: 12px; border-radius: 4px;">${verificationLink}</p>
            
            <div class="divider"></div>
            
            <div class="info-box">
                <strong>⏱ Link Expiration:</strong> This verification link will expire in <strong>24 hours</strong>. If it expires, you can request a new one from your account settings.
            </div>
            
            <div class="info-box">
                <strong>⚠ Security Notice:</strong> If you did not create this account, please ignore this email or contact our support team immediately.
            </div>
            
            <p class="message" style="margin-top: 30px;">If you need help, feel free to reach out to our support team at <strong>support@snitch.com</strong>.</p>
        </div>
        
        <div class="footer">
            <p><strong>SNITCH</strong></p>
            <p>© ${new Date().getFullYear()} SNITCH. All rights reserved.</p>
            <p style="margin-top: 15px; color: #aaa; font-size: 12px;">This is an automated message. Please do not reply directly to this email.</p>
        </div>
    </div>
</body>
</html>`,
    });

    res.status(201).json({
      message:
        "user registered successfully, please verify your email to activate your account",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.log(error);
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Something went wrong while logging in.";
    return next(err);
  }
};

export const authVerifyEmailController = async (req, res, next) => {
  try {
    const { token } = req.params;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.verified) {
      return res.status(400).json({
        message: "Email is already verified",
      });
    }

    user.verified = true;
    await user.save();

    res.status(200).json({
      message:
        "Email verified successfully, you can now log in to your account",
    });
  } catch (error) {
    console.log(error);
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Something went wrong while logging in.";
    return next(err);
  }
};

export const authLoginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(409).json({
        message: "user does not exist with this email...",
      });
    }
    if(!user.verified){
      return res.status(403).json({
        message: "Please verify your email before logging in.",
      }); 
    }
    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(409).json({
        message: "You have entered the wrong password...",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.status(201).json({
      message: "user login successfully...",
    });
  } catch (err) {
    console.log(err);
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Something went wrong while logging in.";
    return next(err);
  }
};
