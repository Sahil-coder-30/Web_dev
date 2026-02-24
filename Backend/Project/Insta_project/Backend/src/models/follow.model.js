const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
    follower : {
       type : String
    },
    followee : {
        type : String
    },
    status : {
        type : String,
        default : "Pending",
        enum : {
            values : ["Accepted" , "Pending" , "Rejected" ],
            message : "the value of status can only be Accepted , Pending or Rejected..."
        }
    }
},{
    timestamps : true
})

followSchema.index({follower : 1 , followee : 1} , {unique : true})

const followModel = mongoose.model("follow" , followSchema);

module.exports = followModel;