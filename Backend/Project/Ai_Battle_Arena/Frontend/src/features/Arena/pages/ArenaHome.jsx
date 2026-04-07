import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useArena } from '../arena.context.jsx'
import Sidebar from '../components/Sidebar.jsx'
import '../styles/arena.scss'

const EXAMPLES = [
  'Write a Python function that finds all prime numbers up to N using the Sieve of Eratosthenes.',
  'Design a microservices architecture for a real-time chat app supporting 1M concurrent users.',
  'Explain how transformers work in ML and why they replaced RNNs for NLP tasks.',
  'Write a SQL query to find the top 5 customers by total revenue in the last 30 days.',
  'Key trade-offs between REST and GraphQL APIs — when should you use each?',
  'Marketing strategy for launching a B2B SaaS targeting enterprise clients.',
]

export default function ArenaHome() {
  const { runBattle } = useArena()
  const navigate      = useNavigate()
  const [problem, setProblem] = useState('')
  const [error,   setError]   = useState('')
  const [focused, setFocused] = useState(false)

  const handleStart = (e) => {
    e.preventDefault()
    if (!problem.trim()) { setError('Please enter a problem or challenge.'); return }
    setError('')
    navigate('/battle')
    runBattle(problem.trim())
  }

  return (
    <div className="arena-layout">
      <Sidebar />
      <main className="arena-main arena-home-main">

        <div className="home-content-wrapper">
          {/* ─── Hero ─── */}
          <section className="arena-hero anim-fade-up">
            <div className="hero-eyebrow anim-fade-up delay-1">
              <span className="eyebrow-dot" />
              Live · Cohere vs Gemini · Judged by Mistral
            </div>
            <h1 className="hero-title anim-fade-up delay-2">
              The AI <span className="gradient-text">Battle Arena</span>
            </h1>
            <p className="hero-sub anim-fade-up delay-3">
              Submit any problem. Two frontier models compete to produce the best solution.
              An independent judge scores and names the winner.
            </p>

            <div className="combatants-strip anim-fade-up delay-4">
              <div className="combatant-pill cyan">
                <span className="cpill-dot" />
                Cohere Command-A
              </div>
              <span className="cpill-vs">vs</span>
              <div className="combatant-pill purple">
                <span className="cpill-dot" />
                Gemini 2.5 Flash
              </div>
              <span className="cpill-sep">·</span>
              <span className="cpill-judge">Judged by Mistral Large</span>
            </div>
          </section>

          {/* ─── Form ─── */}
          <section className="battle-form-section anim-fade-up delay-3">
            <form className="chat-style-form" onSubmit={handleStart}>
              {error && <div className="form-error-box">{error}</div>}
              
              <div className={`chat-input-wrapper${focused ? ' focused' : ''}`}>
                <textarea
                  id="battle-problem"
                  className="chat-textarea"
                  placeholder="Message the models to start a battle... (e.g. Reverse a linked list in Python)"
                  value={problem}
                  onChange={e => { setProblem(e.target.value); if (error) setError('') }}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  maxLength={2000}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleStart(e);
                    }
                  }}
                />
                <div className="chat-input-actions">
                  <span className="char-count">{problem.length} / 2000</span>
                  <button 
                    id="start-battle" 
                    type="submit" 
                    className={`chat-submit-btn ${problem.trim() ? 'active' : ''}`}
                    disabled={!problem.trim()}
                  >
                    <span className="material-icons">arrow_upward</span>
                  </button>
                </div>
              </div>

              <div className="form-hint-row">
                <span className="form-hint">Average battle time: ~15 seconds</span>
              </div>
            </form>
          </section>

          {/* ─── Examples ─── */}
          <section className="examples-section anim-fade-up delay-4">
            <div className="examples-header">
              <span className="examples-label">Try an example</span>
            </div>
            <div className="examples-grid">
              {EXAMPLES.map((ex, i) => (
                <button
                  key={i}
                  className={`example-card anim-fade-up delay-${Math.min(i + 1, 6)}`}
                  onClick={() => { setProblem(ex); setError('') }}
                >
                  <span className="ec-arrow">→</span>
                  {ex}
                </button>
              ))}
            </div>
          </section>
        </div>

      </main>
    </div>
  )
}
