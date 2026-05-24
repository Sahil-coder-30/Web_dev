import { createChatTitle, generateResponse, generateStreamResponse } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";
import { getId } from "../sockets/server.socket.js";
import mongoose from "mongoose";

export const chatMessageController = async (req, res, next) => {
  const { messages, chatId, socketId } = req.body;

  try {
    let chat;
    let targetChatId = chatId;
    let title;

    if (!targetChatId) {
      title = await createChatTitle(messages);
      chat = await chatModel.create({ user: req.user.id, title });
      targetChatId = chat._id;
    } else {
      chat = await chatModel.findById(targetChatId);
      if (!chat) {
        return res
          .status(404)
          .json({ message: "No chat exists with this chat id." });
      }
    }

    // Save User message
    const userMessage = await messageModel.create({
      chat: targetChatId,
      content: messages,
      role: "user",
    });

    // Fetch all messages for context (including the newly added user message)
    const allMsg = await messageModel
      .find({ chat: targetChatId })
      .sort({ createdAt: 1 });

    // Handle Streaming if socketId is provided
    if (socketId) {
      // Create a temporary, unsaved AI message details object
      const tempMessageId = new mongoose.Types.ObjectId();
      const tempAimessage = {
        _id: tempMessageId,
        chat: targetChatId,
        content: "",
        role: "ai",
      };

      // Respond immediately with the chat and temporary AI message details
      res.status(201).json({ chat, Aimessage: tempAimessage });

      // Run streaming in the background without blocking the HTTP response
      (async () => {
        try {
          const io = getId();
          const eventStream = await generateStreamResponse(allMsg);
          let fullResponse = "";
          let currentThinking = "";

          for await (const event of eventStream) {
            if (event.event === "on_tool_start") {
              const toolName = event.name;
              const toolInput = event.data?.input;
              // Format a user-friendly thinking token
              const thinkingMsg = `[Searching: ${toolName}...]\n`;
              currentThinking += thinkingMsg;
              
              // Emit tool invocation event to client
              io.to(socketId).emit("chat_thinking", {
                chatId: targetChatId,
                messageId: tempMessageId,
                thinking: currentThinking,
              });
            } else if (event.event === "on_tool_end") {
              const toolName = event.name;
              const thinkingMsg = `[Found information from ${toolName}]\n\n`;
              currentThinking += thinkingMsg;
              
              // Emit tool completion event to client
              io.to(socketId).emit("chat_thinking", {
                chatId: targetChatId,
                messageId: tempMessageId,
                thinking: currentThinking,
              });
            } else if (event.event === "on_chat_model_stream") {
              const token = event.data.chunk.content;
              if (token) {
                fullResponse += token;
                // Emit the token chunk to the specific socket connection
                io.to(socketId).emit("chat_chunk", {
                  chatId: targetChatId,
                  messageId: tempMessageId,
                  token,
                });
              }
            }
          }

          // Save the completed AI response to the database now that generation is finished
          const savedAimessage = await messageModel.create({
            _id: tempMessageId,
            chat: targetChatId,
            content: fullResponse,
            thinking: currentThinking,
            role: "ai",
          });

          // Notify the client that the stream is complete
          io.to(socketId).emit("chat_done", {
            chatId: targetChatId,
            messageId: savedAimessage._id,
            content: fullResponse,
            thinking: currentThinking,
          });

        } catch (streamError) {
          console.error("Error during streaming generation:", streamError);
          try {
            const io = getId();
            io.to(socketId).emit("chat_error", {
              chatId: targetChatId,
              messageId: tempMessageId,
              error: "Failed to generate complete response",
            });
          } catch (e) {}
        }
      })();

      return;
    }

    // Fallback: Non-streaming response if socketId is not provided
    const gemResponse = await generateResponse(allMsg);
    const Aimessage = await messageModel.create({
      chat: targetChatId,
      content: gemResponse,
      role: "ai",
    });

    const updatedMessages = await messageModel.find({ chat: targetChatId }).sort({ createdAt: 1 });

    return res.status(200).json({ chat, Aimessage, Allmsg: updatedMessages });
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

