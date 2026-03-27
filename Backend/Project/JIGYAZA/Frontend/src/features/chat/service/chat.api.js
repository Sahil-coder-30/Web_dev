import axios from "axios";

const api = axios.create({
    baseURL : "http://localhost:3000/api/chats",
    withCredentials : true
})

export const sendMessage = async ({messages , chatId}) =>{
    const res = await api.post("/messages" , {
        messages,
        chatId
    })

    return res.data;
}

export const getChats = async ()=>{
    const res = await api.get("/");
    return res.data;
}

export const getMessages = async (chatId)=>{
    const res = await api.get(`/${chatId}/messages`);
    return res.data;
}

export const DeleteChat = async (chatId) =>{
    const res = await api.delete(`/${chatId}/deleteChat`);
    return res.data;
}
