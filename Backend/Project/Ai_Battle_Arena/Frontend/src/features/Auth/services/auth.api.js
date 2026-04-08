import axios from 'axios'

const API = axios.create({ 
  baseURL: 'https://aibattlearena.vercel.app',
  withCredentials: true 
})

export const loginUser    = (email, password)              => API.post('/auth/login',    { email, password }).then(r => r.data)
export const registerUser = (username, email, password)    => API.post('/auth/register', { username, email, password }).then(r => r.data)
export const logoutUser   = ()                             => API.post('/auth/logout').catch(() => {})
export const getMe        = ()                             => API.get('/auth/me').then(r => r.data)
