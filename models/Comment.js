import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
{
    commenter: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    post: {
        type: mongoose.Types.ObjectId,
        ref: "Post",
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    edited: {
        type: Boolean,
        default: false,
    },
},
{ 
    timestamps: true 
});

export default mongoose.model('Comment', CommentSchema);