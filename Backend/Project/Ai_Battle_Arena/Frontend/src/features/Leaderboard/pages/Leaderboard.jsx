import { useState, useEffect } from 'react'
import Sidebar from '../../Arena/components/Sidebar.jsx'
import Avatar from '../../../components/Avatar.jsx'
import { getLeaderboard } from '../../Arena/services/arena.api.js'
import '../../Arena/styles/arena.scss'
import '../styles/leaderboard.scss'

function Rank({ n }) {
  if (n === 1) return <span className="rank rank-gold"><span className="material-icons" style={{fontSize:'1.1rem',color:'#FFB830'}}>workspace_premium</span></span>
  if (n === 2) return <span className="rank rank-silver"><span className="material-icons" style={{fontSize:'1rem',color:'#a0a0b0'}}>military_tech</span></span>
  if (n === 3) return <span className="rank rank-bronze"><span className="material-icons" style={{fontSize:'1rem',color:'#cd7f4a'}}>military_tech</span></span>
  return <span className="rank">#{n}</span>
}

export default function Leaderboard() {
  const [rows,    setRows]    = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => {
    getLeaderboard()
      .then(data => setRows(data.data || []))
      .catch(() => setError('Failed to load leaderboard data.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="arena-layout">
      <Sidebar />
      <main className="arena-main scrollable">
        <div className="leaderboard-page">

          <div className="page-header anim-fade-up">
            <h2 className="page-title gradient-text">Leaderboard</h2>
            <p className="page-subtitle">
              Top users ranked by total battles — updated in real time.
            </p>
          </div>

          {error && (
            <div className="lb-error anim-fade-up">{error}</div>
          )}

          {loading ? (
            <div className="lb-loading anim-fade-in">
              <div className="lb-skeleton" />
              <div className="lb-skeleton" />
              <div className="lb-skeleton" />
            </div>
          ) : rows.length === 0 && !error ? (
            <div className="lb-empty anim-scale-in">
              <span className="material-icons lb-empty-icon">emoji_events</span>
              <h3>No battles yet</h3>
              <p>Be the first to run a battle and claim the top spot.</p>
            </div>
          ) : (
            <>
              {/* Top 3 podium */}
              {rows.length >= 3 && (
                <div className="podium anim-fade-up delay-1">
                  {[rows[1], rows[0], rows[2]].map((row, i) => {
                    const pos = [2, 1, 3][i]
                    return (
                      <div key={row.userId} className={`podium-step pos-${pos}`}>
                      <div className="podium-avatar">
                        <span className="podium-avatar-inner">
                          {row.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="podium-name">{row.username}</div>
                      <div className="podium-battles">{row.totalBattles} battles</div>
                      <div className={`podium-base base-${pos}`}>
                        <span className="podium-rank-num">{pos}</span>
                      </div>
                    </div>
                    )
                  })}
                </div>
              )}

              {/* Full table */}
              <div className="lb-table anim-fade-up delay-2">
                <div className="lb-thead">
                  <span className="lbh-rank">Rank</span>
                  <span className="lbh-user">User</span>
                  <span className="lbh-num">Battles</span>
                  <span className="lbh-num hide-mobile">Cohere W</span>
                  <span className="lbh-num hide-mobile">Gemini W</span>
                  <span className="lbh-num hide-mobile">Ties</span>
                </div>
                {rows.map((row, i) => (
                  <div key={row.userId} className={`lb-row${i < 3 ? ' top-row' : ''} anim-fade-up`} style={{ animationDelay: `${0.1 + i * 0.04}s` }}>
                    <span className="lbc-rank"><Rank n={i + 1} /></span>
                    <span className="lbc-user">
                      <Avatar name={row.username} size={30} />
                      {row.username}
                    </span>
                    <span className="lbc-num">{row.totalBattles}</span>
                    <span className="lbc-num cyan hide-mobile">{row.model1Wins}</span>
                    <span className="lbc-num purple hide-mobile">{row.model2Wins}</span>
                    <span className="lbc-num muted hide-mobile">{row.ties}</span>
                  </div>
                ))}
              </div>
            </>
          )}

        </div>
      </main>
    </div>
  )
}
