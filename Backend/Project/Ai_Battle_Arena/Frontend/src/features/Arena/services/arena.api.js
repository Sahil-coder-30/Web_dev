import axios from 'axios'

const API = axios.create({ 
  baseURL: 'https://aibattlearena.vercel.app',
  withCredentials: true 
})

export const startBattle      = (problem) => API.post('/battle', { problem }).then(r => r.data)
export const getBattleHistory = ()        => API.get('/battle/history').then(r => r.data)
export const getLeaderboard   = ()        => API.get('/battle/leaderboard').then(r => r.data)
export const getBattleById    = (id)      => API.get(`/battle/${id}`).then(r => r.data)
