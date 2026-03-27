import { createChatTitle, generateResponse } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";

export const chatMessageController = async (req, res, next) => {
  const { messages, chatId } = req.body;

  try {
    if (!chatId) {
      const title = await createChatTitle(messages);
      const chat = await chatModel.create({ user: req.user.id, title });
      const newChatId = chat._id;

      await messageModel.create({
        chat: newChatId,
        content: messages,
        role: "user",
      });

      const allMsg = await messageModel.find({ chat: newChatId });
      const gemResponse = await generateResponse(allMsg);

      const Aimessage = await messageModel.create({
        chat: newChatId,
        content: gemResponse,
        role: "ai",
      });

      return res.status(201).json({ chat, Aimessage });
    }

    const chat = await chatModel.findById(chatId); // ✅ returns document, not array
    if (!chat) {
      return res
        .status(404)
        .json({ message: "No chat exists with this chat id." });
    }

    await messageModel.create({
      chat: chat._id,
      content: messages,
      role: "user",
    });

    const Allmsg = await messageModel
      .find({ chat: chatId })
      .sort({ createdAt: 1 });
    const gemResponse = await generateResponse(Allmsg);

    const Aimessage = await messageModel.create({
      chat: chat._id,
      content: gemResponse,
      role: "ai",
    });

    return res.status(200).json({ Allmsg, Aimessage }); // ✅ include AI reply
  } catch (err) {
    next(err);
  }
};

export const getChats = async (req, res, next) => {
  try {
    const { id } = req.user;
    const allChats = await chatModel.find({ user: id });
    if (!allChats) {
      return res.status(409).json({
        message: "No chat available currently ...",
      });
    }
    return res.status(201).json({
      message: "All chats of the user ...",
      allChats,
    });
  } catch (error) {
    next(error)
  }
};

export const allMessagesofChat = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const chat = await chatModel.findOne({ _id: chatId , user : req.user.id });
    if (!chat) {
      return res.status(404).json({
        message: "No such chat exist...",
      });
    }
    const allMessage = await messageModel.find({ chat : chatId });
    return res.status(201).json({
      message: "all messages retrived ...",
      allMessage
    });
  } catch (error) {
    next(error);
  }
};

export const deleteChat = async (req , res , next) =>{
  const {chatId} = req.params;
  console.log(chatId , req.user.id);
  
  
  const chat = await chatModel.findOneAndDelete({
    _id : chatId,
    user : req.user.id
  });
  await messageModel.deleteMany({
    chat : chatId
  });
  if(!chat){
    return res.status(400).json({
      message : 'No such chat found ...'
    })
  }

  return res.status(201).json({
    message : "Deleted the chat from the chat Model..."
  })
}

