import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useHistory } from '../history.context.jsx'
import Sidebar from '../../Arena/components/Sidebar.jsx'
import { SkeletonList } from '../../../components/Skeleton/Skeleton.jsx'
import '../../Arena/styles/arena.scss'
import '../styles/history.scss'

export default function Leaderboard() {
  const navigate = useNavigate()
  const { leaderboard, loading, error, fetchLeaderboard } = useHistory()

  useEffect(() => { fetchLeaderboard() }, [])

  return (
    <div className="arena-layout">
      <Sidebar />
      <main className="arena-main scrollable">
        <div className="history-page">

          <div className="page-header">
            <h2 className="page-title gradient-text">🏆 LEADERBOARD</h2>
            <p className="page-subtitle">Top arena commanders ranked by battles fought.</p>
            <button
              id="back-history-btn"
              className="btn-ghost"
              style={{ marginTop: 8 }}
              onClick={() => navigate('/history')}
            >
              ← BACK TO HISTORY
            </button>
          </div>

          {error && <div className="form-error" style={{ marginBottom: 16 }}>{error}</div>}

          {loading ? (
            <div className="battle-list" style={{ marginTop: 24 }}>
              <SkeletonList count={8} type="row" style={{ height: '62px', borderRadius: '4px', border: '1px solid rgba(72,71,77,0.3)', background: 'var(--surface-high)' }} />
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="empty-state">
              <h3>No data yet</h3>
              <p>Run some battles to appear on the leaderboard.</p>
            </div>
          ) : (
            <div className="battle-list">
              {leaderboard.map((entry, i) => (
                <div key={entry.userId} className="battle-item">
                  <div className="item-num" style={{ minWidth: 60, fontSize: i < 3 ? '1.2rem' : '0.85rem' }}>
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${String(i + 1).padStart(3, '0')}`}
                  </div>

                  <div className="item-problem">
                    <div className="problem-preview" style={{ fontWeight: 700, fontSize: '1rem' }}>
                      {entry.username}
                    </div>
                    <span className="vs-tag">{entry.totalBattles} battles fought</span>
                  </div>

                  <div className="item-scores" style={{ flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
                    <span style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                      Cohere avg: {entry.avgScore1}/10
                    </span>
                    <span style={{ color: 'var(--secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                      Gemini avg: {entry.avgScore2}/10
                    </span>
                    <span style={{ color: 'var(--on-surface-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>
                      W1: {entry.model1Wins} · W2: {entry.model2Wins} · Ties: {entry.ties}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
