import userModel from "../models/user.model.js";
import jsonwebtoken from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";
import redis from "../config/dgCache.js";
import bcrypt from "bcryptjs";

export async function authRegisterController(req, res, next) {
  try {
    const { username, email, password } = req.body;

    const findUser = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (findUser) {
      const err = new Error(
        `The user already exist with this ${
          findUser.email == email
            ? findUser.username == username
              ? `email: ${email} and username: ${username}`
              : email
            : `username: ${username}`
        }...`,
      );
      err.statusCode = 400;
      return next(err);
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

    const verificationUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/verify?token=${token}`;

    // ─────────────────────────────────────────────────────────────────────────────
    // jigyazaAi — Verification Email
    // Two verification paths:
    //   1. Click the magic link  → instant verify, no typing
    //   2. Enter the 6-digit OTP → verify on the /verify page manually
    // Same variables: email, username, verificationUrl, otp
    // ─────────────────────────────────────────────────────────────────────────────

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await redis.setex(`otp:${email}`, 300, otp); // 5 min expiry

    await sendEmail({
      to: email,
      subject: "Verify your email — jigyazaAi",

      // ── PLAIN TEXT FALLBACK ───────────────────────────────────────────────────
      text: `
jigyazaAi — Research Engine

Hey ${username},

One step left before you can start researching.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OPTION 1 — Click the magic link:
${verificationUrl}

OPTION 2 — Enter this code on jigyazaai.com/verify:

  ${otp.split("").join("  ")}

This code expires in 5 minutes.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If you didn't create a jigyazaAi account, ignore this email.
Nothing will change and your address won't be used.

— The jigyazaAi Team
hello@jigyazaai.com
  `.trim(),

      // ── HTML EMAIL ────────────────────────────────────────────────────────────
      html: `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="color-scheme" content="light dark" />
  <meta name="supported-color-schemes" content="light dark" />
  <title>Verify your email — jigyazaAi</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings>
    <o:PixelsPerInch>96</o:PixelsPerInch>
  </o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; }
    img { -ms-interpolation-mode: bicubic; border: 0; display: block; }
    a { color: inherit; }

    @media (prefers-color-scheme: dark) {
      .email-body    { background-color: #070709 !important; }
      .email-card    { background-color: #0F0D0B !important; border-color: #1E1B18 !important; }
      .card-body     { background-color: #0F0D0B !important; }
      .text-headline { color: #F0EBE3 !important; }
      .text-body     { color: #7A7068 !important; }
      .text-muted    { color: #4A4440 !important; }
      .divider-line  { border-color: #1E1B18 !important; }
      .or-divider-bg { background-color: #0F0D0B !important; }
      .or-divider-tx { color: #3A3430 !important; }
      .otp-wrapper   { background-color: #1C1916 !important; border-color: #2A2520 !important; }
      .otp-cell      { background-color: #141210 !important; border-color: #3D3630 !important; }
      .otp-digit     { color: #C8621A !important; }
      .otp-label     { color: #4A4440 !important; }
      .expiry-badge  { background-color: #1C1510 !important; border-color: #2A1E14 !important; color: #C8621A !important; }
      .footer-bg     { background-color: #070709 !important; }
      .footer-text   { color: #3A3430 !important; }
      .footer-link   { color: #4A4440 !important; }
      .security-bg   { background-color: #0A0806 !important; border-color: #1E1B18 !important; }
      .security-text { color: #4A4440 !important; }
    }
  </style>
</head>

<body class="email-body" style="
  background-color: #F0EDE8;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  margin: 0; padding: 0; width: 100%;
">

<!-- Preheader -->
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
  ${username}, your jigyazaAi verification code is ${otp} — or click the link to verify instantly.&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌
</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F0EDE8;">
  <tr>
    <td align="center" style="padding: 40px 16px;">

      <table class="email-card" role="presentation" width="100%" cellpadding="0" cellspacing="0" style="
        background-color: #FFFFFF;
        border: 1px solid #E8E2D8;
        border-radius: 12px;
        max-width: 520px;
        overflow: hidden;
      ">

        <!-- ══ DARK HEADER ══ -->
        <tr>
          <td style="background-color: #0A0806; padding: 24px 40px; border-radius: 11px 11px 0 0;">
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="vertical-align: middle;">
                  <table role="presentation" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding-right: 10px; vertical-align: middle;">
                        <svg width="30" height="30" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="48" cy="48" r="43" stroke="#C8621A" stroke-width="5" fill="none"/>
                          <circle cx="48" cy="48" r="26" stroke="#C8621A" stroke-width="2.5" fill="none" stroke-dasharray="8 10" stroke-opacity="0.4"/>
                          <line x1="48" y1="4"  x2="48" y2="15" stroke="#C8621A" stroke-width="5" stroke-linecap="round"/>
                          <line x1="92" y1="48" x2="81" y2="48" stroke="#C8621A" stroke-width="5" stroke-linecap="round"/>
                          <line x1="48" y1="92" x2="48" y2="81" stroke="#C8621A" stroke-width="5" stroke-linecap="round"/>
                          <line x1="4"  y1="48" x2="15" y2="48" stroke="#C8621A" stroke-width="5" stroke-linecap="round"/>
                          <circle cx="48" cy="18" r="6" fill="#C8621A"/>
                          <line x1="67" y1="67" x2="82" y2="82" stroke="#C8621A" stroke-width="6" stroke-linecap="round"/>
                          <circle cx="85" cy="85" r="5" fill="#C8621A"/>
                          <circle cx="48" cy="48" r="13" fill="#1C1510"/>
                          <circle cx="48" cy="48" r="8"  fill="#C8621A"/>
                        </svg>
                      </td>
                      <td style="vertical-align: middle;">
                        <span style="
                          font-family: Georgia, 'Times New Roman', serif;
                          font-style: italic;
                          font-size: 19px;
                          color: #F0EBE3;
                          letter-spacing: -0.3px;
                        ">jigyaza<span style="color:#C8621A;">Ai</span></span>
                      </td>
                      <td align="right" style="vertical-align: middle;">
                        <span style="
                          font-family: 'Courier New', Courier, monospace;
                          font-size: 8px;
                          color: #C8621A;
                          text-transform: uppercase;
                          letter-spacing: 1.6px;
                        ">Research Engine</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Amber accent line -->
        <tr><td style="height: 3px; background-color: #C8621A;"></td></tr>

        <!-- ══ BODY ══ -->
        <tr>
          <td class="card-body" style="padding: 44px 40px 36px;">

            <!-- Eyebrow -->
            <p style="
              font-family: 'Courier New', Courier, monospace;
              font-size: 9px; color: #B45309;
              text-transform: uppercase; letter-spacing: 2px;
              margin: 0 0 14px 0;
            ">Email Verification</p>

            <!-- Headline -->
            <h1 class="text-headline" style="
              font-family: Georgia, 'Times New Roman', serif;
              font-style: italic; font-size: 28px; font-weight: 400;
              color: #1A1714; line-height: 1.1;
              letter-spacing: -0.4px; margin: 0 0 16px 0;
            ">One step left,<br />${username}.</h1>

            <!-- Subtext -->
            <p class="text-body" style="
              font-size: 14px; font-weight: 300;
              color: #6A6460; line-height: 1.7;
              margin: 0 0 36px 0;
            ">Verify your email to unlock your account. Use whichever method is easier — click the button or enter the code below.</p>


            <!-- ══════════════════════════════════════════════ -->
            <!-- PATH 1 — MAGIC LINK                           -->
            <!-- ══════════════════════════════════════════════ -->

            <!-- Path label -->
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 14px;">
              <tr>
                <td style="vertical-align: middle; padding-right: 10px;">
                  <div style="
                    display: inline-block;
                    width: 20px; height: 20px;
                    background-color: #C8621A;
                    border-radius: 50%;
                    text-align: center;
                    line-height: 20px;
                    font-family: 'Courier New', Courier, monospace;
                    font-size: 9px;
                    font-weight: 700;
                    color: #ffffff;
                  ">1</div>
                </td>
                <td style="vertical-align: middle;">
                  <span style="
                    font-family: 'Courier New', Courier, monospace;
                    font-size: 9px; color: #B45309;
                    text-transform: uppercase; letter-spacing: 1.8px;
                  ">Click the magic link</span>
                </td>
              </tr>
            </table>

            <!-- CTA Button -->
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 32px;">
              <tr>
                <td>
                  <!--[if mso]>
                  <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word"
                    href="${verificationUrl}"
                    style="height:52px;v-text-anchor:middle;width:440px;"
                    arcsize="12%" fillcolor="#C8621A" stroke="f">
                    <w:anchorlock/>
                    <center style="color:#ffffff;font-family:sans-serif;font-size:15px;font-weight:600;">
                      Verify my email instantly &rarr;
                    </center>
                  </v:roundrect>
                  <![endif]-->
                  <!--[if !mso]><!-->
                  <a href="${verificationUrl}" style="
                    display: block;
                    background-color: #C8621A;
                    color: #ffffff;
                    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                    font-size: 15px; font-weight: 600;
                    text-decoration: none;
                    letter-spacing: 0.2px;
                    padding: 15px 24px;
                    border-radius: 6px;
                    text-align: center;
                    mso-hide: all;
                  ">Verify my email instantly &rarr;</a>
                  <!--<![endif]-->
                </td>
              </tr>
            </table>


            <!-- ══ OR DIVIDER ══ -->
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 28px;">
              <tr>
                <td style="padding-right: 12px;">
                  <div class="divider-line" style="height: 1px; background-color: #E8E2D8;"></div>
                </td>
                <td style="white-space: nowrap;">
                  <span class="or-divider-tx" style="
                    font-family: 'Courier New', Courier, monospace;
                    font-size: 9px; color: #B8B0A5;
                    text-transform: uppercase; letter-spacing: 2px;
                  ">or</span>
                </td>
                <td style="padding-left: 12px;">
                  <div class="divider-line" style="height: 1px; background-color: #E8E2D8;"></div>
                </td>
              </tr>
            </table>


            <!-- ══════════════════════════════════════════════ -->
            <!-- PATH 2 — OTP CODE                             -->
            <!-- ══════════════════════════════════════════════ -->

            <!-- Path label -->
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 16px;">
              <tr>
                <td style="vertical-align: middle; padding-right: 10px;">
                  <div style="
                    display: inline-block;
                    width: 20px; height: 20px;
                    background-color: #1C1510;
                    border: 1px solid #C8621A;
                    border-radius: 50%;
                    text-align: center;
                    line-height: 18px;
                    font-family: 'Courier New', Courier, monospace;
                    font-size: 9px; font-weight: 700;
                    color: #C8621A;
                  ">2</div>
                </td>
                <td style="vertical-align: middle;">
                  <span style="
                    font-family: 'Courier New', Courier, monospace;
                    font-size: 9px; color: #B45309;
                    text-transform: uppercase; letter-spacing: 1.8px;
                  ">Enter this code at jigyazaai.com/verify</span>
                </td>
              </tr>
            </table>

            <!-- OTP box -->
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 16px;">
              <tr>
                <td>
                  <div class="otp-wrapper" style="
                    background-color: #F5F0E8;
                    border: 1px solid #E0D8CC;
                    border-radius: 10px;
                    padding: 24px 20px;
                    text-align: center;
                  ">
                    <!-- OTP label -->
                    <p class="otp-label" style="
                      font-family: 'Courier New', Courier, monospace;
                      font-size: 9px; color: #8A7A70;
                      text-transform: uppercase; letter-spacing: 2px;
                      margin: 0 0 16px 0;
                    ">Your verification code</p>

                    <!-- OTP digits — each in its own cell -->
                    <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto 16px;">
                      <tr>
                        ${otp
                          .split("")
                          .map(
                            (digit) => `
                        <td style="padding: 0 4px;">
                          <div class="otp-cell" style="
                            background-color: #FFFFFF;
                            border: 1.5px solid #E8E2D8;
                            border-radius: 6px;
                            width: 44px; height: 52px;
                            text-align: center;
                            line-height: 52px;
                            font-family: 'Courier New', Courier, monospace;
                            font-size: 26px; font-weight: 700;
                            color: #C8621A;
                            letter-spacing: 0;
                          ">${digit}</div>
                        </td>`,
                          )
                          .join("")}
                      </tr>
                    </table>

                    <!-- Expiry badge -->
                    <div style="display: inline-block;">
                      <span class="expiry-badge" style="
                        display: inline-block;
                        background-color: #FFF0E0;
                        border: 1px solid #F0C090;
                        border-radius: 100px;
                        padding: 4px 14px;
                        font-family: 'Courier New', Courier, monospace;
                        font-size: 9px; color: #B45309;
                        text-transform: uppercase; letter-spacing: 1.6px;
                      ">Expires in 5 minutes</span>
                    </div>
                  </div>
                </td>
              </tr>
            </table>

            <!-- OTP instruction -->
            <p class="text-muted" style="
              font-size: 12px; font-weight: 300;
              color: #8A7A70; line-height: 1.6;
              margin: 0 0 32px 0; text-align: center;
            ">Go to <a href="https://jigyazaai.com/verify" style="color: #C8621A; text-decoration: none;">jigyazaai.com/verify</a> and enter the 6 digits above.</p>


            <!-- ══ DIVIDER ══ -->
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
              <tr><td class="divider-line" style="border-top: 1px solid #E8E2D8;"></td></tr>
            </table>

            <!-- Manual link fallback -->
            <p style="
              font-family: 'Courier New', Courier, monospace;
              font-size: 9px; color: #B45309;
              text-transform: uppercase; letter-spacing: 1.8px;
              margin: 0 0 6px 0;
            ">Magic link not working?</p>
            <p class="text-muted" style="
              font-size: 12px; font-weight: 300;
              color: #8A7A70; line-height: 1.5;
              margin: 0 0 6px 0;
            ">Copy and paste this URL into your browser:</p>
            <p style="
              font-family: 'Courier New', Courier, monospace;
              font-size: 10px; color: #C8621A;
              word-break: break-all; line-height: 1.6;
              margin: 0 0 32px 0;
            ">${verificationUrl}</p>


            <!-- ══ SECURITY NOTE ══ -->
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td class="security-bg" style="
                  background-color: #F5F0E8;
                  border: 1px solid #E8E2D8;
                  border-left: 3px solid #C8621A;
                  border-radius: 0 6px 6px 0;
                  padding: 14px 18px;
                ">
                  <p style="
                    font-family: 'Courier New', Courier, monospace;
                    font-size: 9px; color: #B45309;
                    text-transform: uppercase; letter-spacing: 1.6px;
                    margin: 0 0 5px 0;
                  ">Didn't sign up?</p>
                  <p class="security-text" style="
                    font-size: 12px; font-weight: 300;
                    color: #8A7A70; line-height: 1.6; margin: 0;
                  ">Ignore this email. Your address won't be used and no account will be created.</p>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- ══ DARK FOOTER ══ -->
        <tr>
          <td class="footer-bg" style="
            background-color: #0A0806;
            padding: 22px 40px;
            border-radius: 0 0 11px 11px;
          ">
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td>
                  <p class="footer-text" style="
                    font-family: 'Courier New', Courier, monospace;
                    font-size: 9px; color: #3A3430;
                    text-transform: uppercase; letter-spacing: 1.8px;
                    margin: 0 0 8px 0;
                  ">jigyazaAi Inc.</p>
                  <p style="
                    font-size: 11px; font-weight: 300;
                    color: #4A4440; line-height: 1.65; margin: 0;
                  ">
                    Sent to <a href="mailto:${email}" style="color: #C8621A; text-decoration: none;">${email}</a>
                    because you created a jigyazaAi account.
                    <br />
                    <a class="footer-link" href="https://jigyazaai.com/unsubscribe" style="color: #4A4440; text-decoration: underline;">Unsubscribe</a>
                    &nbsp;&middot;&nbsp;
                    <a class="footer-link" href="https://jigyazaai.com/privacy" style="color: #4A4440; text-decoration: underline;">Privacy</a>
                    &nbsp;&middot;&nbsp;
                    <a class="footer-link" href="https://jigyazaai.com/terms" style="color: #4A4440; text-decoration: underline;">Terms</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
      <!-- end card -->

      <!-- Below card -->
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width: 520px;">
        <tr>
          <td style="padding-top: 18px; text-align: center;">
            <p style="
              font-family: 'Courier New', Courier, monospace;
              font-size: 9px; color: #C8B8A8;
              text-transform: uppercase; letter-spacing: 1.6px; margin: 0;
            ">Link expires in 24h &middot; Code expires in 5 min &middot; &copy; 2026 jigyazaAi</p>
          </td>
        </tr>
      </table>

    </td>
  </tr>
</table>
</body>
</html>
  `.trim(),
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
    err.statusCode = err.statusCode || 500;
    err.message =
      err.message || "Something went wrong while registering the user.";
    return next(err);
  }
}

export async function authLoginController(req, res, next) {
  try {
    const { email, username, password } = req.body;

    if (!password || (!email && !username)) {
      const err = new Error("Email or username and password are required.");
      err.statusCode = 400;
      return next(err);
    }

    const user = await userModel.findOne({
      $or: [{ email }, { username }],
    });

    if (!user) {
      const err = new Error("No user found with provided credentials.");
      err.statusCode = 404;
      return next(err);
    }

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      const err = new Error("Wrong Password Entered...");
      err.statusCode = 401;
      return next(err);
    }

    if (!user.verified) {
      const err = new Error("Please verify your email before logging in.");
      err.statusCode = 403;
      return next(err);
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
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Something went wrong while logging in.";
    return next(err);
  }
}

export async function authVerifyController(req, res, next) {
  try {
    const { token } = req.query;

    if (!token) {
      const err = new Error("Verification token is required.");
      err.statusCode = 400;
      return next(err);
    }

    const decoded = jsonwebtoken.verify(
      token,
      process.env.JWT_SECRET || "default_secret",
    );

    const user = await userModel.findById(decoded.id);

    if (!user) {
      const err = new Error("User not found.");
      err.statusCode = 404;
      return next(err);
    }

    if (user.verified) {
      return res.status(200).json({ message: "Email is already verified.", success: true });
    }

    user.verified = true;
    await user.save();

    return res.status(200).json({ message: "Email successfully verified.", success: true });
  } catch (err) {
    console.error(err);
    err.statusCode = err.statusCode || 400;
    err.message = err.message || "Verification failed.";
    return next(err);
  }
}

export async function authGetMeController(req, res, next) {
  try {
    const user = await userModel.findById(req.user.id).select("-password");
    if (!user) {
      const err = new Error("User not found.");
      err.statusCode = 404;
      return next(err);
    }
    return res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    err.statusCode = err.statusCode || 500;
    err.message =
      err.message || "Something went wrong while fetching user data.";
    return next(err);
  }
}

export async function authVerifyOtpController(req, res, next) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      const err = new Error("Email and OTP are required.");
      err.statusCode = 400;
      return next(err);
    }

    const storedOtp = await redis.get(`otp:${email}`);
    if (!storedOtp) {
      const err = new Error(
        "OTP expired or not found. Please request a new one.",
      );
      err.statusCode = 400;
      return next(err);
    }

    if (storedOtp != otp) {
      const err = new Error("Invalid OTP. Please try again.");
      err.statusCode = 401;
      return next(err);
    }

    // OTP is valid, mark user as verified
    const user = await userModel.findOne({ email });
    if (!user) {
      const err = new Error("User not found.");
      err.statusCode = 404;
      return next(err);
    }

    user.verified = true;
    await user.save();
    await redis.del(`otp:${email}`);

    return res.status(200).json({ message: "Email verified successfully." });
  } catch (err) {
    console.error(err);
    err.statusCode = err.statusCode || 500;
    err.message =
      err.message || "Something went wrong during OTP verification.";
    return next(err);
  }
}

export async function authLogoutController(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      const err = new Error("No active session found.");
      err.statusCode = 400;
      return next(err);
    }
    redis.set(`blacklist:${token}`, "true", "EX", 24 * 60 * 60 * 7); // blacklist token for 7 days

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    return res.status(200).json({ message: "Logout successful." });
  } catch (err) {
    console.error(err);
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Something went wrong while logging out.";
    return next(err);
  }
}

export async function authResendOtpController(req, res, next) {
  try {
    // ── 1. Validate body ───────────────────────────────────────────────────
    if (!req.body) {
      const err = new Error("Request body is missing.");
      err.statusCode = 400;
      return next(err);
    }

    const { email } = req.body;

    if (!email) {
      const err = new Error("Email is required.");
      err.statusCode = 400;
      return next(err);
    }
    // ── 2. Find user ───────────────────────────────────────────────────────
    const user = await userModel.findOne({ email });
    if (!user) {
      const err = new Error("No account found with this email address.");
      err.statusCode = 404;
      return next(err);
    }

    if (user.verified) {
      const err = new Error("This email is already verified. You can sign in.");
      err.statusCode = 400;
      return next(err);
    }

    // ── 3. Rate limiting — max 3 resends per 10 minutes ───────────────────
    const rateLimitKey = `otp_resend_limit:${email}`;
    const resendCount = await redis.get(rateLimitKey);

    if (resendCount && parseInt(resendCount) >= 3) {
      const err = new Error(
        "Too many OTP requests. Please wait 10 minutes before trying again.",
      );
      err.statusCode = 429;
      return next(err);
    }

    // Increment resend counter — expires in 10 minutes
    if (resendCount) {
      await redis.incr(rateLimitKey);
    } else {
      await redis.setex(rateLimitKey, 600, "1");
    }

    // ── 4. Delete old OTP and generate new one ─────────────────────────────
    await redis.del(`otp:${email}`);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await redis.setex(`otp:${email}`, 300, otp); // 5 min expiry

    // ── 5. Send branded email ──────────────────────────────────────────────
    await sendEmail({
      to: email,
      subject: "New verification code — jigyazaAi",

      // ── PLAIN TEXT FALLBACK ──────────────────────────────────────────────
      text: `
jigyazaAi — Research Engine

Hey ${user.username || "there"},

You requested a new verification code. Here it is:

  ${otp.split("").join("  ")}

This code expires in 5 minutes.

If you didn't request this, you can safely ignore this email.
Your account will not be affected.

— The jigyazaAi Team
hello@jigyazaai.com
      `.trim(),

      // ── HTML EMAIL ───────────────────────────────────────────────────────
      html: `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="color-scheme" content="light dark" />
  <meta name="supported-color-schemes" content="light dark" />
  <title>New verification code — jigyazaAi</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; }

    @media (prefers-color-scheme: dark) {
      .email-body    { background-color: #070709 !important; }
      .email-card    { background-color: #0F0D0B !important; border-color: #1E1B18 !important; }
      .card-body     { background-color: #0F0D0B !important; }
      .text-headline { color: #F0EBE3 !important; }
      .text-body     { color: #7A7068 !important; }
      .divider-line  { border-color: #1E1B18 !important; }
      .otp-wrapper   { background-color: #1C1916 !important; border-color: #2A2520 !important; }
      .otp-cell      { background-color: #141210 !important; border-color: #3D3630 !important; }
      .otp-digit     { color: #C8621A !important; }
      .otp-label     { color: #4A4440 !important; }
      .expiry-badge  { background-color: #1C1510 !important; border-color: #2A1E14 !important; color: #C8621A !important; }
      .warning-box   { background-color: #1A0E0A !important; border-color: #3D1A0A !important; }
      .warning-text  { color: #7A5040 !important; }
      .footer-bg     { background-color: #070709 !important; }
      .footer-text   { color: #3A3430 !important; }
      .footer-link   { color: #4A4440 !important; }
      .security-bg   { background-color: #0A0806 !important; border-color: #1E1B18 !important; }
      .security-text { color: #4A4440 !important; }
    }
  </style>
</head>

<body class="email-body" style="
  background-color: #F0EDE8;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  margin: 0; padding: 0; width: 100%;
">

<!-- Preheader -->
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
  ${user.username || "Hey"}, your new jigyazaAi code is ${otp} — expires in 5 minutes.&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌
</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F0EDE8;">
  <tr>
    <td align="center" style="padding: 40px 16px;">

      <table class="email-card" role="presentation" width="100%" cellpadding="0" cellspacing="0" style="
        background-color: #FFFFFF;
        border: 1px solid #E8E2D8;
        border-radius: 12px;
        max-width: 520px;
        overflow: hidden;
      ">

        <!-- ══ DARK HEADER ══ -->
        <tr>
          <td style="background-color: #0A0806; padding: 24px 40px; border-radius: 11px 11px 0 0;">
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="vertical-align: middle;">
                  <table role="presentation" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding-right: 10px; vertical-align: middle;">
                        <svg width="30" height="30" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="48" cy="48" r="43" stroke="#C8621A" stroke-width="5" fill="none"/>
                          <circle cx="48" cy="48" r="26" stroke="#C8621A" stroke-width="2.5" fill="none" stroke-dasharray="8 10" stroke-opacity="0.4"/>
                          <line x1="48" y1="4"  x2="48" y2="15" stroke="#C8621A" stroke-width="5" stroke-linecap="round"/>
                          <line x1="92" y1="48" x2="81" y2="48" stroke="#C8621A" stroke-width="5" stroke-linecap="round"/>
                          <line x1="48" y1="92" x2="48" y2="81" stroke="#C8621A" stroke-width="5" stroke-linecap="round"/>
                          <line x1="4"  y1="48" x2="15" y2="48" stroke="#C8621A" stroke-width="5" stroke-linecap="round"/>
                          <circle cx="48" cy="18" r="6" fill="#C8621A"/>
                          <line x1="67" y1="67" x2="82" y2="82" stroke="#C8621A" stroke-width="6" stroke-linecap="round"/>
                          <circle cx="85" cy="85" r="5" fill="#C8621A"/>
                          <circle cx="48" cy="48" r="13" fill="#1C1510"/>
                          <circle cx="48" cy="48" r="8"  fill="#C8621A"/>
                        </svg>
                      </td>
                      <td style="vertical-align: middle;">
                        <span style="
                          font-family: Georgia, 'Times New Roman', serif;
                          font-style: italic; font-size: 19px;
                          color: #F0EBE3; letter-spacing: -0.3px;
                        ">jigyaza<span style="color:#C8621A;">Ai</span></span>
                      </td>
                      <td align="right" style="vertical-align: middle;">
                        <span style="
                          font-family: 'Courier New', Courier, monospace;
                          font-size: 8px; color: #C8621A;
                          text-transform: uppercase; letter-spacing: 1.6px;
                        ">Research Engine</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Amber accent line -->
        <tr><td style="height: 3px; background-color: #C8621A;"></td></tr>

        <!-- ══ BODY ══ -->
        <tr>
          <td class="card-body" style="padding: 44px 40px 36px;">

            <!-- Eyebrow -->
            <p style="
              font-family: 'Courier New', Courier, monospace;
              font-size: 9px; color: #B45309;
              text-transform: uppercase; letter-spacing: 2px;
              margin: 0 0 14px 0;
            ">New Verification Code</p>

            <!-- Headline -->
            <h1 class="text-headline" style="
              font-family: Georgia, 'Times New Roman', serif;
              font-style: italic; font-size: 28px; font-weight: 400;
              color: #1A1714; line-height: 1.1;
              letter-spacing: -0.4px; margin: 0 0 16px 0;
            ">Here's your<br />new code.</h1>

            <!-- Body copy -->
            <p class="text-body" style="
              font-size: 14px; font-weight: 300;
              color: #6A6460; line-height: 1.7;
              margin: 0 0 32px 0;
            ">
              You requested a new verification code for your jigyazaAi account.
              Enter it on the verification page to confirm your email address.
            </p>

            <!-- ══ OTP BOX ══ -->
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 14px;">
              <tr>
                <td>
                  <div class="otp-wrapper" style="
                    background-color: #F5F0E8;
                    border: 1px solid #E0D8CC;
                    border-radius: 10px;
                    padding: 28px 20px;
                    text-align: center;
                  ">
                    <!-- OTP label -->
                    <p class="otp-label" style="
                      font-family: 'Courier New', Courier, monospace;
                      font-size: 9px; color: #8A7A70;
                      text-transform: uppercase; letter-spacing: 2px;
                      margin: 0 0 18px 0;
                    ">Your new verification code</p>

                    <!-- OTP digits -->
                    <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto 20px;">
                      <tr>
                        ${otp
                          .split("")
                          .map(
                            (digit) => `
                        <td style="padding: 0 4px;">
                          <div class="otp-cell" style="
                            background-color: #FFFFFF;
                            border: 1.5px solid #E8E2D8;
                            border-radius: 6px;
                            width: 44px; height: 52px;
                            text-align: center;
                            line-height: 52px;
                            font-family: 'Courier New', Courier, monospace;
                            font-size: 26px; font-weight: 700;
                            color: #C8621A;
                          ">${digit}</div>
                        </td>`,
                          )
                          .join("")}
                      </tr>
                    </table>

                    <!-- Expiry badge -->
                    <span class="expiry-badge" style="
                      display: inline-block;
                      background-color: #FFF0E0;
                      border: 1px solid #F0C090;
                      border-radius: 100px;
                      padding: 4px 14px;
                      font-family: 'Courier New', Courier, monospace;
                      font-size: 9px; color: #B45309;
                      text-transform: uppercase; letter-spacing: 1.6px;
                    ">Expires in 5 minutes</span>
                  </div>
                </td>
              </tr>
            </table>

            <!-- Verify link -->
            <p style="
              font-size: 12px; font-weight: 300;
              color: #8A7A70; line-height: 1.6;
              margin: 0 0 32px 0; text-align: center;
            ">
              Enter this code at
              <a href="https://jigyazaai.com/verify" style="color: #C8621A; text-decoration: none; font-weight: 500;">
                jigyazaai.com/verify
              </a>
            </p>

            <!-- ══ DIVIDER ══ -->
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
              <tr><td class="divider-line" style="border-top: 1px solid #E8E2D8;"></td></tr>
            </table>

            <!-- ══ RATE LIMIT WARNING ══ -->
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
              <tr>
                <td class="warning-box" style="
                  background-color: #FFF8F0;
                  border: 1px solid #F0D0A0;
                  border-left: 3px solid #C8621A;
                  border-radius: 0 6px 6px 0;
                  padding: 14px 18px;
                ">
                  <p style="
                    font-family: 'Courier New', Courier, monospace;
                    font-size: 9px; color: #B45309;
                    text-transform: uppercase; letter-spacing: 1.6px;
                    margin: 0 0 5px 0;
                  ">Heads up</p>
                  <p class="warning-text" style="
                    font-size: 12px; font-weight: 300;
                    color: #8A6040; line-height: 1.6; margin: 0;
                  ">
                    For security, you can request a maximum of 3 codes every 10 minutes.
                    This code replaces any previous code — old codes are now invalid.
                  </p>
                </td>
              </tr>
            </table>

            <!-- ══ SECURITY NOTE ══ -->
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td class="security-bg" style="
                  background-color: #F5F0E8;
                  border: 1px solid #E8E2D8;
                  border-left: 3px solid #C8621A;
                  border-radius: 0 6px 6px 0;
                  padding: 14px 18px;
                ">
                  <p style="
                    font-family: 'Courier New', Courier, monospace;
                    font-size: 9px; color: #B45309;
                    text-transform: uppercase; letter-spacing: 1.6px;
                    margin: 0 0 5px 0;
                  ">Didn't request this?</p>
                  <p class="security-text" style="
                    font-size: 12px; font-weight: 300;
                    color: #8A7A70; line-height: 1.6; margin: 0;
                  ">
                    Ignore this email. Your account is safe and nothing will change.
                    If you're concerned, contact us at
                    <a href="mailto:security@jigyazaai.com" style="color: #C8621A; text-decoration: none;">
                      security@jigyazaai.com
                    </a>
                  </p>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- ══ DARK FOOTER ══ -->
        <tr>
          <td class="footer-bg" style="
            background-color: #0A0806;
            padding: 22px 40px;
            border-radius: 0 0 11px 11px;
          ">
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td>
                  <p class="footer-text" style="
                    font-family: 'Courier New', Courier, monospace;
                    font-size: 9px; color: #3A3430;
                    text-transform: uppercase; letter-spacing: 1.8px;
                    margin: 0 0 8px 0;
                  ">jigyazaAi Inc.</p>
                  <p style="
                    font-size: 11px; font-weight: 300;
                    color: #4A4440; line-height: 1.65; margin: 0;
                  ">
                    Sent to
                    <a href="mailto:${email}" style="color: #C8621A; text-decoration: none;">${email}</a>
                    because a new code was requested for this account.
                    <br />
                    <a class="footer-link" href="https://jigyazaai.com/privacy" style="color: #4A4440; text-decoration: underline;">Privacy</a>
                    &nbsp;&middot;&nbsp;
                    <a class="footer-link" href="https://jigyazaai.com/terms" style="color: #4A4440; text-decoration: underline;">Terms</a>
                    &nbsp;&middot;&nbsp;
                    <a class="footer-link" href="mailto:security@jigyazaai.com" style="color: #4A4440; text-decoration: underline;">Security</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
      <!-- end card -->

      <!-- Below card -->
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width: 520px;">
        <tr>
          <td style="padding-top: 18px; text-align: center;">
            <p style="
              font-family: 'Courier New', Courier, monospace;
              font-size: 9px; color: #C8B8A8;
              text-transform: uppercase; letter-spacing: 1.6px; margin: 0;
            ">Code expires in 5 min &middot; Max 3 requests per 10 min &middot; &copy; 2026 jigyazaAi</p>
          </td>
        </tr>
      </table>

    </td>
  </tr>
</table>
</body>
</html>
      `.trim(),
    });

    return res.status(200).json({
      message: "New verification code sent to your email.",
      expiresIn: 300, // seconds
    });
  } catch (err) {
    console.error("Resend OTP error:", err);
    err.statusCode = err.statusCode || 500;
    err.message =
      err.message || "Something went wrong while resending the code.";
    return next(err);
  }
}

export async function authForgetPasswordController(req, res, next) {
  try {
    const { email } = req.body;

    if (!email) {
      const err = new Error("Email is required.");
      err.statusCode = 400;
      return next(err);
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      const err = new Error("No account found with this email address.");
      err.statusCode = 404;
      return next(err);
    }

    if (user.verified === false) {
      const err = new Error(
        "Email not verified. Please verify your email before resetting password.",
      );
      err.statusCode = 403;
      return next(err);
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await redis.setex(`otp:reset:${email}`, 300, otp); // 5 min expiry

    const resetUrl = `http://localhost:5173/forgot-password?email=${encodeURIComponent(email)}&otp=${otp}`;

    await sendEmail({
      to: email,
      subject: "Password Reset Code — jigyazaAi",
      text: `jigyazaAi — Research Engine

Hey ${user.username || "there"},

You requested a password reset. Use the code below to reset your password:

  ${otp.split("").join("  ")}

Or click this link to reset your password:

  ${resetUrl}

This code expires in 5 minutes.

If you didn't request this, you can safely ignore this email.
Your account will not be affected.

— The jigyazaAi <Team>  </Team>

      `.trim(),
      html: `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="color-scheme" content="light dark" />
  <meta name="supported-color-schemes" content="light dark" />
  <title>Password Reset Code — jigyazaAi</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; }

    @media (prefers-color-scheme: dark) {
      .email-body    { background-color: #070709 !important; }
      .email-card    { background-color: #0F0D0B !important; border-color: #1E1B18 !important; }
      .card-body     { background-color: #0F0D0B !important; }
      .text-headline { color: #F0EBE3 !important; }
      .text-body     { color: #7A7068 !important; }
      .divider-line  { border-color: #1E1B18 !important; }
      .otp-wrapper   { background-color: #1C1916 !important; border-color: #2A2520 !important; }
      .otp-cell      { background-color: #141210 !important; border-color: #3D3630 !important; }
      .otp-digit     { color: #C8621A !important; }
      .otp-label     { color: #4A4440 !important; }
      .expiry-badge  { background-color: #1C1510 !important; border-color: #2A1E14 !important; color: #C8621A !important; }
      .warning-box   { background-color: #1A0E0A !important; border-color: #3D1A0A !important; }
      .warning-text  { color: #7A5040 !important; }
      .footer-bg     { background-color: #070709 !important; }
      .footer-text   { color: #3A3430 !important; }
      .footer-link   { color: #4A4440 !important; }
      .security-bg   { background-color: #0A0806 !important; border-color: #1E1B18 !important; }
      .security-text { color: #4A4440 !important; }
    }
  </style>
</head>

<body class="email-body" style="
  background-color: #F0EDE8;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  margin: 0; padding: 0; width: 100%;
">

<!-- Preheader -->
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
  ${user.username || "Hey"}, your password reset code for jigyazaAi is ${otp} — expires in 5 minutes.&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌
</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F0EDE8;">
  <tr>
    <td align="center" style="padding: 40px 16px;">

      <table class="email-card" role="presentation" width="100%" cellpadding="0" cellspacing="0" style="
        background-color: #FFFFFF;
        border: 1px solid #E8E2D8;
        border-radius: 12px;
        max-width: 520px;
        overflow: hidden;
      ">

        <!-- ══ DARK HEADER ══ -->
        <tr>
          <td style="background-color: #0A0806; padding: 24px 40px; border-radius: 11px 11px 0 0;">
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="vertical-align: middle;">
                  <table role="presentation" cellpadding="0" cellspacing="0"> 
                    <tr>
                      <td style="padding-right: 10px; vertical-align: middle;">
                        <svg width="30" height="30" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="48" cy="48" r="43" stroke="#C8621A" stroke-width="5" fill="none"/>
                          <circle cx="48" cy="48" r="26" stroke="#C8621A" stroke-width="2.5" fill="none" stroke-dasharray="8 10" stroke-opacity="0.4"/>
                          <line x1="48" y1="4"  x2="48" y2="15" stroke="#C8621A" stroke-width="5" stroke-linecap="round"/>
                          <line x1="92" y1="48" x2="81" y2="48" stroke="#C8621A" stroke-width="5" stroke-linecap="round"/>
                          <line x1="48" y1="92" x2="48" y2="81" stroke="#C8621A" stroke-width="5" stroke-linecap="round"/>
                          <line x1="4"  y1="48" x2="15" y2="48" stroke="#C8621A" stroke-width="5" stroke-linecap="round"/>
                          <circle cx="48" cy="18" r="6" fill="#C8621A"/>
                          <line x1="67" y1="67" x2="82" y2="82" stroke="#C8621A" stroke-width="6" stroke-linecap="round"/>
                          <circle cx="85" cy="85" r="5" fill="#C8621A"/>
                          <circle cx="48" cy="48" r="13" fill="#1C1510"/>
                          <circle cx="48" cy="48" r="8"  fill="#C8621A"/>
                        </svg>
                      </td>
                      <td style="vertical-align: middle;">
                        <span style="
                          font-family: Georgia, 'Times New Roman', serif;
                          font-style: italic; font-size: 19px;
                          color: #F0EBE3; letter-spacing: -0.3px;
                        ">jigyaza<span style="color:#C8621A;">Ai</span></span>
                      </td>
                      <td align="right" style="vertical-align: middle;">
                        <span style="
                          font-family: 'Courier New', Courier, monospace;
                          font-size: 8px; color: #C8621A;
                          text-transform: uppercase; letter-spacing: 1.6px;
                        ">Research Engine</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Amber accent line -->
        <tr><td style="height: 3px; background-color: #C8621A;"></td></tr>

        <!-- ══ BODY ══ -->
        <tr>
          <td class="card-body" style="padding: 44px 40px 36px;">

            <!-- Eyebrow -->
            <p style="
              font-family: 'Courier New', Courier, monospace;
              font-size: 9px; color: #B45309;
              text-transform: uppercase; letter-spacing: 2px;
              margin: 0 0 14px 0;
            ">Password Reset Request</p>

            <!-- Headline -->
            <h1 class="text-headline" style="
              font-family: Georgia, 'Times New Roman', serif;
              font-style: italic; font-size: 28px; font-weight: 400;
              color: #1A1714; line-height: 1.1;
              letter-spacing: -0.4px; margin: 0 0 16px 0;
            ">Here's your password reset code.</h1>

            <!-- Body copy -->
            <p class="text-body" style="
              font-size: 14px; font-weight: 300;
              color: #6A6460; line-height: 1.7;
              margin: 0 0 32px 0;
            ">
              You requested to reset your password for your jigyazaAi account.
              Use the code below to set a new password for your account.
            </p>

            <!-- ══ OTP BOX ══ -->
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 14px;">
              <tr>
                <td>
                  <div class="otp-wrapper" style="
                    background-color: #F5F0E8;
                    border: 1px solid #E0D8CC;
                    border-radius: 10px;
                    padding: 28px 20px;
                    text-align: center;
                  ">
                    <p style="
                      font-family: 'Courier New', Courier, monospace;
                      font-size: 11px; color: #4A4440;
                      text-transform: uppercase; letter-spacing: 2.5px;
                      margin: 0 0 16px 0;
                    ">Your password reset code</p>
                    
                    <div style="
                      display: inline-block;
                      background-color: #E8E2D8;
                      border: 1px solid #D8D0C4;
                      border-radius: 8px;
                      padding: 12px 24px;
                    ">
                      <span class="otp-digit" style="
                        font-family: 'Courier New', Courier, monospace;
                        font-size: 32px; font-weight: 700;
                        color: #C8621A; letter-spacing: 12px;
                        margin-right: -12px;
                      ">${otp}</span>
                    </div>

                    <div style="margin-top: 24px;">
                      <a href="${resetUrl}" style="
                        display: inline-block;
                        background-color: #C8621A;
                        color: #FFFFFF;
                        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                        font-size: 14px;
                        font-weight: 500;
                        letter-spacing: 0.5px;
                        text-decoration: none;
                        padding: 14px 28px;
                        border-radius: 6px;
                      ">Reset via link</a>
                    </div>
                  </div>
                </td>
              </tr>
            </table>

            <!-- Expiry Warning -->
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="padding-top: 8px;">
                  <div class="expiry-badge" style="
                    display: inline-block;
                    background-color: #F8F4EE;
                    border: 1px solid #EAE3D8;
                    border-radius: 100px;
                    padding: 6px 14px;
                  ">
                    <span style="
                      font-size: 12px; color: #C8621A; font-weight: 500;
                    ">⏱️ Expires in 5 minutes</span>
                  </div>
                </td>
              </tr>
            </table>

          </td>
        </tr>
      </table>

      <!-- Footer -->
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width: 520px; margin-top: 24px;">
        <tr>
          <td align="center" style="
            font-size: 12px; color: #8A8078; font-weight: 300; line-height: 1.6;
          ">
            <p style="margin: 0 0 8px 0;">If you didn't request a password reset, you can safely ignore this email.</p>
            <p style="margin: 0;">&copy; ${new Date().getFullYear()} jigyazaAi. All rights reserved.</p>
          </td>
        </tr>
      </table>

    </td>
  </tr>
</table>

</body>
</html>
      `,
    });

    return res.status(200).json({
      message: "Password reset OTP sent to your email successfully.",
      email,
    });
  } catch (err) {
    console.error(err);
    err.statusCode = err.statusCode || 500;
    err.message =
      err.message || "Something went wrong while sending reset code.";
    return next(err);
  }
}

export async function authResetPasswordController(req, res, next) {
  try {
    const { email, otp, password } = req.body;

    if (!email || !otp || !password) {
      const err = new Error("Email, OTP and new password are required.");
      err.statusCode = 400;
      return next(err);
    }

    const storedOtp = await redis.get(`otp:reset:${email}`);
    if (!storedOtp || storedOtp != otp) {
      const err = new Error("Invalid or expired OTP.");
      err.statusCode = 400;
      return next(err);
    }
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      const err = new Error("No account found with this email address.");
      err.statusCode = 404;
      return next(err);
    }


    if(user.verified === false) {
      const err = new Error(
        "Email not verified. Please verify your email before resetting password.",
      );
      err.statusCode = 403;
      return next(err);
    }

    const isSamePassword = await bcrypt.compare(password, user.password);
    if (isSamePassword) {
      const err = new Error("New password cannot be the same as the old password.");
      err.statusCode = 400;
      return next(err);
    }

    user.password = password;
    await user.save();
    
    await redis.del(`otp:reset:${email}`);

    return res.status(200).json({
      message:
        "Password reset successfully. You can now log in with your new password.",
    });
  } catch (err) {
    console.error(err);
    err.statusCode = err.statusCode || 500;
    err.message =
      err.message || "Something went wrong while resetting password.";
    return next(err);
  }
}

export async function authCheckAutoVerifyController(req, res, next) {
  try {
    const { email } = req.body;

    if (!email) {
      const err = new Error("Email is required.");
      err.statusCode = 400;
      return next(err);
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      const err = new Error("No account found with this email address.");
      err.statusCode = 404;
      return next(err);
    }

    if (!user.verified) {
      return res.status(403).json({
        message: "Email is not verified.",
        email,
      });
    }

    return res.status(200).json({
      message: "Email is already verified.",
      email,
    });
  } catch (err) {
    console.error(err);
    err.statusCode = err.statusCode || 500;
    err.message =
      err.message || "Something went wrong while checking verification status.";
    return next(err);
  }
}


    