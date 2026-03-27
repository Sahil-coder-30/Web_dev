import React, { useEffect, useRef, useState, useCallback } from 'react';
import './TerminalWindow.scss';

// ── AI Icon SVG ─────────────────────────────────────────────────
const AiIcon = () => (
  <span className="tw-ai-icon">
    <svg viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="2" height="2" fill="#c8521a"/>
      <rect x="5" y="1" width="2" height="2" fill="#c8521a"/>
      <rect x="1" y="5" width="6" height="2" fill="#c8521a"/>
    </svg>
  </span>
);

// ── Chat Script ──────────────────────────────────────────────────
const CHAT_SCRIPT = [
  { speaker: 'user',     text: 'How does Jigyaza handle conflicting sources?' },
  { speaker: 'jigyaza',  text: 'The logical conflict engine flags the discrepancy and spawns a sub-agent to verify the factual baseline before rendering the interface.', meta: '3.2s · confidence 94% · 4 sources cross-checked' },
  { speaker: 'user',     text: 'Are there limits on my free beta account?' },
  { speaker: 'jigyaza',  text: 'The free Researcher tier allows **100 deep queries per day** with full live web access, evaluating logic at standard speeds.', meta: '1.8s · tier: researcher · quota resets 00:00 UTC' },
  { speaker: 'user',     text: 'Can I use Jigyaza via an API?' },
  { speaker: 'jigyaza',  text: 'Priority API access is exclusively available in the **Enterprise protocol** for teams needing automated intelligence loops.', meta: '2.1s · enterprise feature · contact sales for access' },
  { speaker: 'user',     text: 'Does the system maintain context over long sessions?' },
  { speaker: 'jigyaza',  text: 'Yes. The E2E secured session uses a dynamic memory pool that tracks context meticulously until the vault is purged.', meta: '1.4s · memory pool active · session depth: 7' },
  { action: 'CLEAR' },
];

// ── Sources Data ─────────────────────────────────────────────────
const SOURCES = {
  academic: [
    { domain: 'arxiv.org',  title: 'Attention Is All You Need',       type: 'Research Paper · 2017' },
    { domain: 'nature.com', title: 'Deep Learning Evolution',          type: 'Journal Article · 2024' },
    { domain: 'mit.edu',    title: 'Neural Architecture 2024',         type: 'Technical Report · 2024' },
  ],
  web: [
    { domain: 'openai.com',      title: 'GPT-4 System Card',          type: 'Documentation · 2023' },
    { domain: 'deepmind.com',    title: 'Gemini Technical Report',     type: 'Whitepaper · 2024' },
    { domain: 'huggingface.co',  title: 'Open LLM Leaderboard',       type: 'Live Data · updated today' },
  ],
};

// ── Typewriter queries (input bar) ───────────────────────────────
const TYPEWRITER_QUERIES = [
  'Does the system maintain context over long sessions?',
  'What models power the logic engine?',
  'How are sources ranked by credibility?',
  'Can Jigyaza analyse my PDF datasets?',
];

// ── Render bold tokens (**text**) ────────────────────────────────
const RichText = ({ text }) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**')
          ? <strong key={i} className="tw-bold">{part.slice(2, -2)}</strong>
          : <span key={i}>{part}</span>
      )}
    </>
  );
};

// ── Main Component ───────────────────────────────────────────────
export default function TerminalWindow({ className = '' }) {
  const [chatLog,    setChatLog]    = useState([]);
  const [inputText,  setInputText]  = useState('');
  const [activeSource, setActiveSource] = useState(null);
  const msgsRef      = useRef(null);
  const mountedRef   = useRef(true);

  // ── Auto-scroll chat ─────────────────────────────────────────
  const scrollBottom = useCallback(() => {
    if (msgsRef.current) {
      msgsRef.current.scrollTo({ top: msgsRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, []);

  // ── Typewriter for input bar ─────────────────────────────────
  // Only starts when the terminal scrolls into view — avoids competing
  // with hero GSAP animations during the most expensive moment of load.
  const rootRef = useRef(null); // ref for the root terminal element

  useEffect(() => {
    let qi = 0, ci = 0, deleting = false;
    let timer;
    let started = false;

    function step() {
      if (!mountedRef.current) return;
      const q = TYPEWRITER_QUERIES[qi];
      if (!deleting) {
        ci++;
        setInputText(q.slice(0, ci));
        if (ci === q.length) {
          deleting = true;
          timer = setTimeout(step, 2400);
          return;
        }
        timer = setTimeout(step, 38 + Math.random() * 20);
      } else {
        ci--;
        setInputText(q.slice(0, ci));
        if (ci === 0) {
          deleting = false;
          qi = (qi + 1) % TYPEWRITER_QUERIES.length;
          timer = setTimeout(step, 420);
          return;
        }
        timer = setTimeout(step, 16);
      }
    }

    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) {
        started = true;
        timer = setTimeout(step, 800);
        obs.disconnect();
      }
    }, { threshold: 0.2 });

    if (rootRef.current) obs.observe(rootRef.current);
    return () => { obs.disconnect(); clearTimeout(timer); };
  }, []);

  // ── Chat simulation loop ──────────────────────────────────────
  // Deferred until terminal is in view — no point animating chat text
  // while the user is still on the hero section.
  useEffect(() => {
    mountedRef.current = true;
    let turnIndex = 0;
    let started = false;

    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    const runChat = async () => {
      while (mountedRef.current) {
        const turn = CHAT_SCRIPT[turnIndex];

        if (turn.action === 'CLEAR') {
          await sleep(4000);
          if (!mountedRef.current) break;
          setChatLog([]);
          turnIndex = 0;
          continue;
        }

        if (turn.speaker === 'jigyaza') {
          const thinkId = `think-${Date.now()}`;
          setChatLog((prev) => [...prev, { id: thinkId, speaker: 'jigyaza', text: '', isThinking: true, meta: turn.meta }]);
          scrollBottom();
          await sleep(1200 + Math.random() * 800);
          if (!mountedRef.current) break;
          setChatLog((prev) =>
            prev.map((m) => m.id === thinkId ? { ...m, isThinking: false } : m)
          );
        } else {
          await sleep(1500);
          if (!mountedRef.current) break;
          setChatLog((prev) => [...prev, { id: `user-${Date.now()}`, speaker: 'user', text: '' }]);
        }

        // Human-paced typing:
        //   user    → 65ms/char  ≈ 200 WPM, realistic casual keyboard speed
        //   jigyaza → 28ms/char  ≈ visibly typing, still faster than human (it's AI)
        const delay    = turn.speaker === 'user' ? 65 : 28;
        const fullText = turn.text;
        let charIdx    = 0;

        await new Promise((resolve) => {
          const interval = setInterval(() => {
            if (!mountedRef.current) { clearInterval(interval); resolve(); return; }
            // Always advance 1 char — 2-char steps felt like copy-paste, not typing
            charIdx = Math.min(charIdx + 1, fullText.length);
            const captured = fullText.slice(0, charIdx);
            setChatLog((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = { ...updated[updated.length - 1], text: captured };
              return updated;
            });
            scrollBottom();
            if (charIdx >= fullText.length) { clearInterval(interval); resolve(); }
          }, delay);
        });

        turnIndex++;
      }
    };

    // Start the chat only when the terminal scrolls into view
    const chatObs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) {
        started = true;
        runChat();
        chatObs.disconnect();
      }
    }, { threshold: 0.15 });

    // Slight delay so rootRef has mounted
    const t = setTimeout(() => {
      if (rootRef.current) chatObs.observe(rootRef.current);
    }, 0);

    return () => {
      clearTimeout(t);
      chatObs.disconnect();
      mountedRef.current = false;
    };
  }, [scrollBottom]);

  const totalSources = SOURCES.academic.length + SOURCES.web.length;

  return (
    <div ref={rootRef} className={`tw-window ${className}`}>

      {/* ── TITLE BAR ── */}
      <div className="tw-titlebar">
        <div className="tw-dots">
          <span className="tw-dot tw-dot--red"   />
          <span className="tw-dot tw-dot--yellow" />
          <span className="tw-dot tw-dot--green"  />
        </div>
        <div className="tw-titlebar-center">
          <span className="tw-titlebar-name">Jigyaza Research Environment</span>
          <span className="tw-titlebar-version">v1.02</span>
        </div>
        <div className="tw-titlebar-status">
          <span className="tw-status-dot" />
          <span className="tw-status-text">Live</span>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="tw-body">

        {/* ── CHAT AREA ── */}
        <div className="tw-chat-area">

          {/* Sub-header */}
          <div className="tw-chat-header">
            <span className="tw-chat-label">Session</span>
            <span className="tw-chat-tag">Deep Query</span>
            <span className="tw-chat-tag">Logic Engine Active</span>
            <span className="tw-chat-sep" />
            <span className="tw-chat-count">{chatLog.length} exchanges</span>
          </div>

          {/* Messages */}
          <div className="tw-messages" ref={msgsRef}>
            <div className="tw-session-start">
              # Secure session established. Connecting to Jigyaza Research Engine...
            </div>

            {chatLog.map((msg, i) => (
              <div key={msg.id} className="tw-msg-row">

                {/* USER */}
                {msg.speaker === 'user' && (
                  <div className="tw-msg tw-msg--user">
                    <div className="tw-msg-label tw-msg-label--user">
                      <span className="tw-msg-arrow">▸</span> You
                    </div>
                    <div className="tw-msg-text">
                      {msg.text}
                      {i === chatLog.length - 1 && <span className="tw-cursor" />}
                    </div>
                  </div>
                )}

                {/* AI */}
                {msg.speaker === 'jigyaza' && (
                  <div className="tw-msg tw-msg--ai">
                    <div className="tw-msg-label tw-msg-label--ai">
                      <AiIcon /> Jigyaza AI
                    </div>
                    {msg.isThinking ? (
                      <div className="tw-thinking">
                        <span className="tw-thinking-label">Processing</span>
                        <div className="tw-typing-dots">
                          <span /><span /><span />
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="tw-msg-text">
                          <RichText text={msg.text} />
                          {i === chatLog.length - 1 && !msg.isThinking && <span className="tw-cursor" />}
                        </div>
                        {msg.meta && msg.text.length === CHAT_SCRIPT.find(s => s.speaker === 'jigyaza' && s.meta === msg.meta)?.text.length && (
                          <div className="tw-msg-meta">{msg.meta}</div>
                        )}
                      </>
                    )}
                  </div>
                )}

              </div>
            ))}
          </div>

          {/* Input bar */}
          <div className="tw-input-bar">
            <span className="tw-input-prompt">›</span>
            <div className="tw-input-field">
              <span className="tw-input-text">{inputText}</span>
              <span className="tw-cursor" />
            </div>
            <span className="tw-input-shortcut">⏎ Send</span>
          </div>

        </div>{/* /chat-area */}

        {/* ── SOURCES PANEL ── */}
        <div className="tw-sources-panel">

          <div className="tw-sources-header">
            <span className="tw-sources-title">Verified Sources</span>
            <span className="tw-sources-badge">{totalSources}</span>
          </div>

          <div className="tw-sources-list">

            <div className="tw-sources-section-label">Academic</div>
            {SOURCES.academic.map((s, i) => (
              <div
                key={i}
                className={`tw-source-item ${activeSource === `a${i}` ? 'tw-source-item--active' : ''}`}
                style={{ animationDelay: `${0.4 + i * 0.25}s` }}
                onClick={() => setActiveSource(activeSource === `a${i}` ? null : `a${i}`)}
              >
                <div className="tw-source-domain">{s.domain}</div>
                <div className="tw-source-title">{s.title}</div>
                <div className="tw-source-type">{s.type}</div>
              </div>
            ))}

            <div className="tw-sources-section-label">Web</div>
            {SOURCES.web.map((s, i) => (
              <div
                key={i}
                className={`tw-source-item ${activeSource === `w${i}` ? 'tw-source-item--active' : ''}`}
                style={{ animationDelay: `${1.15 + i * 0.25}s` }}
                onClick={() => setActiveSource(activeSource === `w${i}` ? null : `w${i}`)}
              >
                <div className="tw-source-domain">{s.domain}</div>
                <div className="tw-source-title">{s.title}</div>
                <div className="tw-source-type">{s.type}</div>
              </div>
            ))}

          </div>

          {/* Model footer */}
          <div className="tw-sources-footer">
            <div className="tw-model-tag">Active Model</div>
            <div className="tw-model-name">Jigyaza-Research-7B</div>
            <div className="tw-model-bar">
              <div className="tw-model-bar-fill" />
            </div>
          </div>

        </div>{/* /sources-panel */}

      </div>{/* /body */}

    </div>
  );
}
