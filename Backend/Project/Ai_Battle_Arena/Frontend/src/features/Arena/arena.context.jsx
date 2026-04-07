import { createContext, useContext, useState } from 'react'
import { startBattle } from './services/arena.api.js'

const ArenaContext = createContext(null)

export function ArenaProvider({ children }) {
  const [problem, setProblem] = useState('')
  const [battle,  setBattle]  = useState(null)   // { problem, solution_1, solution_2, judge, winner }
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const runBattle = async (problemText) => {
    setLoading(true)
    setError('')
    setBattle(null)
    setProblem(problemText)
    try {
      const data = await startBattle(problemText)
      // Backend returns { success: true, battle: { ... } }
      setBattle(data.battle)
      return data.battle
    } catch (err) {
      const msg = err?.response?.data?.message || 'Battle failed. Try again.'
      setError(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return (
    <ArenaContext.Provider value={{ problem, battle, loading, error, runBattle }}>
      {children}
    </ArenaContext.Provider>
  )
}

export const useArena = () => {
  const ctx = useContext(ArenaContext)
  if (!ctx) throw new Error('useArena must be used within ArenaProvider')
  return ctx
}
