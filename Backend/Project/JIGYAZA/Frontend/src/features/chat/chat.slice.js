import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name : 'chat',
    initialState : {
        
        chats : {},
        currentChatId : null,
        isLoading : false,
        error : null
    },
    reducers : {
        createNewChat : (state , action) =>{
            const {title , chatId} = action.payload;
            state.chats[chatId] = {
                id : chatId,
                title ,
                message : [],
                lastUpdated : new Date().toISOString()
            }
            state.currentChatId = chatId;
        },
        createNewMessage : (state , action) =>{
            const {chatId , message, thinking , role} = action.payload;
            state.chats[chatId].message.push({message , thinking: thinking || "", role});
        },
        appendTokenToLastMessage : (state, action) => {
            const { chatId, token } = action.payload;
            if (state.chats[chatId] && state.chats[chatId].message.length > 0) {
                const messageList = state.chats[chatId].message;
                const lastMsg = messageList[messageList.length - 1];
                if (lastMsg.role === "ai") {
                    lastMsg.message = (lastMsg.message || "") + token;
                }
            }
        },
        updateLastMessageThinking : (state, action) => {
            const { chatId, thinking } = action.payload;
            if (state.chats[chatId] && state.chats[chatId].message.length > 0) {
                const messageList = state.chats[chatId].message;
                const lastMsg = messageList[messageList.length - 1];
                if (lastMsg.role === "ai") {
                    lastMsg.thinking = thinking;
                }
            }
        },
        updateLastMessageContent : (state, action) => {
            const { chatId, message, thinking } = action.payload;
            if (state.chats[chatId] && state.chats[chatId].message.length > 0) {
                const messageList = state.chats[chatId].message;
                const lastMsg = messageList[messageList.length - 1];
                if (lastMsg.role === "ai") {
                    lastMsg.message = message;
                    if (thinking !== undefined) {
                        lastMsg.thinking = thinking;
                    }
                }
            }
        },
        setMessagesForChat : (state, action) => {
            const { chatId, messages } = action.payload;
            if (state.chats[chatId]) {
                state.chats[chatId].message = messages;
            }
        },
        removeChat: (state, action) => {
            const chatId = action.payload;
            if (state.chats[chatId]) {
                delete state.chats[chatId];
            }
            if (state.currentChatId === chatId) {
                state.currentChatId = null;
            }
        },
        setchats : (state , action) =>{
            state.chats = action.payload
        },
        setcurrentChatId : (state , action)=>{
            state.currentChatId = action.payload
        },
        setisLoading : (state , action) =>{
            state.isLoading = action.payload
        },
        seterror : (state , action ) =>{
            state.error = action.payload
        }
    }
})

export const {setchats , setcurrentChatId , setisLoading , seterror ,createNewChat , createNewMessage, appendTokenToLastMessage, updateLastMessageThinking, updateLastMessageContent, setMessagesForChat, removeChat } = chatSlice.actions;
export default chatSlice.reducer