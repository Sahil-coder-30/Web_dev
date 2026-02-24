const followModel = require('../models/follow.model');
const userModel = require("../models/user.model");

async function followAuth(req, res, next) {
  
  req.followerData = isAlreadyFollowed;
  next()
}

module.exports = followAuth;