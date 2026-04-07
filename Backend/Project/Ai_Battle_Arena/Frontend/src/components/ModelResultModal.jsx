import { useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import './ModelResultModal.scss'

// ── Syntax theme matching app palette ───────────────────────────
const prismTheme = {
  'code[class*="language-"]': { color: '#b8c4d0' },
  'token.comment':     { color: '#4a5568', fontStyle: 'italic' },
  'token.keyword':     { color: '#4f9cff' },
  'token.string':      { color: '#22d07a' },
  'token.number':      { color: '#ffb830' },
  'token.function':    { color: '#9b7fff' },
  'token.operator':    { color: '#ff4560' },
  'token.punctuation': { color: '#6b7280' },
  'token.class-name':  { color: '#4f9cff' },
  'token.boolean':     { color: '#ffb830' },
}

function CodeBlock({ inline, className, children, ...props }) {
  const match = /language-(\w+)/.exec(className || '')
  const lang  = match ? match[1] : 'text'
  const code  = String(children).replace(/\n$/, '')

  if (inline) {
    return <code className="mrm-inline-code" {...props}>{children}</code>
  }

  return (
    <div className="mrm-code-wrap">
      <div className="mrm-code-header">
        <span className="mrm-code-lang">{lang}</span>
        <button
          className="mrm-copy-btn"
          onClick={() => navigator.clipboard?.writeText(code)}
          title="Copy code"
        >
          <span className="material-icons">content_copy</span>
          Copy
        </button>
      </div>
      <SyntaxHighlighter
        language={lang}
        useInlineStyles={true}
        customStyle={{
          margin: 0,
          padding: '20px 24px',
          background: 'transparent',
          fontSize: '0.85rem',
          lineHeight: '1.75',
          fontFamily: '"JetBrains Mono", monospace',
        }}
        style={prismTheme}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}

const MD_COMPONENTS = { code: CodeBlock }

// ─────────────────────────────────────────────────────────────────
// ModelResultModal
//
// Props:
//   isOpen     {boolean}   — toggle visibility
//   onClose    {function}  — called to close
//   modelName  {string}    — display name e.g. "Cohere Command-A"
//   modelKey   {string}    — "model_1" | "model_2" (drives accent colour)
//   score      {number}    — judge score /10
//   content    {string}    — raw markdown response
// ─────────────────────────────────────────────────────────────────
export default function ModelResultModal({
  isOpen,
  onClose,
  modelName,
  modelKey,
  score,
  content,
}) {
  const scrollRef  = useRef(null)
  const accentVar  = modelKey === 'model_2' ? 'var(--secondary)' : 'var(--primary)'
  const accentName = modelKey === 'model_2' ? 'red' : 'blue'

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  const scoreLabel = score >= 8 ? 'Excellent' : score >= 6 ? 'Good' : 'Average'

  return (
    <div
      className="mrm-backdrop"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-label={`${modelName} full response`}
    >
      <div className={`mrm-panel mrm-panel--${accentName}`}>

        {/* ── Top bar ── */}
        <div className="mrm-topbar">
          <div className="mrm-topbar-left">
            <span className="material-icons mrm-model-icon">
              {modelKey === 'model_2' ? 'auto_awesome' : 'bolt'}
            </span>
            <div>
              <div className="mrm-model-label">Full Response</div>
              <div className="mrm-model-name" style={{ color: accentVar }}>
                {modelName}
              </div>
            </div>
          </div>

          <div className="mrm-topbar-right">
            {/* Score pill */}
            <div className="mrm-score-pill" style={{ borderColor: accentVar, color: accentVar }}>
              <span className="mrm-score-num">{score}</span>
              <span className="mrm-score-denom">/10</span>
              <span className="mrm-score-label">{scoreLabel}</span>
            </div>

            {/* Scroll to top */}
            <button
              className="mrm-icon-btn"
              onClick={() => scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
              title="Scroll to top"
            >
              <span className="material-icons">vertical_align_top</span>
            </button>

            {/* Copy full response */}
            <button
              className="mrm-icon-btn"
              onClick={() => navigator.clipboard?.writeText(content)}
              title="Copy full response"
            >
              <span className="material-icons">content_copy</span>
            </button>

            {/* Close */}
            <button
              className="mrm-close-btn"
              onClick={onClose}
              title="Close (Esc)"
            >
              <span className="material-icons">close</span>
            </button>
          </div>
        </div>

        {/* ── Accent divider ── */}
        <div className="mrm-divider" style={{ background: accentVar }} />

        {/* ── Scrollable content area ── */}
        <div className="mrm-body" ref={scrollRef}>
          <div className="mrm-md-content">
            <ReactMarkdown components={MD_COMPONENTS}>{content}</ReactMarkdown>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="mrm-footer">
          <span className="mrm-footer-hint">
            <span className="material-icons">keyboard</span>
            Press <kbd>Esc</kbd> or click outside to close
          </span>
          <button className="btn-ghost mrm-close-action" onClick={onClose}>
            Close
          </button>
        </div>

      </div>
    </div>
  )
}
