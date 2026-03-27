import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
import './Testimonials.scss';

// ─── Data ────────────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    id: 1,
    quote: "Jigyaza doesn't hallucinate. It either provides the exact source, or admits the data isn't available. It's fundamentally changed our R&D cycle.",
    author: "Dr. Arthur Densmoore",
    role: "Lead Researcher",
    org: "MIT AI Lab",
    initials: "AD",
    metric: "3× faster findings",
    color: "#c7621a",
    verified: true,
  },
  {
    id: 2,
    quote: "The Multi-Agent reasoning feature acts like having a board of PhDs arguing the nuances of my query in real-time. The synthesis quality is unprecedented.",
    author: "Sarah Mitchell",
    role: "Data Science Director",
    org: "DeepMind Research",
    initials: "SM",
    metric: "98% accuracy rate",
    color: "#e8943a",
    verified: true,
  },
  {
    id: 3,
    quote: "Integrating Jigyaza into our workflow cut down preliminary research times by 60%. The multi-agent processing is incredibly robust and reproducible.",
    author: "James K.",
    role: "VP Engineering",
    org: "Anthropic",
    initials: "JK",
    metric: "60% time saved",
    color: "#9a4c14",
    verified: true,
  },
  {
    id: 4,
    quote: "The absolute precision with citations makes this indispensable. It completely outclasses legacy search platforms for academic queries. Nothing comes close.",
    author: "Dr. Elena Rostova",
    role: "Chief Scientist",
    org: "Stanford HAI",
    initials: "ER",
    metric: "12k papers analyzed",
    color: "#c7621a",
    verified: true,
  },
  {
    id: 5,
    quote: "I've tried every AI research tool on the market. Jigyaza is the only one that reasons through contradictions rather than averaging them away. Game-changing.",
    author: "Marcus Chen",
    role: "Principal Scientist",
    org: "OpenAI Research",
    initials: "MC",
    metric: "Zero hallucinations",
    color: "#e8943a",
    verified: true,
  },
  {
    id: 6,
    quote: "Our compliance team finally approved an AI tool because Jigyaza can trace every claim to a primary source. Regulatory-grade research is now possible at scale.",
    author: "Dr. Priya Sharma",
    role: "Head of AI Governance",
    org: "UNESCO AI",
    initials: "PS",
    metric: "100% traceable",
    color: "#9a4c14",
    verified: true,
  },
];

const STATS = [
  { label: 'Research queries answered', value: 2847193, suffix: '' },
  { label: 'Papers cited accurately', value: 99.4, suffix: '%', isDecimal: true },
  { label: 'Institutions using Jigyaza', value: 340, suffix: '+' },
  { label: 'Average accuracy score', value: 98.7, suffix: '%', isDecimal: true },
];

// ─── Canvas Neural Network ─────────────────────────────────────────────────
// Optimised: spatial grid (O(n·k) connections), IntersectionObserver-based pause,
// RAF-throttled mousemove, capped node count
const CELL_SIZE = 140;

function NeuralCanvas() {
  const canvasRef = useRef(null);
  const mouseRef  = useRef({ x: -9999, y: -9999 });
  const animRef   = useRef(null);
  const runRef    = useRef(true); // flipped by IntersectionObserver

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    let nodes = [];

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      buildNodes();
    };

    const buildNodes = () => {
      nodes = [];
      // Fewer nodes on small screens
      const density = window.innerWidth < 768 ? 18000 : 13000;
      const count   = Math.min(Math.floor((canvas.width * canvas.height) / density), 60);
      for (let i = 0; i < count; i++) {
        nodes.push({
          x:     Math.random() * canvas.width,
          y:     Math.random() * canvas.height,
          vx:    (Math.random() - 0.5) * 0.25,
          vy:    (Math.random() - 0.5) * 0.25,
          r:     Math.random() * 1.5 + 1,
          alpha: Math.random() * 0.4 + 0.1,
        });
      }
    };

    // ── Spatial grid: reduces O(n²) to O(n·k) ─────────────────────────────
    const buildGrid = () => {
      const grid = new Map();
      const cxCount = Math.ceil(canvas.width / CELL_SIZE);
      nodes.forEach((n, idx) => {
        const key = Math.floor(n.x / CELL_SIZE) + Math.floor(n.y / CELL_SIZE) * cxCount;
        if (!grid.has(key)) grid.set(key, []);
        grid.get(key).push(idx);
      });
      return { grid, cxCount };
    };

    const getNeighbors = (grid, cxCount, n) => {
      const gx = Math.floor(n.x / CELL_SIZE);
      const gy = Math.floor(n.y / CELL_SIZE);
      const result = [];
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const cell = grid.get((gx + dx) + (gy + dy) * cxCount);
          if (cell) result.push(...cell);
        }
      }
      return result;
    };
    // ──────────────────────────────────────────────────────────────────────

    const CONN_DIST    = 130;
    const CONN_DIST_SQ = CONN_DIST * CONN_DIST;

    const draw = () => {
      animRef.current = requestAnimationFrame(draw);
      if (!runRef.current) return; // paused when off-screen

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Move nodes
      nodes.forEach(n => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width)  n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;

        // Mouse repulsion (cheap bounding-box pre-check)
        const dx = n.x - mx;
        const dy = n.y - my;
        if (Math.abs(dx) < 120 && Math.abs(dy) < 120) {
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120 && dist > 0) {
            const force = (120 - dist) / 120 * 0.7;
            n.x += (dx / dist) * force;
            n.y += (dy / dist) * force;
          }
        }
      });

      // Draw nodes (single fillStyle set outside loop)
      ctx.fillStyle = 'rgba(199, 98, 26, 1)';
      nodes.forEach(n => {
        ctx.globalAlpha = n.alpha;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // Draw connections via spatial grid
      const { grid, cxCount } = buildGrid();
      const drawn = new Set();
      ctx.strokeStyle = 'rgba(199, 98, 26, 1)';
      ctx.lineWidth   = 0.8;
      nodes.forEach((ni, i) => {
        getNeighbors(grid, cxCount, ni).forEach(j => {
          if (j <= i) return;
          const pairKey = i * 1000 + j; // cheaper than string concat
          if (drawn.has(pairKey)) return;
          drawn.add(pairKey);
          const nj = nodes[j];
          const dx = ni.x - nj.x;
          const dy = ni.y - nj.y;
          const dSq = dx * dx + dy * dy;
          if (dSq < CONN_DIST_SQ) {
            ctx.globalAlpha = (1 - Math.sqrt(dSq) / CONN_DIST) * 0.1;
            ctx.beginPath();
            ctx.moveTo(ni.x, ni.y);
            ctx.lineTo(nj.x, nj.y);
            ctx.stroke();
          }
        });
      });
      ctx.globalAlpha = 1;
    };

    // RAF-throttled mouse handler
    let mouseSched = false;
    const handleMouse = (e) => {
      if (mouseSched) return;
      mouseSched = true;
      requestAnimationFrame(() => {
        const rect = canvas.getBoundingClientRect();
        mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        mouseSched = false;
      });
    };

    resize();
    animRef.current = requestAnimationFrame(draw);

    // Pause the draw loop when the canvas isn't visible
    const visObs = new IntersectionObserver(
      ([entry]) => { runRef.current = entry.isIntersecting; },
      { threshold: 0 }
    );
    visObs.observe(canvas);

    const resizeObs = new ResizeObserver(resize);
    resizeObs.observe(canvas);

    canvas.addEventListener('mousemove', handleMouse, { passive: true });
    canvas.addEventListener('mouseleave', () => { mouseRef.current = { x: -9999, y: -9999 }; });

    return () => {
      cancelAnimationFrame(animRef.current);
      visObs.disconnect();
      resizeObs.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="testi-neural-canvas" />;
}

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedCounter({ value, suffix, isDecimal }) {
  const [display, setDisplay] = useState(0);
  const ref       = useRef(null);
  const triggered = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered.current) {
          triggered.current = true;
          const duration = 1800;
          const start    = performance.now();
          const animate  = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased    = 1 - Math.pow(1 - progress, 4);
            setDisplay(isDecimal
              ? parseFloat((eased * value).toFixed(1))
              : Math.floor(eased * value)
            );
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, isDecimal]);

  return (
    <span ref={ref}>
      {isDecimal ? display.toFixed(1) : display.toLocaleString()}{suffix}
    </span>
  );
}

// ─── Testimonial Card ─────────────────────────────────────────────────────────
// memo() prevents re-renders when sibling cards change activeIndex
const TestimonialCard = memo(function TestimonialCard({ t, index, activeIndex, onActivate }) {
  const cardRef = useRef(null);
  const isActive = activeIndex === index;

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
    cardRef.current.style.setProperty('--tx', `${x * 7}deg`);
    cardRef.current.style.setProperty('--ty', `${y * -7}deg`);
    cardRef.current.style.setProperty('--sx', `${e.clientX - rect.left}px`);
    cardRef.current.style.setProperty('--sy', `${e.clientY - rect.top}px`);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty('--tx', '0deg');
    cardRef.current.style.setProperty('--ty', '0deg');
    cardRef.current.style.setProperty('--sx', '-9999px');
    cardRef.current.style.setProperty('--sy', '-9999px');
  }, []);

  return (
    <div
      ref={cardRef}
      className={`tc-card ${isActive ? 'tc-card--active' : ''}`}
      style={{ '--accent': t.color, '--delay': `${index * 0.12}s` }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onActivate(index)}
    >
      {/* Spotlight layer */}
      <div className="tc-card__spotlight" />

      {/* Verification badge */}
      {t.verified && (
        <div className="tc-card__verified">
          <span className="material-symbols-outlined">verified</span>
          <span>Verified user</span>
        </div>
      )}

      {/* Quote mark */}
      <div className="tc-card__decorq">&ldquo;</div>

      {/* Quote */}
      <p className="tc-card__quote">{t.quote}</p>

      {/* Impact metric */}
      <div className="tc-card__metric">
        <span className="material-symbols-outlined tc-card__metric-icon">trending_up</span>
        <span className="tc-card__metric-value">{t.metric}</span>
      </div>

      {/* Author */}
      <div className="tc-card__author">
        <div className="tc-card__avatar">
          <span>{t.initials}</span>
          <div className="tc-card__avatar-ring" />
        </div>
        <div className="tc-card__author-info">
          <div className="tc-card__author-name">{t.author}</div>
          <div className="tc-card__author-role">
            {t.role} · <span className="tc-card__author-org">{t.org}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Testimonials() {
  const [activeIndex,  setActiveIndex]  = useState(null);
  const [visibleCards, setVisibleCards] = useState([]);
  const sectionRef = useRef(null);
  const tickerRef  = useRef(null); // kept for JSX ref; ticker now uses CSS marquee

  // Staggered card reveal on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            TESTIMONIALS.forEach((_, i) => {
              setTimeout(() => {
                setVisibleCards(prev => [...new Set([...prev, i])]);
              }, i * 130);
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleActivate = useCallback((idx) => {
    setActiveIndex(prev => prev === idx ? null : idx);
  }, []);

  return (
    <section className="testimonials-v2 section" ref={sectionRef}>
      {/* ── Ambient neural background ── */}
      <NeuralCanvas />

      {/* ── Atmosphere glows ── */}
      <div className="tv2-glow tv2-glow--a" />
      <div className="tv2-glow tv2-glow--b" />
      <div className="tv2-glow tv2-glow--c" />

      {/* ── Grid line overlay ── */}
      <div className="tv2-grid" />

      <div className="max-w tv2-inner">
        {/* ── Section header ── */}
        <div className="tv2-header reveal">
          <div className="tv2-eyebrow">
            <span className="tv2-eyebrow__dot" />
            <span className="tv2-eyebrow__label">Field Intelligence</span>
            <div className="tv2-eyebrow__line" />
          </div>

          <h2 className="tv2-title font-serif">
            The researchers who{' '}
            <span className="tv2-title__accent">rewrote</span>
            <br />
            what's possible.
          </h2>

          <p className="tv2-subtitle font-mono">
            Not cherry-picked. Not paid placements.{' '}
            <span className="tv2-subtitle__highlight">Real scientists. Real breakthroughs.</span>
          </p>
        </div>

        {/* ── Live stats bar ── */}
        <div className="tv2-stats">
          {STATS.map((s, i) => (
            <div key={i} className="tv2-stat">
              <div className="tv2-stat__value font-serif">
                <AnimatedCounter value={s.value} suffix={s.suffix} isDecimal={s.isDecimal} />
              </div>
              <div className="tv2-stat__label font-mono">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Cards grid ── */}
        <div className="tv2-cards">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.id}
              className={`tv2-card-wrapper ${visibleCards.includes(i) ? 'tv2-card-wrapper--visible' : ''}`}
              style={{ '--delay': `${i * 0.1}s` }}
            >
              <TestimonialCard
                t={t}
                index={i}
                activeIndex={activeIndex}
                onActivate={handleActivate}
              />
            </div>
          ))}
        </div>

        {/* ── Infinite ticker — driven by CSS marquee animation (no JS RAF) ── */}
        <div className="tv2-ticker-wrap">
          <div className="tv2-ticker-fade tv2-ticker-fade--left" />
          <div className="tv2-ticker-fade tv2-ticker-fade--right" />
          <div className="tv2-ticker-track">
            <div className="tv2-ticker-inner tv2-ticker-inner--css" ref={tickerRef}>
              {/* Duplicated 4× so the loop is seamless */}
              {[...Array(4)].flatMap((_, outerIdx) =>
                TESTIMONIALS.map((t, i) => (
                  <div key={`${outerIdx}-${t.id}`} className="tv2-ticker-item font-mono">
                    <span className="material-symbols-outlined tv2-ticker-star">star</span>
                    <span className="tv2-ticker-author">{t.author}</span>
                    <span className="tv2-ticker-sep">·</span>
                    <span className="tv2-ticker-metric">{t.metric}</span>
                    <span className="tv2-ticker-sep">·</span>
                    <span className="tv2-ticker-org">{t.org}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ── Bottom CTA ── */}
        <div className="tv2-bottom reveal">
          <div className="tv2-bottom__avatars">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.id}
                className="tv2-bottom__avatar"
                style={{ '--accent': t.color, '--i': i, zIndex: TESTIMONIALS.length - i }}
              >
                {t.initials}
              </div>
            ))}
          </div>
          <p className="tv2-bottom__text font-mono">
            Join <strong>340+ institutions</strong> reshaping how humanity finds truth.
          </p>
        </div>
      </div>
    </section>
  );
}
