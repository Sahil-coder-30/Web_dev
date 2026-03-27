import { Router } from "express";
import {identifyUser} from '../middleware/auth.middleware.js'
import {
    chatMessageController,
    getChats,
    allMessagesofChat,
    deleteChat
} from '../controller/chatController.js'


const chatRouter = Router();

chatRouter.post("/messages" ,identifyUser, chatMessageController);
chatRouter.get("/", identifyUser , getChats );
chatRouter.get("/:chatId/messages", identifyUser , allMessagesofChat );
chatRouter.delete("/:chatId/deleteChat" , identifyUser , deleteChat );
export default chatRouter;
