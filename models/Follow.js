import mongoose from "mongoose";

const FollowSchema = new mongoose.Schema(
{
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
      },
      following: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
      },
},
{ 
    timestamps: true 
});

export default mongoose.model('Follow', FollowSchema);