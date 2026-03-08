const express = require("express");
const CookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");

/** Middelware used.. */

app.use(express.json());
app.use(CookieParser());
app.use(cors({
    credentials: true,
    origin: "https://web-dev-lyft.vercel.app"
}))


/**routes required here... */

const authRouter = require("./routes/auth.routes");
const postRouter = require("./routes/post.routes");
const userRouter = require("./routes/user.routes");


/**Routes user here ... */

app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/users" , userRouter);

module.exports = app;
