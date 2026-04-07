import { createContext, useContext, useState, useCallback } from 'react'
import { getBattleHistory, getLeaderboard } from '../Arena/services/arena.api.js'

const HistoryContext = createContext(null)

export function HistoryProvider({ children }) {
  const [battles,     setBattles]     = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [pagination,  setPagination]  = useState({ page: 1, limit: 10, total: 0, pages: 1 })
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState('')

  const fetchHistory = useCallback(async (page = 1, limit = 10) => {
    setLoading(true)
    setError('')
    try {
      const data = await getBattleHistory(page, limit)
      setBattles(data.data || [])
      setPagination(data.pagination || { page, limit, total: 0, pages: 1 })
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load history.')
      setBattles([])
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getLeaderboard()
      setLeaderboard(data.data || [])
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load leaderboard.')
      setLeaderboard([])
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <HistoryContext.Provider value={{ battles, leaderboard, pagination, loading, error, fetchHistory, fetchLeaderboard }}>
      {children}
    </HistoryContext.Provider>
  )
}

export const useHistory = () => {
  const ctx = useContext(HistoryContext)
  if (!ctx) throw new Error('useHistory must be used within HistoryProvider')
  return ctx
}
