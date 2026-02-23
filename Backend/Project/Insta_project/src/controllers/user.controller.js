const followModel = require("../models/follow.model");
const userModel = require("../models/user.model");

async function followUserController(req, res) {
  const followerUsername = req.user.username;
  const followeeUsername = req.params.username;

  const isfolloweeExists = await userModel.findOne({
    username: followeeUsername,
  });

  if (!isfolloweeExists) {
    return res.status(400).json({
      message: "you are trying to follow the user does not exists..",
    });
  }

  if (followeeUsername == followerUsername) {
    return res.status(400).json({
      message: "you cannot follow yourself...",
    });
  }

  const isAlreadyFollowed = await followModel.findOne({
    follower: followerUsername,
    followee: followeeUsername,
  });

  if (isAlreadyFollowed) {
    return res.status(200).json({
      message: `you already follow ${followeeUsername}`,
    });
  }

  const followRecord = await followModel.create({
    follower: followerUsername,
    followee: followeeUsername,
  });

  res.status(201).json({
    message: `you are now following ${followeeUsername}`,
    followRecord,
  });
}

async function unfollowUserController(req, res) {
    const followerUsername = req.user.username;
    const followeeUsername = req.params.username;

    const isAlreadyFollowed = await followModel.findOne({
        follower : followerUsername,
        followee : followeeUsername,
    })

    if(!isAlreadyFollowed){
        return res.status(400).json({
            message : `you have not followed the ${followeeUsername}`
        })
    }

    await followModel.findByIdAndDelete(isAlreadyFollowed._id);

    return res.status(200).json({
        message:`Unfollowed ${followeeUsername} successfully...`
    })
}

module.exports = {
  followUserController,
  unfollowUserController
};
