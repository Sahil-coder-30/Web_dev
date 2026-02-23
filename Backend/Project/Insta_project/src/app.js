const express = require("express");
const app = express();
app.use(express.json());
const authRouter = require("./routes/auth.routes");
const postRouter = require("./routes/post.routes");
const CookieParser = require("cookie-parser");
app.use(CookieParser());

app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);

module.exports = app;
