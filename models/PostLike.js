import mongoose from "mongoose";

const LikeSchema = new mongoose.Schema(
{
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
        type: mongoose.Types.ObjectId,
        ref: "Post",
        required: true,
    },
},
{ 
    timestamps: true 
});

export default mongoose.model('Like', LikeSchema);