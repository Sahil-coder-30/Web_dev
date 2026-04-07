import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getBattleHistory } from '../../Arena/services/arena.api.js'
import Sidebar from '../../Arena/components/Sidebar.jsx'
import '../../Arena/styles/arena.scss'
import '../styles/history.scss'

export default function BattleHistory() {
  const navigate  = useNavigate()
  const [battles, setBattles]  = useState([])
  const [loading, setLoading]  = useState(true)
  const [error,   setError]    = useState('')
  const [search,  setSearch]   = useState('')

  useEffect(() => {
    getBattleHistory()
      .then(data => setBattles(data.data || []))
      .catch(() => setError('Failed to load battle history.'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = battles.filter(b =>
    b.problem?.toLowerCase().includes(search.toLowerCase())
  )

  const total       = battles.length
  const cohereWins  = battles.filter(b => b.winner === 'model_1').length
  const geminiWins  = battles.filter(b => b.winner === 'model_2').length

  return (
    <div className="arena-layout">
      <Sidebar />
      <main className="arena-main scrollable">
        <div className="history-page">

          <div className="page-header">
            <h2 className="page-title">Battle History</h2>
            <p className="page-subtitle">Your past arena battles — results archived in order.</p>
          </div>

          <div className="stats-row">
            <div className="stat-card">
              <span className="stat-label">Total Battles</span>
              <div className="stat-value white">{total}</div>
            </div>
            <div className="stat-card">
              <span className="stat-label">Cohere Wins</span>
              <div className="stat-value cyan">{cohereWins}</div>
            </div>
            <div className="stat-card">
              <span className="stat-label">Gemini Wins</span>
              <div className="stat-value purple">{geminiWins}</div>
            </div>
          </div>

          <div className="search-bar">
          <span className="search-icon material-icons">search</span>
            <input
              id="history-search"
              type="text"
              placeholder="Search by problem..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {error && (
            <div style={{ padding: '12px 14px', marginBottom: 16, background: 'rgba(255,113,108,0.06)', border: '1px solid rgba(255,113,108,0.2)', color: 'var(--error)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
              {error}
            </div>
          )}

          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--on-surface-faint)', letterSpacing: '0.06em' }}>
              Loading records...
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <h3>{search ? 'No matching battles' : 'No battles yet'}</h3>
              <p style={{ marginTop: 8 }}>
                {search
                  ? 'Try a different search term.'
                  : 'Start your first battle from the home screen.'}
              </p>
              {!search && (
                <button className="btn-primary" style={{ marginTop: 20 }} onClick={() => navigate('/')}>
                  Start a Battle
                </button>
              )}
            </div>
          ) : (
            <div className="battle-list">
              {filtered.map((battle, i) => {
                const s1 = battle.judge?.solution_1_score ?? 0
                const s2 = battle.judge?.solution_2_score ?? 0
                const winnerColor = battle.winner === 'model_1' ? 'var(--primary)' : battle.winner === 'model_2' ? 'var(--secondary)' : 'var(--on-surface-faint)'
                const winnerText  = battle.winner === 'model_1' ? 'Cohere wins' : battle.winner === 'model_2' ? 'Gemini wins' : 'Tie'

                return (
                  <div key={battle._id || i} className="battle-item">
                    <div className="item-num">
                      #{String(i + 1).padStart(2, '0')}
                      <span className="item-date">
                        {battle.createdAt
                          ? new Date(battle.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
                          : '—'}
                      </span>
                    </div>

                    <div className="item-problem">
                      <div className="problem-preview">{battle.problem}</div>
                      <span className="vs-tag">Cohere vs Gemini · Judged by Mistral</span>
                    </div>

                    <div className="item-scores">
                      {s1} vs {s2}
                      <span className="winner-label" style={{ color: winnerColor }}>
                        {winnerText}
                      </span>
                    </div>

                    <div className="item-action">
                      <button onClick={() => navigate(`/history/${battle._id}`)}>View</button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {filtered.length > 0 && (
            <div className="pagination">
              {filtered.length} of {total} battles
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
