import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useArena } from '../arena.context.jsx'
import Sidebar from '../components/Sidebar.jsx'
import ModelResultModal from '../../../components/ModelResultModal.jsx'
import '../styles/arena.scss'
import '../styles/results.scss'

// Custom code block component — proper box, language label, syntax highlight
function CodeBlock({ inline, className, children, ...props }) {
  const match = /language-(\w+)/.exec(className || '')
  const lang   = match ? match[1] : 'text'
  const code   = String(children).replace(/\n$/, '')

  if (inline) {
    return <code className="md-inline-code" {...props}>{children}</code>
  }

  return (
    <div className="code-block-wrap">
      <div className="code-block-header">
        <span className="code-lang">{lang}</span>
        <button
          className="code-copy-btn"
          onClick={() => navigator.clipboard?.writeText(code)}
        >
          <span className="material-icons">content_copy</span>
        </button>
      </div>
      <SyntaxHighlighter
        language={lang}
        useInlineStyles={true}
        customStyle={{
          margin: 0,
          padding: '16px',
          background: 'transparent',
          fontSize: '0.8rem',
          lineHeight: '1.7',
          fontFamily: '"JetBrains Mono", monospace',
        }}
        style={prismTheme}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}

// Minimal custom Prism theme matching app palette
const prismTheme = {
  'code[class*="language-"]': { color: '#b8c4d0' },
  'token.comment':   { color: '#4a5568', fontStyle: 'italic' },
  'token.keyword':   { color: '#4f9cff' },
  'token.string':    { color: '#22d07a' },
  'token.number':    { color: '#ffb830' },
  'token.function':  { color: '#9b7fff' },
  'token.operator':  { color: '#ff4560' },
  'token.punctuation': { color: '#6b7280' },
  'token.class-name':  { color: '#4f9cff' },
  'token.boolean':     { color: '#ffb830' },
}

const MD_COMPONENTS = {
  code: CodeBlock,
}

function ScoreRing({ score, color }) {
  const r    = 32
  const C    = 2 * Math.PI * r
  const dash = ((Math.min(score, 10) / 10) * C).toFixed(1)
  const gap  = (C - dash).toFixed(1)
  return (
    <div className="score-ring">
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
        <circle cx="36" cy="36" r={r} fill="none" stroke={color}
          strokeWidth="4" strokeDasharray={`${dash} ${gap}`} strokeLinecap="butt"
          transform="rotate(-90 36 36)"
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
      <span className="ring-score" style={{ color }}>{score}</span>
    </div>
  )
}

export default function BattleResults() {
  const { problem, battle } = useArena()
  const navigate = useNavigate()

  // null | 'model_1' | 'model_2'
  const [openModal, setOpenModal] = useState(null)

  // Guard: if no battle data, redirect after render completes
  useEffect(() => {
    if (!battle) navigate('/', { replace: true })
  }, [battle, navigate])

  // Render nothing while redirecting
  if (!battle) return null

  const { solution_1, solution_2, judge, winner } = battle
  const s1 = judge?.solution_1_score  ?? 0
  const s2 = judge?.solution_2_score  ?? 0
  const r1 = judge?.solution_1_reason ?? '—'
  const r2 = judge?.solution_2_reason ?? '—'

  const isTie       = winner === 'tie'
  const winnerLabel = winner === 'model_1' ? 'Cohere Command-A wins'
                    : winner === 'model_2' ? 'Gemini 2.5 Flash wins'
                    : 'Battle ends in a tie'
  const scoreLabel  = (s) => s >= 8 ? 'Excellent' : s >= 6 ? 'Good' : 'Average'

  return (
    <div className="arena-layout">
      <Sidebar />
      <main className="arena-main scrollable">
        <div className="results-page">

          {/* ── Header ── */}
          <div className="results-header anim-fade-up">
            <div className={`winner-chip${isTie ? ' tie' : ''}`}>
              <span className="material-icons winner-icon">
                {isTie ? 'handshake' : 'emoji_events'}
              </span>
              {winnerLabel}
            </div>
            <h2 className="page-title">Battle Results</h2>
            {problem && (
              <p className="challenge-preview">
                {problem.length > 140 ? problem.slice(0, 140) + '…' : problem}
              </p>
            )}
          </div>

          {/* ── Score Cards ── */}
          <div className="scores-row anim-fade-up delay-1">
            <div className={`score-card${winner === 'model_1' && !isTie ? ' winner-card' : ''}`}>
              <div className="card-top">
                <div>
                  <span className="model-label">Combatant 01</span>
                  <div className="model-name">
                    Cohere Command-A
                    {winner === 'model_1' && !isTie && <span className="badge">Winner</span>}
                  </div>
                </div>
                <div className="card-top-right">
                  <button
                    id="expand-cohere-btn"
                    className="expand-btn"
                    title="View full response"
                    onClick={() => setOpenModal('model_1')}
                  >
                    <span className="material-icons">open_in_full</span>
                  </button>
                  <div className="score-block">
                    <ScoreRing score={s1} color="var(--primary)" />
                    <div className="score-meta">
                      <div className="score-large" style={{ color: 'var(--primary)' }}>
                        {s1}<span className="score-denom">/10</span>
                      </div>
                      <div className="score-grade" style={{ color: s1 >= 7 ? 'var(--primary)' : 'var(--tertiary)' }}>
                        {scoreLabel(s1)}
                      </div>
                    </div>
                  </div>{/* end score-block */}
                </div>{/* end card-top-right */}
              </div>{/* end card-top */}
              <div className="solution-body">
                <div className="solution-label">Response</div>
                <div className="md-content">
                  <ReactMarkdown components={MD_COMPONENTS}>{solution_1}</ReactMarkdown>
                </div>
              </div>
            </div>

            <div className="scores-divider">
              <div className="divider-line" />
              <span className="divider-vs">vs</span>
              <div className="divider-line" />
            </div>

            <div className={`score-card${winner === 'model_2' && !isTie ? ' winner-card' : ''}`}>
              <div className="card-top">
                <div>
                  <span className="model-label">Combatant 02</span>
                  <div className="model-name">
                    Gemini 2.5 Flash
                    {winner === 'model_2' && !isTie && <span className="badge badge-red">Winner</span>}
                  </div>
                </div>
                <div className="card-top-right">
                  <button
                    id="expand-gemini-btn"
                    className="expand-btn expand-btn--red"
                    title="View full response"
                    onClick={() => setOpenModal('model_2')}
                  >
                    <span className="material-icons">open_in_full</span>
                  </button>
                  <div className="score-block">
                    <ScoreRing score={s2} color="var(--secondary)" />
                    <div className="score-meta">
                      <div className="score-large" style={{ color: 'var(--secondary)' }}>
                        {s2}<span className="score-denom">/10</span>
                      </div>
                      <div className="score-grade" style={{ color: s2 >= 7 ? 'var(--secondary)' : 'var(--tertiary)' }}>
                        {scoreLabel(s2)}
                      </div>
                    </div>
                  </div>{/* end score-block */}
                </div>{/* end card-top-right */}
              </div>
              <div className="solution-body">
                <div className="solution-label">Response</div>
                <div className="md-content">
                  <ReactMarkdown components={MD_COMPONENTS}>{solution_2}</ReactMarkdown>
                </div>
              </div>
            </div>
          </div>

          {/* ── Judge Verdict Bar ── */}
          <div className="judge-verdict-bar anim-fade-up delay-2">
            <div className="jvb-header">
              <span className="material-icons jvb-icon">gavel</span>
              <span className="jvb-title">Judge Analysis</span>
              <span className="jvb-model">Mistral Large</span>
            </div>
            <div className="jvb-grid">
              <div className="jvb-cell">
                <div className="jvb-cell-head">
                  <span className="jvb-dot" style={{ background: 'var(--primary)' }} />
                  Cohere — {s1}/10
                </div>
                <p className="jvb-text">{r1}</p>
              </div>
              <div className="jvb-sep" />
              <div className="jvb-cell">
                <div className="jvb-cell-head">
                  <span className="jvb-dot" style={{ background: 'var(--secondary)' }} />
                  Gemini — {s2}/10
                </div>
                <p className="jvb-text">{r2}</p>
              </div>
            </div>
          </div>

          {/* ── Actions ── */}
          <div className="results-actions anim-fade-up delay-3">
            <button id="new-battle-btn" className="btn-primary" onClick={() => navigate('/')}>
              New Battle
            </button>
            <button id="view-history-btn" className="btn-ghost" onClick={() => navigate('/history')}>
              View History
            </button>
          </div>

        </div>
      </main>

      {/* ── Full-screen result modals ── */}
      <ModelResultModal
        isOpen={openModal === 'model_1'}
        onClose={() => setOpenModal(null)}
        modelName="Cohere Command-A"
        modelKey="model_1"
        score={s1}
        content={solution_1}
      />
      <ModelResultModal
        isOpen={openModal === 'model_2'}
        onClose={() => setOpenModal(null)}
        modelName="Gemini 2.5 Flash"
        modelKey="model_2"
        score={s2}
        content={solution_2}
      />
    </div>
  )
}
