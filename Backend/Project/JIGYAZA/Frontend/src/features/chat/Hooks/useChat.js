import {
  sendMessage,
  getChats,
  getMessages,
  DeleteChat,
} from "../service/chat.api";
import {
  setchats,
  setcurrentChatId,
  seterror,
  setisLoading,
  createNewChat,
  createNewMessage,
  appendTokenToLastMessage,
  updateLastMessageThinking,
  updateLastMessageContent,
  setMessagesForChat,
  removeChat
} from "../chat.slice";
import { inializeSocketConnection } from "../service/chat.socket";
import { useDispatch } from "react-redux";
import { setLoading } from "../../Auth/auth.slice";

export const useChat = () => {
  const dispatch = useDispatch();

  function setupSocketListeners(socketInstance) {
    if (!socketInstance) return;

    // Unsubscribe from any previous listeners to prevent duplicates
    socketInstance.off("chat_chunk");
    socketInstance.off("chat_thinking");
    socketInstance.off("chat_done");
    socketInstance.off("chat_error");

    socketInstance.on("chat_thinking", ({ chatId, thinking }) => {
      dispatch(updateLastMessageThinking({ chatId, thinking }));
    });

    socketInstance.on("chat_chunk", ({ chatId, token }) => {
      dispatch(appendTokenToLastMessage({ chatId, token }));
    });

    socketInstance.on("chat_done", ({ chatId, content, thinking }) => {
      dispatch(updateLastMessageContent({ chatId, message: content, thinking }));
      dispatch(setisLoading(false));
    });

    socketInstance.on("chat_error", ({ chatId, error }) => {
      console.error("Socket chat error:", error);
      dispatch(appendTokenToLastMessage({ chatId, token: "\n\n⚠️ Error generating response." }));
      dispatch(setisLoading(false));
    });
  }

  async function handelSendMessage({ messages, chatId }) {
    const activeSocket = inializeSocketConnection();
    const socketId = activeSocket?.id;

    dispatch(setisLoading(true));
    try {
      const data = await sendMessage({ messages, chatId, socketId });
      const { chat, Aimessage } = data;
      
      // If it's a new chat, the backend creates it and returns the true ID. On existing, it just returns Aimessage.
      const targetChatId = chatId || (chat ? chat._id : null);

      if (!chatId && chat) {
        dispatch(
          createNewChat({
            chatId: targetChatId,
            title: chat.title,
          }),
        );
      }
      
      // Save User Message
      dispatch(
        createNewMessage({
          chatId: targetChatId,
          message: messages,
          role: "user",
        }),
      );

      // Save Placeholder AI Message
      dispatch(
        createNewMessage({
          chatId: targetChatId,
          message: "",
          role: "ai",
        }),
      );

      dispatch(setcurrentChatId(targetChatId));

      // If no socketId, fall back to synchronous completion
      if (!socketId) {
        dispatch(updateLastMessageContent({ chatId: targetChatId, message: Aimessage.content }));
        dispatch(setisLoading(false));
      }
      // Note: If socketId is present, the loading state will be set to false by the "chat_done" or "chat_error" event handlers.
    } catch (error) {
       console.error("Failed to send message:", error);
       dispatch(setisLoading(false));
    }
  }

  async function fetchChats() {
    dispatch(setisLoading(true));
    try {
      const data = await getChats();
      
      // The API returns an array or an object with allChats, but Redux expects a dictionary
      const chatArray = Array.isArray(data) ? data : data.allChats || data.chats || [];
      const chatMap = {};
      
      chatArray.forEach(chat => {
          chatMap[chat._id] = {
              id: chat._id,
              title: chat.title || "New Research",
              message: chat.messages || chat.message || [],
              lastUpdated: chat.updatedAt || chat.createdAt || new Date().toISOString()
          };
      });

      dispatch(setchats(chatMap));
    } catch (error) {
      console.error("Failed to fetch chats:", error);
    } finally {
      dispatch(setisLoading(false));
    }
  }

  async function fetchChatMessages(chatId) {
    dispatch(setisLoading(true));
    try {
      const data = await getMessages(chatId);
      
      // Backend controller exports `allMessage` inside of the JSON data structure.
      const messagesArray = Array.isArray(data) ? data : data.allMessage || data.Allmsg || data.messages || data.message || [];
      
      dispatch(setMessagesForChat({ chatId, messages: messagesArray }));
      
    } catch (error) {
      console.error("Failed to load chat messages:", error);
    } finally {
      dispatch(setisLoading(false));
    }
  }

  async function deleteChatProcess(chatId) {
    if (!window.confirm("Are you sure you want to delete this research thread? This cannot be undone.")) {
      return;
    }
    
    dispatch(setisLoading(true));
    try {
      await DeleteChat(chatId);
      dispatch(removeChat(chatId)); // Remove from UI seamlessly after successful API delete
    } catch (error) {
      console.error("Failed to delete chat:", error);
    } finally {
      dispatch(setisLoading(false));
    }
  }

  return {
    inializeSocketConnection,
    setupSocketListeners,
    handelSendMessage,
    fetchChats,
    fetchChatMessages,
    deleteChatProcess
  };
};
