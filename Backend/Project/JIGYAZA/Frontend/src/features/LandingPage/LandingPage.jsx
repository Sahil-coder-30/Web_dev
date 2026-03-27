import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './LandingPage.scss';
import Loder from '../../components/Loaders/loder/Loder';
import TerminalWindow from '../../components/TerminalWindow/TerminalWindow';
import HeroLogoBg from '../../components/HeroLogoBg/HeroLogoBg';
import Testimonials from '../../components/Testimonials/Testimonials';

gsap.registerPlugin(ScrollTrigger);

// ── Perf util: wrap any callback in a RAF-throttled handler ──────
function rafThrottle(fn) {
  let scheduled = false;
  return function (...args) {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      fn.apply(this, args);
      scheduled = false;
    });
  };
}

// Detect user's motion preference once at module-load time
const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ─── Premium Pricing Section ────────────────────────────────────────────────
const PLANS = [
  {
    id: 'researcher',
    tier: 'Researcher',
    tagline: 'For solo explorers & students',
    monthlyPrice: 0,
    annualPrice: 0,
    priceNote: 'Beta Access · Free forever',
    cta: 'Start for Free',
    ctaVariant: 'ghost',
    badge: null,
    features: [
      { icon: 'search', label: '100 queries per day', included: true },
      { icon: 'language', label: 'Live Web Access', included: true },
      { icon: 'smart_toy', label: 'Standard AI Reasoning', included: true },
      { icon: 'history', label: '7-day query history', included: true },
      { icon: 'upload_file', label: 'PDF & Document Uploads', included: false },
      { icon: 'groups', label: 'Team Workspaces', included: false },
      { icon: 'api', label: 'API Access', included: false },
      { icon: 'support_agent', label: 'Priority Support', included: false },
    ],
  },
  {
    id: 'pro',
    tier: 'Pro',
    tagline: 'For power researchers & analysts',
    monthlyPrice: 29,
    annualPrice: 23,
    priceNote: 'per seat / month',
    cta: 'Start 14-day Free Trial',
    ctaVariant: 'solid',
    badge: 'Most Popular',
    features: [
      { icon: 'search', label: 'Unlimited daily queries', included: true },
      { icon: 'language', label: 'Live Web Access', included: true },
      { icon: 'psychology', label: 'Enhanced Multi-Agent Reasoning', included: true },
      { icon: 'history', label: '90-day query history', included: true },
      { icon: 'upload_file', label: '1,000-page PDF Uploads', included: true },
      { icon: 'groups', label: 'Team Workspaces (up to 5)', included: true },
      { icon: 'api', label: 'API Access (10k calls/mo)', included: false },
      { icon: 'support_agent', label: 'Priority Support', included: false },
    ],
  },
  {
    id: 'enterprise',
    tier: 'Enterprise',
    tagline: 'For institutions & large teams',
    monthlyPrice: 99,
    annualPrice: 79,
    priceNote: 'per seat / month',
    cta: 'Request Demo',
    ctaVariant: 'outline',
    badge: null,
    features: [
      { icon: 'search', label: 'Unlimited daily queries', included: true },
      { icon: 'language', label: 'Live Web Access', included: true },
      { icon: 'psychology', label: 'Custom Multi-Agent Logic', included: true },
      { icon: 'history', label: 'Unlimited query history', included: true },
      { icon: 'upload_file', label: '5,000-page PDF dataset uploads', included: true },
      { icon: 'groups', label: 'Unlimited Team Workspaces', included: true },
      { icon: 'api', label: 'Dedicated API (no rate limit)', included: true },
      { icon: 'support_agent', label: 'Dedicated Success Manager', included: true },
    ],
  },
];

const PricingSection = ({ navigate }) => {
  const [annual, setAnnual] = useState(false);
  const cardRefs = useRef([]);

  // Throttle card tilt to once-per-frame to avoid layout thrashing
  const handleCardMouseMove = rafThrottle((e, idx) => {
    const card = cardRefs.current[idx];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    card.style.setProperty('--tilt-x', `${y * -8}deg`);
    card.style.setProperty('--tilt-y', `${x * 8}deg`);
    card.style.setProperty('--spotlight-x', `${e.clientX - rect.left}px`);
    card.style.setProperty('--spotlight-y', `${e.clientY - rect.top}px`);
  });

  const handleCardMouseLeave = (idx) => {
    const card = cardRefs.current[idx];
    if (!card) return;
    card.style.setProperty('--tilt-x', '0deg');
    card.style.setProperty('--tilt-y', '0deg');
    card.style.setProperty('--spotlight-x', '-9999px');
    card.style.setProperty('--spotlight-y', '-9999px');
  };

  return (
    <section className="pricing-section section">
      {/* ── Ambient background pulses ── */}
      <div className="pricing-bg">
        <div className="pricing-glow pricing-glow--left" />
        <div className="pricing-glow pricing-glow--right" />
        <div className="pricing-grid-overlay" />
      </div>

      <div className="max-w">
        {/* Header */}
        <div className="pricing-header reveal">
          <div className="pricing-eyebrow">
            <span className="eyebrow-dot" />
            <span className="font-mono text-hub-primary" style={{ fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
              Pricing Protocols
            </span>
          </div>
          <h2 className="font-serif" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontStyle: 'italic', marginBottom: '1rem', lineHeight: 1.1 }}>
            Choose your <span className="text-hub-primary">compute level</span>
          </h2>
          <p className="font-sans text-hub-text-muted" style={{ maxWidth: '36rem', margin: '0 auto', lineHeight: 1.7 }}>
            From individual researchers to enterprise institutions — every plan includes our core multi-agent truth-seeking engine.
          </p>

          {/* Billing Toggle */}
          <div className="billing-toggle reveal">
            <span className={`billing-label font-mono ${!annual ? 'active' : ''}`}>Monthly</span>
            <button
              id="billing-toggle-btn"
              className={`toggle-pill ${annual ? 'annual' : ''}`}
              onClick={() => setAnnual(v => !v)}
              aria-label="Toggle annual billing"
            >
              <span className="toggle-thumb" />
            </button>
            <span className={`billing-label font-mono ${annual ? 'active' : ''}`}>
              Annual
              <span className="save-badge">Save 20%</span>
            </span>
          </div>
        </div>

        {/* Cards */}
        <div className="pricing-grid-3">
          {PLANS.map((plan, idx) => {
            const isPro = plan.id === 'pro';
            const displayPrice = annual ? plan.annualPrice : plan.monthlyPrice;
            return (
              <div
                key={plan.id}
                id={`pricing-card-${plan.id}`}
                ref={el => cardRefs.current[idx] = el}
                className={`pricing-card-v2 reveal ${isPro ? 'is-pro' : ''}`}
                onMouseMove={e => handleCardMouseMove(e, idx)}
                onMouseLeave={() => handleCardMouseLeave(idx)}
              >
                {/* Animated border gradient */}
                {isPro && <div className="card-border-glow" />}

                {/* Card inner spotlight */}
                <div className="card-spotlight" />

                {/* Badge */}
                {plan.badge && (
                  <div className="plan-badge">
                    <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>star</span>
                    {plan.badge}
                  </div>
                )}

                {/* Tier label */}
                <div className="plan-tier font-mono">{plan.tier}</div>
                <div className="plan-tagline font-sans text-hub-text-muted">{plan.tagline}</div>

                {/* Price display */}
                <div className="plan-price-block">
                  <div className="plan-price font-serif">
                    {plan.monthlyPrice === 0 ? (
                      <span className="price-value">Free</span>
                    ) : (
                      <>
                        <span className="price-dollar">$</span>
                        <span className="price-value">{displayPrice}</span>
                        <span className="price-period font-sans text-hub-text-muted">/mo</span>
                      </>
                    )}
                  </div>
                  {annual && plan.monthlyPrice > 0 && (
                    <div className="price-original font-mono text-hub-text-muted">
                      <span style={{ textDecoration: 'line-through' }}>${plan.monthlyPrice}</span>
                      <span className="annual-saving">billed annually</span>
                    </div>
                  )}
                  <p className="plan-price-note font-mono">{plan.priceNote}</p>
                </div>

                {/* Divider */}
                <div className="plan-divider" />

                {/* Features */}
                <ul className="plan-features">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className={`plan-feature ${f.included ? 'included' : 'excluded'}`}>
                      <span className={`feature-icon-wrap ${f.included ? 'icon-check' : 'icon-cross'}`}>
                        <span className="material-symbols-outlined">{f.included ? 'check' : 'close'}</span>
                      </span>
                      <span className="feature-label font-sans">{f.label}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  id={`plan-cta-${plan.id}`}
                  className={`plan-cta font-mono plan-cta--${plan.ctaVariant}`}
                  onClick={() => navigate(plan.monthlyPrice === 0 || plan.id === 'pro' ? '/register' : '/login')}
                >
                  <span>{plan.cta}</span>
                  <span className="material-symbols-outlined plan-cta-icon">arrow_forward</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Bottom trust strip */}
        <div className="pricing-trust reveal">
          {[
            { icon: 'lock', text: 'SOC 2 Type II Certified' },
            { icon: 'credit_card_off', text: 'No credit card required for Free' },
            { icon: 'cancel', text: 'Cancel anytime' },
            { icon: 'speed', text: '99.9% uptime SLA' },
          ].map((item, i) => (
            <div key={i} className="trust-item font-mono">
              <span className="material-symbols-outlined trust-icon">{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
// ────────────────────────────────────────────────────────────────────────────

const LandingPage = ({ isReady = true }) => {
  const navigate = useNavigate();
  const heroLogoBgRef = useRef(null);
  const navProgressRef = useRef(null);
  const navClockRef   = useRef(null);
  const sessionId = useRef(
    Math.random().toString(36).substr(2, 4).toUpperCase() + '-' +
    Math.random().toString(36).substr(2, 4).toUpperCase()
  );
  
  // Scroll progress bar + navbar class toggle — direct DOM writes, zero React re-renders
  useEffect(() => {
    const navbar = document.querySelector('.navbar');
    const onScroll = () => {
      // Progress bar
      if (navProgressRef.current) {
        const docH = document.documentElement.scrollHeight - window.innerHeight;
        const pct  = docH > 0 ? (window.scrollY / docH) * 100 : 0;
        navProgressRef.current.style.width = `${pct}%`;
      }
      // Navbar scroll state — single class toggle drives all CSS transitions
      if (navbar) {
        if (window.scrollY > 40) navbar.classList.add('navbar--scrolled');
        else                     navbar.classList.remove('navbar--scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Live UTC clock — direct DOM write, zero React setState overhead
  useEffect(() => {
    const tick = () => {
      if (!navClockRef.current) return;
      const d = new Date();
      const hh = String(d.getUTCHours()).padStart(2, '0');
      const mm = String(d.getUTCMinutes()).padStart(2, '0');
      const ss = String(d.getUTCSeconds()).padStart(2, '0');
      navClockRef.current.textContent = `${hh}:${mm}:${ss} UTC`;
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    // ── Double-rAF: guarantees the browser has committed the first paint to screen
    // before GSAP starts competing with it. Without this, JS animation setup runs
    // during the same frame as First Contentful Paint, causing visible stutter.
    let rafId1, rafId2, timeoutId;
    rafId1 = requestAnimationFrame(() => {
      rafId2 = requestAnimationFrame(() => {
        startAnimations();
      });
    });

    function startAnimations() {
      // 1. Hero Entrance Animations
      const tl = gsap.timeline();

      tl.fromTo('.navbar',
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power4.out' }
      );
      tl.fromTo('.nav-link-item',
        { opacity: 0, y: -8 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' },
        '-=0.5'
      );
      tl.fromTo('.nav-cta-group',
        { opacity: 0, x: 10 },
        { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out' },
        '-=0.4'
      );

      // Navbar scroll: CSS class toggle (handled in scroll useEffect above).
      // GSAP ScrollTrigger scrub removed — it ran on every scroll pixel.

      // Hero text entrance — add class directly to .content so the SCSS
      // &.content--visible selector resolves correctly (no ancestor selector needed).
      document.querySelector('.hero-section .content')?.classList.add('content--visible');

      // 2. Scroll-reveal — IntersectionObserver + CSS transition.
      // No GSAP ScrollTrigger needed; transitions are compositor-driven like the hero fade.
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('reveal--visible');
              revealObserver.unobserve(entry.target); // fire once, then stop watching
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );
      document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

      // 3. Hero Logo Assembly
      // ── Replaced huge pixel fly-ins (y:±550, x:±480) with opacity+scale+small-translate.
      // Large positional animations require the browser to compute transform matrices on
      // 5 elements simultaneously for 1.5s, which was the main source of initial-load jank.
      if (heroLogoBgRef.current) {
        gsap.set(heroLogoBgRef.current, { xPercent: -50, yPercent: -50, opacity: 0 });

        // Subtle directional hints — just 40px instead of 480-550px
        gsap.set('#hlb-l1', { y: -40,       scale: 0.85, opacity: 0 });
        gsap.set('#hlb-l2', { x: 30, y: -30, scale: 0.85, opacity: 0 });
        gsap.set('#hlb-l3', { x: -30, y: 30, scale: 0.85, opacity: 0 });
        gsap.set('#hlb-l4', { y: 40,        scale: 0.85, opacity: 0 });
        gsap.set('#hlb-l5', { scale: 0.6,   opacity: 0, transformOrigin: '50% 50%' });

        const logoTl = gsap.timeline({ delay: 0.6 }); // slightly earlier since entrance is lighter

        logoTl
          .to(heroLogoBgRef.current, { opacity: 1, duration: 0.1 })
          .to('#hlb-l1', { y: 0, scale: 1, opacity: 1, duration: 1.1, ease: 'power3.out' }, '<')
          .to('#hlb-l2', { x: 0, y: 0, scale: 1, opacity: 1, duration: 1.1, ease: 'power3.out' }, '<0.05')
          .to('#hlb-l3', { x: 0, y: 0, scale: 1, opacity: 1, duration: 1.1, ease: 'power3.out' }, '<')
          .to('#hlb-l4', { y: 0, scale: 1, opacity: 1, duration: 1.1, ease: 'power3.out' }, '<0.05')
          .to('#hlb-l5', { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.4)' }, '-=0.3')
          // Brief glow-flash on lock
          .to('#hlb-l1,#hlb-l2,#hlb-l3,#hlb-l4,#hlb-l5', { opacity: 0.85, duration: 0.12, ease: 'power2.in' })
          .to('#hlb-l1,#hlb-l2,#hlb-l3,#hlb-l4,#hlb-l5', { opacity: 1,    duration: 0.3,  ease: 'power2.out' })
          // After assembly: perpetual slow spin + breathe
          .add(() => {
            if (!prefersReducedMotion) {
              gsap.to(heroLogoBgRef.current, { rotation: 360, transformOrigin: '50% 50%', duration: 100, repeat: -1, ease: 'none' });
              gsap.to(heroLogoBgRef.current, { opacity: 0.07, duration: 10, yoyo: true, repeat: -1, ease: 'sine.inOut' });
            }
          }, '+=0.2');
      }
    }

    return () => {
      cancelAnimationFrame(rafId1);
      cancelAnimationFrame(rafId2);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [isReady]);

  return (
    <div className="landing-page">
      {/* ═══════════════════════════════════════════
           MISSION CONTROL NAVBAR
      ═══════════════════════════════════════════ */}
      <nav className="navbar">

        {/* ── TOP STATUS STRIP ── */}
        <div className="nav-strip">
          <div className="strip-left font-mono">
            <span className="strip-indicator">
              <span className="strip-dot" />
              SYSTEM ONLINE
            </span>
            <span className="strip-sep">│</span>
            <span className="strip-item">MULTI-AGENT ENGINE: ACTIVE</span>
            <span className="strip-sep">│</span>
            <span className="strip-item">nodes: 12 / 12 ready</span>
          </div>
          <div className="strip-right font-mono">
            <span className="strip-item">SESSION {sessionId.current}</span>
            <span className="strip-sep">│</span>
            {/* Direct DOM ref — no React setState overhead on every tick */}
            <span className="strip-clock" ref={navClockRef} />
            <span className="strip-sep">│</span>
            <span className="strip-item">v2.4.1</span>
          </div>
        </div>

        {/* ── MAIN BAR ── */}
        <div className="nav-main">

          {/* Left: logo */}
          <div className="nav-left" onClick={() => navigate('/')}>
            <div className="logo">
              <div className="logo-icon-wrap">
                <Loder size={30} color="#c7621a" />
                <div className="logo-ring" />
              </div>
              <div className="logo-text">
                <span className="logo-wordmark">Jigyaza</span>
                <span className="logo-sub font-mono">Research Engine</span>
              </div>
            </div>
          </div>

          {/* Center: numbered magnetic nav links */}
          <div className="nav-links">
            {[
              ['Technology', 'technology'],
              ['Manifesto',  'manifesto'],
              ['Pricing',    'pricing'   ],
            ].map(([label, sectionId], i) => (
              <a
                key={label}
                className="nav-link-item"
                href={`#${sectionId}`}
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.getElementById(sectionId);
                  if (!target) return;
                  const navH = document.querySelector('.navbar')?.offsetHeight ?? 72;
                  const top  = target.getBoundingClientRect().top + window.scrollY - navH;
                  window.scrollTo({ top, behavior: 'smooth' });
                }}
              >
                <span className="nav-num font-mono">0{i + 1}</span>
                <span className="nav-label">{label}</span>
                <span className="nav-underline" />
              </a>
            ))}
          </div>

          {/* Right: CTAs */}
          <div className="nav-cta-group">
            <button className="nav-btn-ghost font-mono" onClick={() => navigate('/login')}>Sign In</button>
            <button className="nav-btn-solid font-mono" onClick={() => navigate('/register')}>
              <span className="btn-pulse-dot" />
              <span>Initialize Engine</span>
              <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>rocket_launch</span>
            </button>
          </div>
        </div>

        {/* ── SCROLL PROGRESS BAR ── */}
        <div className="nav-progress-bar">
          <div className="nav-progress-fill" ref={navProgressRef} />
        </div>

      </nav>

      <section className="hero-section mesh-gradient">
        <div className="bg-elements">
          <div className="glow"></div>
          <div className="dots"></div>
          <div className="grid-overlay"></div>
          {/* ── Hero logo: 5 layers fly in from different directions then spin ── */}
          <div className="hero-logo-bg" ref={heroLogoBgRef}>
            <HeroLogoBg />
          </div>
          <div className="sparkle-container">
            {/* Random stars/sparkles similar to login */}
            <div className="sparkle-dot" style={{ top: '20%', left: '15%', width: '4px', height: '4px', animationDelay: '0s' }}></div>
            <div className="sparkle-dot" style={{ top: '60%', left: '80%', width: '3px', height: '3px', animationDelay: '1s' }}></div>
            <div className="sparkle-dot" style={{ top: '40%', left: '85%', width: '5px', height: '5px', animationDelay: '0.5s' }}></div>
            <div className="sparkle-dot" style={{ top: '75%', left: '25%', width: '3px', height: '3px', animationDelay: '1.5s' }}></div>
            <div className="sparkle-dot" style={{ top: '30%', left: '60%', width: '4px', height: '4px', animationDelay: '0.8s' }}></div>
            <div className="sparkle-dot" style={{ top: '10%', left: '50%', width: '6px', height: '6px', animationDelay: '1.1s' }}></div>
            <div className="sparkle-dot" style={{ top: '85%', left: '15%', width: '4px', height: '4px', animationDelay: '0.3s' }}></div>
            <div className="sparkle-dot" style={{ top: '55%', left: '35%', width: '3px', height: '3px', animationDelay: '0.9s' }}></div>
            <div className="sparkle-dot" style={{ top: '25%', left: '75%', width: '5px', height: '5px', animationDelay: '1.7s' }}></div>
            <span className="sparkle-icon material-symbols-outlined" style={{ top: '80%', left: '70%', animationDelay: '0.2s' }}>temp_preferences_custom</span>
            <span className="sparkle-icon material-symbols-outlined" style={{ top: '15%', left: '40%', animationDelay: '1.2s' }}>sparkles</span>
            <span className="sparkle-icon material-symbols-outlined" style={{ top: '50%', left: '10%', animationDelay: '0.7s' }}>magic_button</span>
            <span className="sparkle-icon material-symbols-outlined" style={{ top: '20%', left: '90%', animationDelay: '0.5s' }}>emergency</span>
          </div>
        </div>
        <div className="content">
          <div className="version-tag">SYSTEM ONLINE // v.2.4.1</div>
          <h1 className="font-serif hover-glow">
            The internet knows the answer. <br/>
            <span className="text-hub-primary" style={{fontStyle: 'italic'}}>Jigyaza</span> computes it for you.
          </h1>
          <p className="hero-description text-hub-text-muted">
            The world's first autonomous AI research engine that doesn't just synthesize text, but formally proves it via live multi-agent truth-seeking algorithms.
          </p>
          <div className="actions">
            <button className="cta-btn glow-primary" onClick={() => navigate('/login')}>
              <span className="btn-text">Initialize Search Engine</span>
              <span className="material-symbols-outlined ml-2">rocket_launch</span>
            </button>
            <p className="subtitle font-mono text-hub-text-muted">No waitlist. Available now for Enterprise.</p>
          </div>
        </div>
      </section>

      {/* Technology: AI demo terminal — id used by navbar anchor */}
      <section id="technology" className="demo-section">
        <div className="max-w reveal">
          <TerminalWindow />
        </div>
      </section>

      {/* Pricing section — id used by navbar anchor */}
      <div id="pricing">
        <PricingSection navigate={navigate} />
      </div>

      {/* Manifesto: testimonials / mission intelligence — id used by navbar anchor */}
      {/* Negative margin pulls it up into the pricing section's gradient fade */}
      <div id="manifesto" style={{ marginTop: '-80px', position: 'relative', zIndex: 1 }}>
        <Testimonials />
      </div>

      {/* Removed features, grid, architecture, stats, comparison, cta sections */}

      <footer className="footer">
        <div className="max-w footer-grid">
          <div className="brand-col">
            <div className="logo mb-6">
              <Loder size={32} color="#c7621a" />
              <span className="font-serif font-bold text-2xl ml-2">Jigyaza</span>
            </div>
            <p>The next generation of computational research. Built for precision.</p>
          </div>
          <div className="links-col">
            <h5>Product</h5>
            <ul>
              <li><a href="#pricing" onClick={(e) => { e.preventDefault(); const t = document.getElementById('pricing'); const navH = document.querySelector('.navbar')?.offsetHeight ?? 72; if(t) window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' }); }}>Pricing</a></li>
              <li><a href="#">API Access</a></li>
              <li><a href="#">Enterprise</a></li>
            </ul>
          </div>
          <div className="links-col">
            <h5>Company</h5>
            <ul>
              <li><a href="#">About</a></li>
              <li><a href="#">Research</a></li>
              <li><a href="#">Careers</a></li>
            </ul>
          </div>
          <div className="links-col">
            <h5>Legal</h5>
            <ul>
              <li><a href="#">Privacy</a></li>
              <li><a href="#">Ethics</a></li>
              <li><a href="#">Security</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w footer-bottom">
          <div style={{fontWeight:700}}>© 1 April 2026 JAGYAZA INTELLIGENCE CORP.</div>
          <div className="socials">
            <a href="#">X / TWITTER</a>
            <a href="#">LINKEDIN</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default LandingPage;
