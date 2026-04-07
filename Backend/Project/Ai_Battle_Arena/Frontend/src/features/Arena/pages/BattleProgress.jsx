import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useArena } from '../arena.context.jsx'
import '../styles/arena.scss'

function SpinGauge({ color = '#a1faff', dashArray = '60 40' }) {
  const r = 24, cx = 32
  return (
    <svg className="gauge-svg" width="64" height="64" viewBox="0 0 64 64">
      <circle cx={cx} cy={cx} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
      <circle
        cx={cx} cy={cx} r={r} fill="none" stroke={color}
        strokeWidth="3" strokeDasharray={dashArray} strokeLinecap="butt"
        transform={`rotate(-90 ${cx} ${cx})`}
        style={{ filter: `drop-shadow(0 0 6px ${color})` }}
      />
    </svg>
  )
}

export default function BattleProgress() {
  const { problem, battle, error } = useArena()
  const navigate = useNavigate()

  useEffect(() => {
    if (battle) navigate('/results')
    if (error)  navigate('/')
  }, [battle, error, navigate])

  return (
    <div className="battle-progress-page">
      <div className="progress-topbar">
        <div className="status-indicator">
          <div className="pulse-dot"></div>
          BATTLE IN PROGRESS
        </div>
        <span className="judge-label">JUDGE: MISTRAL LARGE // OBSERVING</span>
      </div>

      {problem && (
        <div className="problem-block">
          <span className="problem-tag">// ACTIVE CHALLENGE</span>
          <div className="problem-text">{problem}</div>
        </div>
      )}

      <div className="combatants-arena">
        <div className="combatant-panel">
          <div className="combatant-header">
            <span className="combatant-num">COMBATANT_01</span>
            <div className="combatant-name">Cohere<br/>Command-A</div>
          </div>
          <div className="gauge-row">
            <SpinGauge color="#a1faff" dashArray="50 50" />
            <div className="gauge-info">
              <span className="gauge-label">Status</span>
              <div className="gauge-status cyan">COMPUTING...</div>
            </div>
          </div>
          <div className="terminal-output">
            <div className="terminal-header">
              <span>OUTPUT_STREAM</span><span>RT-01</span>
            </div>
            <div className="terminal-text">
              Analyzing problem parameters...<br />
              Initializing response generation...<br />
              <span className="cursor" />
            </div>
          </div>
        </div>

        <div className="vs-divider">
          <div className="vs-text gradient-text">VS</div>
          <div className="vs-line" />
        </div>

        <div className="combatant-panel">
          <div className="combatant-header right">
            <span className="combatant-num" style={{ color: 'var(--secondary)' }}>COMBATANT_02</span>
            <div className="combatant-name">Gemini<br/>2.5 Flash</div>
          </div>
          <div className="gauge-row">
            <SpinGauge color="#ad89ff" dashArray="70 30" />
            <div className="gauge-info">
              <span className="gauge-label">Status</span>
              <div className="gauge-status green">PROCESSING...</div>
            </div>
          </div>
          <div className="terminal-output">
            <div className="terminal-header">
              <span>OUTPUT_STREAM</span><span>RT-02</span>
            </div>
            <div className="terminal-text">
              Parsing challenge context...<br />
              Constructing optimal response...<br />
              <span className="cursor" style={{ background: 'var(--secondary)' }} />
            </div>
          </div>
        </div>
      </div>

      <div className="judge-progress-bar">
        <span className="judge-text">Judge Mistral is watching...</span>
        <div className="progress-track">
          <div className="progress-fill" />
        </div>
        <span className="judge-label">EVALUATING</span>
      </div>
    </div>
  )
}
