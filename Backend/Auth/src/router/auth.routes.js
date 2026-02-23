const express = require("express");
const userModel = require("../models/user.model");
const authRouter = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");


authRouter.post("/register", async (req, res) => {
  const { email, password, name } = req.body;

  const isUserAlreadyExist = await userModel.findOne({ email });

  if (isUserAlreadyExist) {
    return res.status(409).json({
      message: "user already exists...",
    });
  }

  const hash = crypto.createHash("md5").update(password).digest("hex");

  const user = await userModel.create({
    email: email,
    password: hash,
    name: name,
  });

  const token = await jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );

  res.cookie("token", token);

  res.status(201).json({
    message: "new user has been created successfully...",
    token,
  });
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(409).json({
      message: "user does not exist register first....",
    });
  }

  const matched =
    user.password == crypto.createHash("md5").update(password).digest("hex");
  if (!matched) {
    return res.status(409).json({
      message: "Incorrect password....",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
  );

  res.cookie("token", token);

  res.status(200).json({
    message: "user login successfull...",
  });
});

authRouter.get("/get-me", async (req, res) => {
  const token = await req.cookies.token;

    const decoded = jwt.verify(token , process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);


  res.status(200).json({
    user
  });
});

module.exports = authRouter;
