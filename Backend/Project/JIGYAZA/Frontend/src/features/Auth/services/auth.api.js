import axios from 'axios';

const api =axios.create({
    baseURL: 'http://localhost:3000/api/auth',
    withCredentials : true
})

export const login = async (email , password) => {
    try {
        const response = await api.post('/login', { email, password });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
}

export const register = async (username , email , password ) =>{
    try{
        const res = await api.post("/register", {username , email, password})
        return res.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
}

export const getMe = async () =>{
    try {
        const res = await api.get("getMe");
        return res.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
}


