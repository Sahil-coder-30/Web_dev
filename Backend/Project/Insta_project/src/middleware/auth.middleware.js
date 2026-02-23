const jwt = require('jsonwebtoken');

/**
 * iska kaam hai identify karna ki req kis user ne ki hai ...
 */
async function identifyUser(req, res , next) {
  const token = req.cookies.token;

  if (!token) {
    res.status(409).json({
      message: "token is not provided or expired unorthorized access ...",
    });
  }
  let decoded = null;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({
      message: "user not authorized...",
    });
  }
  
   req.user = decoded;
   next();

}

module.exports = identifyUser;
