import axios from 'axios';

const api =axios.create({
    baseURL: '/api/auth',
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

export const verifyOtp = async (email, otp) => {
    try {
        const res = await api.post("/verify-otp", { email, otp });
        return res.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
}

export const resendOtp = async (email) => {
    try {
        const res = await api.post("/resend-otp", { email });
        return res.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
}

export const forgetPassword = async (email) => {
    try {
        const res = await api.post("/forget-password", { email });
        return res.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
}

export const resetPassword = async (email, otp, password) => {
    try {
        const res = await api.post("/reset-password", { email, otp, password });
        return res.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
}

export const logout = async () => {
    try {
        const res = await api.get("/logout");
        return res.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
}

export const checkAutoVerify = async (email) => {
    try {
        const res = await api.post("/auto-verify", { email });
        return res.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
}

export const verifyEmailLink = async (token) => {
    try {
        const res = await api.get(`/verify?token=${token}`);
        return res.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
}

export const sendCreatePasswordOtp = async (email) => {
    try {
        const res = await api.post("/send-create-password-otp", { email });
        return res.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
}

export const createPassword = async (email, otp, password) => {
    try {
        const res = await api.post("/create-password", { email, otp, password });
        return res.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
}
