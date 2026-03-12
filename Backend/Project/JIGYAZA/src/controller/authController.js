import userModel from "../models/user.model.js";
import jsonwebtoken from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";

export async function authRegisterController(req, res) {
  try {
    const { username, email, password } = req.body;

    const findUser = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (findUser) {
      return res.status(400).json({
        message: `The user already exist with this ${
          findUser.email == email
            ? findUser.username == username
              ? `email: ${email} and username: ${username}`
              : email
            : `username: ${username}`
        }...`,
        success: false,
      });
    }

    const user = await userModel.create({
      username,
      email,
      password,
      // verified defaults to false in the schema, and will be set to true
      // when the user clicks the verification link sent via email.
    });

    // Generate a verification token (optional, adjust as needed)
    const token = jsonwebtoken.sign(
      { id: user._id },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "1h" },
    );

    const verificationUrl = `${process.env.FRONTEND_URL || "http://localhost:3000/api/auth"}/verify?token=${token}`;

    await sendEmail({
      to: email,
      subject: "Welcome to JAGYAZA.ai — Verify your email",
      html: `
        <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
          <h2 style="margin-bottom: 0.5rem;">Welcome to JAGYAZA.ai, ${username}!</h2>
          <p style="margin: 0.75rem 0; line-height: 1.5;">
            Thanks for creating an account with us. To complete your registration and start using your new account,
            please confirm your email address by clicking the button below.
          </p>
          <p style="margin: 1rem 0;">
            <a
              href="${verificationUrl}"
              style="display: inline-block; padding: 0.75rem 1.25rem; background-color: #1d4ed8; color: #ffffff; text-decoration: none; border-radius: 0.35rem;"
            >
              Verify my email
            </a>
          </p>
          <p style="margin: 0.75rem 0; line-height: 1.4; color: #555; font-size: 0.95rem;">
            If you did not create an account with JAGYAZA.ai, you can safely ignore this message.
          </p>
          <p style="margin: 1.5rem 0 0 0; color: #555; font-size: 0.9rem;">
            Cheers,<br />The JAGYAZA.ai Team
          </p>
        </div>
      `,
      text: `Welcome to JAGYAZA.ai, ${username}!

Please verify your email by visiting:
${verificationUrl}

If you did not sign up for an account, you can ignore this message.

— The JAGYAZA.ai Team`,
    });

    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(201).json({
      message:
        "User created successfully. Check your email to verify your account.",
      user: userResponse,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Something went wrong while registering the user.",
      error: err.message,
    });
  }
}

export async function authLoginController(req, res) {
  try {
    const { email, username, password } = req.body;

    if (!password || (!email && !username)) {
      return res.status(400).json({
        message: "Email or username and password are required.",
      });
    }

    const user = await userModel.findOne({
      $or: [{ email }, { username }],
    });

    if (!user) {
      return res.status(404).json({
        message: "No user found with provided credentials.",
      });
    }

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      return res.status(401).json({
        message: "Wrong Paasword Entered...",
      });
    }

    if (!user.verified) {
      return res.status(403).json({
        message: "Please verify your email before logging in.",
      });
    }

    const token = jsonwebtoken.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "1d" },
    );

    // Use res.cookie() (singular) to set an HTTP cookie.
    // Configure options as needed (secure, httpOnly, sameSite, etc.).
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(200).json({
      message: "Login successful.",
      user: userResponse,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Something went wrong while logging in.",
      error: err.message,
    });
  }
}

export async function authVerifyController(req, res) {
  try {
    const { token } = req.query;

    if (!token) {
      return res
        .status(400)
        .json({ message: "Verification token is required." });
    }

    const decoded = jsonwebtoken.verify(
      token,
      process.env.JWT_SECRET || "default_secret",
    );

    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

    if (user.verified) {
      return res.redirect(`${frontendUrl}/login`);
    }

    user.verified = true;
    await user.save();

    return res.redirect(`${frontendUrl}/login`);
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      message: "Verification failed.",
      error: err.message,
    });
  }
}
