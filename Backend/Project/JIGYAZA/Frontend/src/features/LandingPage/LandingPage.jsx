import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './LandingPage.scss';
import Loder from '../../components/Loaders/loder/Loder';

gsap.registerPlugin(ScrollTrigger);

const TerminalDemo = () => {
  const [lines, setLines] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const cycle = [
      { text: "> Authenticating user session...", isPrompt: true, delay: 500 },
      { text: "[OK] Session secured. E2E active.", delay: 300 },
      { text: "> Initiating query sequence: Q_TRANSFORMER_04", isPrompt: true, delay: 600 },
      { text: "Spawning Agent Swarm (n=4)", delay: 300 },
      { text: "Agent 1: Fetching recent papers from IEEE...", delay: 400 },
      { text: "Agent 2: Analyzing GitHub repositories for implementation trends...", delay: 500 },
      { text: "Agent 3: Validating statistical models against known benchmarks...", delay: 600 },
      { text: "Agent 4: Checking logical consistency of findings...", delay: 500 },
      { text: "WARN: Conflict detected in source [MIT_Arxiv_24b]", delay: 800, isWarn: true },
      { text: "Agent 1: Re-evaluating conflicting data...", delay: 600 },
      { text: "Agent 4: Source flagged as unverified. Excluding from consensus.", delay: 500 },
      { text: "[OK] Consensus aligned. Confidence score: 99.4%", isSuccess: true, delay: 400 },
      { text: "Structuring output payload...", delay: 300 },
      { text: "----------------------------------------", delay: 200 },
      { text: "[SYTHESIS OUTPUT]", isSuccess: true, delay: 300 },
      { text: "Transformer models are a type of neural network architecture that rely on self-attention mechanisms to weigh the significance of different parts of input data.", isResponse: true, delay: 800 },
      { text: "Unlike previous sequential models, transformers process data in parallel, allowing for significant efficiency gains.", isResponse: true, delay: 800 },
      { text: "Through global dependencies, the architecture avoids vanishing gradient problems common in RNNs, enabling the training of models with hundreds of billions of parameters.", isResponse: true, delay: 800 },
      { text: "> SYSTEM_SLEEP (3s)", isPrompt: true, delay: 2000 },
      { text: "CLEAR", delay: 1000 }
    ];

    let isMounted = true;
    let index = 0;
    
    const runLoop = async () => {
      while (isMounted) {
        const line = cycle[index];
        if (line.text === "CLEAR") {
          await new Promise(r => setTimeout(r, line.delay || 1000));
          if (!isMounted) break;
          setLines([]);
          index = 0;
        } else {
          setLines(prev => [...prev, line]);
          index++;
        }
        
        // Auto-scroll
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }

        const waitTime = line.delay || 300;
        await new Promise(r => setTimeout(r, waitTime));
      }
    };
    runLoop();
    
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="main-content custom-scrollbar" ref={containerRef} style={{ scrollBehavior: 'smooth' }}>
      {lines.map((ln, i) => {
        if (ln.isResponse) {
           return <p key={i} style={{color: 'rgba(240, 237, 232, 0.9)', fontSize: '1.25rem', lineHeight: '1.625', marginBottom: '1.5rem', fontFamily: '"DM Sans", sans-serif'}}>{ln.text}</p>
        }
        if (ln.isPrompt) {
           return (
             <div key={i} className="prompt flex items-center mb-4 mt-2">
                <span className="text-hub-primary mr-2 font-mono font-bold">&gt;</span>
                <span className="prompt-text font-mono text-hub-primary font-bold text-sm tracking-wide">{ln.text}</span>
             </div>
           )
        }
        let color = '#8c8279'; // muted
        if (ln.isWarn) color = '#eab308';
        if (ln.isSuccess) color = '#22c55e';
        
        return (
          <div key={i} className="font-mono text-xs mb-2 tracking-wide" style={{ color }}>{ln.text}</div>
        )
      })}
      <div className="animate-pulse w-2 h-4 bg-hub-primary mt-2"></div>
    </div>
  );
};



const LandingPage = ({ isReady = true }) => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const footerRef = useRef(null);
  
  const handleFooterMouseMove = (e) => {
    if (!footerRef.current) return;
    const rect = footerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    footerRef.current.style.setProperty('--mouse-x', `${x}px`);
    footerRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  useEffect(() => {
    // Refined parallax for hero
    const handleMouseMove = (e) => {
      if (!heroRef.current) return;
      const amount = 15;
      const x = (e.clientX / window.innerWidth - 0.5) * amount;
      const y = (e.clientY / window.innerHeight - 0.5) * amount;
      heroRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // GSAP Timelines and ScrollTriggers
    if (isReady) {
      // 1. Hero Entrance Animations (Sequential delayed entry)
      const tl = gsap.timeline();
      
      tl.fromTo('.navbar',
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power4.out' }
      );
      
      const heroElements = [
        '.version-tag',
        '.hero-section h1',
        '.hero-description',
        '.actions'
      ];
      
      tl.fromTo(heroElements,
        { opacity: 0, y: 40, filter: 'blur(10px)', scale: 0.95 },
        { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1, duration: 1.2, stagger: 0.2, ease: 'power4.out', clearProps: 'all' },
        '-=0.8'
      );

      // 2. Scroll Animations using ScrollTrigger
      const revealElements = document.querySelectorAll('.reveal');
      revealElements.forEach(el => {
        gsap.fromTo(el,
          { opacity: 0, y: 60, scale: 0.95, filter: 'blur(8px)' },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none none' 
            },
            clearProps: 'all'
          }
        );
      });

      // 3. Demo Terminal replaced by React Component logic

      // 4. Testimonials Horizontal Scroll Animation
      const testimonialsSection = document.querySelector('.testimonials-section');
      const testimonialsGrid = document.querySelector('.testimonials-grid');
      
      if (testimonialsSection && testimonialsGrid) {
        // Find how far we need to slide to reveal all cards
        const getScrollAmount = () => {
          return -(testimonialsGrid.scrollWidth - window.innerWidth + 40); // 40 is padding
        };

        gsap.to(testimonialsGrid, {
          x: getScrollAmount,
          ease: "none",
          scrollTrigger: {
            trigger: testimonialsSection,
            pin: true,
            scrub: 1,
            start: "top top",
            end: () => `+=${testimonialsGrid.scrollWidth}`,
            invalidateOnRefresh: true
          }
        });
      }
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [isReady]);

  return (
    <div className="landing-page">
      <nav className="navbar">
        <div className="logo">
          <Loder size={32} color="#c7621a" />
          <span>Jagyaza</span>
        </div>
        <div className="nav-links">
          <a href="#">Technology</a>
          <a href="#">Manifesto</a>
          <a href="#">Pricing</a>
        </div>
        <button className="login-btn" onClick={() => navigate('/login')}>
          Login
        </button>
      </nav>

      <section className="hero-section mesh-gradient">
        <div className="bg-elements">
          <div className="glow"></div>
          <div className="dots"></div>
          <div className="grid-overlay"></div>
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
        <div className="content" ref={heroRef}>
          <div className="version-tag">SYSTEM ONLINE // v.2.4.1</div>
          <h1 className="font-serif hover-glow">
            The internet knows the answer. <br/>
            <span className="text-hub-primary" style={{fontStyle: 'italic'}}>Jagyaza</span> computes it for you.
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

      <section className="demo-section">
        <div className="max-w reveal glass-card demo-card">
          <div className="card-header">
            <div className="dot red"></div>
            <div className="dot yellow"></div>
            <div className="dot green"></div>
            <div className="title">jagyaza_research_environment v1.02</div>
          </div>
          <div className="card-body">
            <TerminalDemo />
            <div className="sidebar">
              <h4 className="sidebar-title">Verified Sources (12)</h4>
              <div className="source-list">
                <div className="source-item">
                  <div className="domain">ARXIV.ORG</div>
                  <div className="title">Attention Is All You Need</div>
                </div>
                <div className="source-item">
                  <div className="domain">NATURE.COM</div>
                  <div className="title">Deep Learning Evolution</div>
                </div>
                <div className="source-item">
                  <div className="domain">MIT.EDU</div>
                  <div className="title">Neural Architecture 2024</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pricing-section section">
        <div className="max-w">
          <div className="section-header text-center reveal">
            <h2 className="font-serif italic text-4xl mb-4 text-hub-primary">Pricing protocols</h2>
            <p className="text-hub-text-muted font-mono text-sm tracking-widest uppercase mb-16">Select your computing power</p>
          </div>
          
          <div className="pricing-grid">
            <div className="pricing-card glass-card reveal">
              <div className="card-header border-b border-hub-border pb-6 mb-6">
                <h3 className="font-mono text-lg uppercase tracking-wider text-hub-text-muted mb-2">Researcher</h3>
                <div className="price font-serif text-5xl mb-2">$0 <span className="text-lg text-hub-text-muted font-sans line-through opacity-50 ml-2">$29</span></div>
                <p className="font-sans text-sm text-hub-text-muted tracking-wide">Beta Access (Limited time)</p>
              </div>
              <ul className="features-list flex flex-col gap-4 font-sans text-sm text-hub-text-primary mb-8" style={{ padding: 0 }}>
                <li className="flex items-center gap-3"><span className="material-symbols-outlined text-hub-primary text-sm">check</span> 100 queries per day</li>
                <li className="flex items-center gap-3"><span className="material-symbols-outlined text-hub-primary text-sm">check</span> Live Web Access</li>
                <li className="flex items-center gap-3"><span className="material-symbols-outlined text-hub-primary text-sm">check</span> Standard multi-agent reasoning</li>
                <li className="flex items-center gap-3 text-hub-text-muted"><span className="material-symbols-outlined text-sm">close</span> PDF Uploads</li>
              </ul>
              <button className="w-full py-3 px-4 border border-hub-primary text-hub-primary rounded font-mono text-xs uppercase tracking-wider hover:bg-hub-primary hover:text-hub-black transition-colors" onClick={() => navigate('/register')}>Start Free Trial</button>
            </div>
            
            <div className="pricing-card glass-card reveal premium">
              <div className="absolute top-0 left-0 w-full h-1 bg-hub-primary"></div>
              <div className="card-header border-b border-hub-border pb-6 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-mono text-lg uppercase tracking-wider text-hub-primary">Enterprise</h3>
                  <span className="text-[10px] font-mono uppercase tracking-widest bg-[rgba(199,98,26,0.1)] text-hub-primary px-2 py-1 rounded">Recommended</span>
                </div>
                <div className="price font-serif text-5xl mb-2">$99<span className="text-lg text-hub-text-muted font-sans">/mo</span></div>
                <p className="font-sans text-sm text-hub-text-muted tracking-wide">For advanced research teams.</p>
              </div>
              <ul className="features-list flex flex-col gap-4 font-sans text-sm text-hub-text-primary mb-8" style={{ padding: 0 }}>
                <li className="flex items-center gap-3"><span className="material-symbols-outlined text-hub-primary text-sm">check</span> Unlimited queries</li>
                <li className="flex items-center gap-3"><span className="material-symbols-outlined text-hub-primary text-sm">check</span> 5,000 page PDF dataset uploads</li>
                <li className="flex items-center gap-3"><span className="material-symbols-outlined text-hub-primary text-sm">check</span> Enhanced custom multi-agent logic</li>
                <li className="flex items-center gap-3"><span className="material-symbols-outlined text-hub-primary text-sm">check</span> Priority API Access</li>
              </ul>
              <button className="w-full py-3 px-4 bg-hub-primary text-hub-black rounded font-mono text-xs uppercase tracking-wider hover:bg-hub-secondary transition-colors" onClick={() => navigate('/register')}>Upgrade to Enterprise</button>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials-section section">
        <div className="max-w">
          <div className="section-header text-center">
            <h2 className="font-serif italic text-4xl mb-4">Trusted by researchers</h2>
            <p className="text-hub-text-muted font-mono text-sm tracking-widest uppercase mb-16">Verified Data Processing</p>
          </div>
        </div>
        
        {/* Full-width container mapped for horizontal scroll */}
        <div className="testimonials-grid">
          <div className="testimonial-card glass-card">
            <div className="quote-icon material-symbols-outlined">format_quote</div>
            <p className="quote-text font-serif italic">Jagyaza doesn't hallucinate. It either provides the exact source, or admits the data isn't available. It's fundamentally changed our R&D cycle.</p>
            <div className="author-info flex gap-4 mt-8 pt-6 border-t border-hub-border">
              <div className="avatar bg-hub-surface flex items-center justify-center rounded-full w-10 h-10 border border-hub-border overflow-hidden">
                <span className="text-hub-primary font-mono text-xs">A.D</span>
              </div>
              <div>
                <h4 className="font-sans font-bold text-sm">Dr. Arthur Densmoore</h4>
                <p className="font-mono text-xs text-hub-text-muted mt-1 uppercase tracking-wider">Lead Researcher</p>
              </div>
            </div>
          </div>
          
          <div className="testimonial-card glass-card">
            <div className="quote-icon material-symbols-outlined absolute right-8 text-hub-border text-5xl">format_quote</div>
            <p className="quote-text font-serif italic">The Multi-Agent reasoning feature acts like having a board of PhDs arguing the nuances of my query in real-time before giving me the synthesis.</p>
            <div className="author-info flex gap-4 mt-8 pt-6 border-t border-hub-border">
              <div className="avatar bg-hub-surface flex items-center justify-center rounded-full w-10 h-10 border border-hub-border overflow-hidden">
                <span className="text-hub-primary font-mono text-xs">S.M</span>
              </div>
              <div>
                <h4 className="font-sans font-bold text-sm">Sarah Mitchell</h4>
                <p className="font-mono text-xs text-hub-text-muted mt-1 uppercase tracking-wider">Data Science Director</p>
              </div>
            </div>
          </div>
          
          <div className="testimonial-card glass-card">
            <div className="quote-icon material-symbols-outlined absolute right-8 text-hub-border text-5xl">format_quote</div>
            <p className="quote-text font-serif italic">Integrating Jagyaza into our workflow cut down preliminary research times by 60%. The multi-agent processing is incredibly robust.</p>
            <div className="author-info flex gap-4 mt-8 pt-6 border-t border-hub-border">
              <div className="avatar bg-hub-surface flex items-center justify-center rounded-full w-10 h-10 border border-hub-border overflow-hidden">
                <span className="text-hub-primary font-mono text-xs">J.K</span>
              </div>
              <div>
                <h4 className="font-sans font-bold text-sm">James K.</h4>
                <p className="font-mono text-xs text-hub-text-muted mt-1 uppercase tracking-wider">VP Engineering</p>
              </div>
            </div>
          </div>
          
          <div className="testimonial-card glass-card">
            <div className="quote-icon material-symbols-outlined">format_quote</div>
            <p className="quote-text font-serif italic">The absolute precision with references makes this an indispensable tool. It completely outclasses legacy search platforms for academic queries.</p>
            <div className="author-info flex gap-4 mt-8 pt-6 border-t border-hub-border">
              <div className="avatar bg-hub-surface flex items-center justify-center rounded-full w-10 h-10 border border-hub-border overflow-hidden">
                <span className="text-hub-primary font-mono text-xs">E.R</span>
              </div>
              <div>
                <h4 className="font-sans font-bold text-sm">Elena Rostova</h4>
                <p className="font-mono text-xs text-hub-text-muted mt-1 uppercase tracking-wider">Chief Scientist</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Removed features, grid, architecture, stats, comparison, cta sections */}

      <footer className="footer" ref={footerRef} onMouseMove={handleFooterMouseMove}>
        <div className="max-w footer-grid">
          <div className="brand-col">
            <div className="logo mb-6">
              <Loder size={32} color="#c7621a" />
              <span className="font-serif font-bold text-2xl ml-2">Jagyaza</span>
            </div>
            <p>The next generation of computational research. Built for precision.</p>
          </div>
          <div className="links-col">
            <h5>Product</h5>
            <ul>
              <li><a href="#">Pricing</a></li>
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
