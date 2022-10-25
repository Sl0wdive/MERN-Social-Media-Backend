import UserModel from '../models/User.js';
import MessageModel from '../models/Message.js';
import ChatModel from '../models/Chat.js';

export const sendMessage = async (req, res) => {
    try {
        const recipientId = req.params.id;
        const content = req.body.content;
        const userId = req.userId;

        const recipient = await UserModel.findById(recipientId);

        if (!recipient) {
            throw new Error("Recipient not found");
        }

        let chat = await ChatModel.findOne({
            recipients: {
            $all: [userId, recipientId],
        },
    });

    if (!chat) {
        chat = await ChatModel.create({
        recipients: [userId, recipientId],
    });
    }

    
    ChatModel.lastMessageAt = Date.now();

    const doc = new MessageModel({
        chat: chat._id,
        sender: userId,
        content,
      });
      
    ChatModel.lastMessageAt = Date.now();
      

    const follow = await doc.save();

    return res.json({ success: true });
} catch (err) {
    console.log(err);
    return res.status(400).json({ 
        Message: "Failed to send message"
     });
}
};

export const getMessages = async (req, res) => {
    try {
        const chatId = req.params.id;
    
        const chat = await ChatModel.findById(chatId);
    
        if (!chat) {
          throw new Error("Chat not found");
        }
    
        const messages = await MessageModel.find({
          chat: chat._id,
        }).populate("sender").sort("-createdAt");
    
        return res.json(messages);
      } catch (err) {
        console.log(err);
        return res.status(400).json({ 
            message: "Failed to receive messages"
         });
      }
}