const followModel = require("../models/follow.model");
const userModel = require("../models/user.model");

async function followRequestUserController(req, res) {
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

  if (!isAlreadyFollowed) {
    const followRecord = await followModel.create({
      follower: followerUsername,
      followee: followeeUsername,
    });
    return res.status(201).json({
      message : "follow requested is pending..."
    })
  }

  if (isAlreadyFollowed.status == "Accepted") {
    return res.status(200).json({
      message: `you already follow ${followeeUsername}`,
    });
  }

  if (isAlreadyFollowed.status == "Pending") {
    return res.status(200).json({
      message: `request already send to ${followeeUsername} is in pending state...`,
    });
  }

  return res.status(404).json({
    message : "something went wrong "
  })

}

async function followRequestAcceptController(req, res) {

  const followeeUsername = req.user.username;
  const followerUsername = req.params.username;

  const isFollowRequestAvailable = await followModel.findOne({
    followee : followeeUsername,
    follower : followerUsername,
    status : "Pending"
  })

  if(!isFollowRequestAvailable){
      return res.status(400).json({
        message : `No follow request exist from the user with username ${followerUsername}`
      })
  }

  const updatedStatus = await followModel.findOneAndUpdate(
    {_id : isFollowRequestAvailable._id},
    {$set : {status : "Accepted"}},
    {new : true}
  )

  return res.status(200).json({
    message : `successfully accepted the follow req from ${followerUsername}`,
    updatedStatus
  })

}

async function followRequestRejectController(req,res){
  const followeeUsername = req.user.username;
  const followerUsername = req.params.username;

  const isFollowRequestExist = await followModel.findOne({
    follower : followerUsername,
    followee : followeeUsername,
    status : "Pending"
  })

  if(!isFollowRequestExist){
    return res.status(404).json({
      message : "No such follow request found..."
    })
  }

  const followRequest = await followModel.findOneAndUpdate(
    {_id : isFollowRequestExist._id},
    {$set : {status : "Rejected"}},
    {new : true}
  )

  const deleteFollowRequest = await followModel.findOneAndDelete({
    _id : followRequest._id
  })

  return res.status(200).json({
    message : `Follow request from ${followerUsername} is Rejected...`,
    deleteFollowRequest
  })


}

async function unfollowUserController(req, res) {
  const followerUsername = req.user.username;
  const followeeUsername = req.params.username;

  const isAlreadyFollowed = await followModel.findOne({
    follower: followerUsername,
    followee: followeeUsername,
    status : "Accepted"
  });

  if (!isAlreadyFollowed) {
    return res.status(400).json({
      message: `you have not followed the ${followeeUsername}`,
    });
  }

  await followModel.findByIdAndDelete(isAlreadyFollowed._id);

  return res.status(200).json({
    message: `Unfollowed ${followeeUsername} successfully...`,
  });
}

async function getAllFollowRequest(req, res){
  const followeeUsername = req.user.username;

  const followRequestExist = await followModel.find({
    followee : followeeUsername,
    status : "Pending"
  })

  if(!followRequestExist){
    return res.status(404).json({
      message : "You have no follow request availabel..."
    })
  }

  return res.status(200).json({
    message : "All follow request you have...",
    followRequestExist
  })

}

module.exports = {
  followRequestUserController,
  unfollowUserController,
  followRequestAcceptController,
  followRequestRejectController,
  getAllFollowRequest
};
