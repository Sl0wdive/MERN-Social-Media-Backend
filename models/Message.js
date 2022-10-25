import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
    {
        chat: {
            type: mongoose.Types.ObjectId,
            ref: "Chat",
            required: true,
        },
        sender: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
    },
    { 
        timestamps: true 
    }
);
  
 
export default mongoose.model('Message', MessageSchema);