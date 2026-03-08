const express = require("express");
const userModel = require("../models/user.model");
const authRouter = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATEKEY,
});

async function authRegisterController(req, res) {
  const { username, email, password, bio, fullName } = req.body;

  const isUserAlreadyExist = await userModel.findOne({
    $or: [{ email }, { username }],
  });
  if (isUserAlreadyExist) {
    return res.status(409).json({
      message:
        isUserAlreadyExist.email == email
          ? "user exist with this email already.."
          : "user exist with this username already...",
    });
  }

  // Upload image only if provided — otherwise Mongoose default kicks in
  let profileImage;
  if (req.file) {
    const file = await imagekit.files.upload({
      file: await toFile(Buffer.from(req.file.buffer), "file"),
      fileName: "ProfilePicture",
      folder: "cohort-2/insta-clone-project/profilePicture",
    });
    profileImage = file.url;
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    email,
    username : username.replace(/\s/g, ""),
    fullName,
    bio,
    password: hash,
    ...(profileImage && { profileImage }), // omit → Mongoose uses default image
  });

  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );
  res.cookie("token", token ,{
  httpOnly: true,
  secure: true,        // ✅ Must be true on Vercel (HTTPS)
  sameSite: "none",    // ✅ Must be "none" for cross-origin
});

  res.status(200).json({
    message: "user has been registered successfully...",
    user: {
      fullName: user.fullName,
      email: user.email,
      username: user.username,
      bio: user.bio,
      profileImage: user.profileImage,
    },
  });
}

async function authLoginController(req, res) {
  const { username, email, password } = req.body;

  const isUserExist = await userModel
    .findOne({
      $or: [{ username }, { email }],
    })
    .select("+password");

  if (!isUserExist) {
    return res.status(409).json({
      message: "user does not exist...",
    });
  }

  const isPasswordCorect = await bcrypt.compare(password, isUserExist.password);

  if (!isPasswordCorect) {
    return res.status(404).json({
      message: "incorrect password entered...",
    });
  }

  const token = jwt.sign(
    {
      id: isUserExist._id,
      username: isUserExist.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token , {
  httpOnly: true,
  secure: true,        // ✅ Must be true on Vercel (HTTPS)
  sameSite: "none",    // ✅ Must be "none" for cross-origin
});

  res.status(200).json({
    message: "user loged in successfully...",
  });
}

async function getMeController(req, res) {
  const username = req.user.username;
  const data = await userModel.findOne({ username });

  return res.status(200).json({
    username: data.username,
    fullName: data.fullName,
    Email: data.email,
    Bio: data.bio,
    profileImage: data.profileImage,
  });
}

module.exports = {
  authRegisterController,
  authLoginController,
  getMeController,
};
