import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './EntryLoader.scss';

const ACCENT       = '#C8621A';
const ACCENT_LIGHT = '#E8924A';
const TRACK        = '#1A1714';
const CORE_BG      = '#1C1510';

const TO = { transformOrigin: 'center', transformBox: 'view-box' };

const DESIGNATIONS = [
  'RESEARCHER',
  'ENTHUSIAST',
  'EXPLORER',
  'INNOVATOR',
  'VISIONARY',
  'SCHOLAR',
  'CREATOR'
];

/**
 * Entry sequence (GSAP) — 5 layers animate in staggered:
 *  1. Pulse rings       — scale 0 → 1, fade in
 *  2. Outer arcs        — scale 0 → 1, fade in
 *  3. Middle ring+ticks — scale 0 → 1, fade in
 *  4. Inner arcs        — scale 0 → 1, fade in
 *  5. Orbit dots + core — scale 0 → 1, fade in
 *
 * After each layer finishes entering, GSAP clears its inline transform
 * and adds `.is-active` — this enables the CSS loop animations.
 *
 * Props:
 *   onComplete — optional callback fired when all 5 layers have entered
 *                (use this to fade out the loader and reveal your app)
 */
export default function EntryLoader({ onComplete }) {
  const svgRef        = useRef(null);
  const pulseRingsRef = useRef(null);
  const outerArcsRef  = useRef(null);
  const middleRef     = useRef(null);
  const innerArcsRef  = useRef(null);
  const orbitCoreRef  = useRef(null);
  const progressTrackRef = useRef(null);
  const progressBarRef   = useRef(null);
  
  const [designation] = useState(() => DESIGNATIONS[Math.floor(Math.random() * DESIGNATIONS.length)]);
  
  // Word refs for staggering
  const word1Ref = useRef(null); // Welcome
  const word2Ref = useRef(null); // Designation

  useEffect(() => {
    const svg    = svgRef.current;
    const layers = [
      pulseRingsRef.current,
      outerArcsRef.current,
      middleRef.current,
      innerArcsRef.current,
      orbitCoreRef.current,
    ];

    // Start hidden
    gsap.set(svg,    { opacity: 0 });
    // Scale starts slightly larger to prevent a jarring "punch" out effect
    gsap.set(layers, { opacity: 0, scale: 0.75, svgOrigin: '110 110' });

    const tl = gsap.timeline({ onComplete: () => onComplete?.() });

    // Hide text initially below their clipping containers
    gsap.set(
      [word1Ref.current, word2Ref.current],
      { yPercent: 120 }
    );
    gsap.set(progressTrackRef.current, { opacity: 0, y: 10 });
    gsap.set(progressBarRef.current, { scaleX: 0, transformOrigin: 'left center' });

    tl.to(svg, { opacity: 1, duration: 0.01 });

    layers.forEach((layer, i) => {
      tl.to(
        layer,
        {
          opacity: 1,
          scale: 1,
          duration: 1.0, // Sped up from 1.6 (snappier, still elegant)
          ease: 'power3.out',
          svgOrigin: '110 110',
          onComplete: () => {
            gsap.set(layer, { clearProps: 'transform,opacity' });
            layer.classList.add('is-active');
          },
        },
        i * 0.3  // Faster stagger (0.3 down from 0.45)
      );
    });

    // Reveal Text faster (around 1.2s instead of 1.6s)
    tl.to(
      [word1Ref.current, word2Ref.current],
      { yPercent: 0, duration: 0.8, ease: 'power4.out', stagger: 0.1 },
      1.2
    );

    // Reveal progress track alongside text
    tl.to(
      progressTrackRef.current,
      { opacity: 1, y: 0, duration: 0.8, ease: 'power4.out' },
      1.3
    );

    // Animate progress bar filling up to 100% (finish exactly at exitStart)
    tl.to(
      progressBarRef.current,
      { scaleX: 1, duration: 1.8, ease: 'power2.inOut' },
      1.4
    );

    // --- EXIT SEQUENCE ---
    // At exactly 3.3s (after a snappy entrance) the exit sequence begins
    tl.add('exitStart', 3.3);

    // 1. Hide the text and progress track
    tl.to(
      [word2Ref.current, word1Ref.current], // reverse order
      { yPercent: 120, duration: 0.5, ease: 'power3.in', stagger: 0.05 },
      'exitStart'
    );
    tl.to(
      progressTrackRef.current,
      { opacity: 0, y: 10, duration: 0.5, ease: 'power3.in' },
      'exitStart+=0.05'
    );

    // 2. Hide the layers in reverse order.
    tl.to(
      [...layers].reverse(),
      {
        opacity: 0,
        scale: 0.4,
        duration: 0.6,
        ease: 'power3.inOut',
        svgOrigin: '110 110',
        stagger: 0.1
      },
      'exitStart+=0.3' // Snappy overlap with text exiting
    );

    return () => tl.kill();
  }, [onComplete]);

  return (
    <div className="entry-loader-wrapper" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      <svg
        ref={svgRef}
        className="jigyaza-loader"
        style={{ flexShrink: 0 }}
        width="220"
        height="220"
        viewBox="0 0 220 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ── LAYER 1 · PULSE RINGS ── */}
        <g ref={pulseRingsRef} className="layer-pulse-rings">
          <circle cx="110" cy="110" r="90" stroke={TRACK} strokeWidth="1" fill="none" />
          <circle className="pulse-ring-1" style={TO}
            cx="110" cy="110" r="90" fill="none" stroke={ACCENT} strokeWidth="1" />
          <circle className="pulse-ring-2" style={TO}
            cx="110" cy="110" r="90" fill="none" stroke={ACCENT} strokeWidth="0.6" />
        </g>

        {/* ── LAYER 2 · OUTER ARCS ── */}
        <g ref={outerArcsRef} className="layer-outer-arcs">
          <g className="arc-outer-cw" style={TO}>
            <path d="M110 20 A90 90 0 0 1 191.5 155"
              stroke={ACCENT} strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
          <g className="arc-outer-ccw" style={TO}>
            <path d="M110 200 A90 90 0 0 1 28.5 65"
              stroke={ACCENT} strokeWidth="1" fill="none"
              strokeLinecap="round" strokeOpacity="0.35" />
          </g>
        </g>

        {/* ── LAYER 3 · MIDDLE RING + TICKS ── */}
        <g ref={middleRef} className="layer-middle">
          <circle cx="110" cy="110" r="62" stroke={TRACK} strokeWidth="1" fill="none" />
          <g className="ring-middle-dashed" style={TO}>
            <circle cx="110" cy="110" r="62"
              stroke={ACCENT} strokeWidth="1.2" fill="none"
              strokeDasharray="5 8" strokeOpacity="0.4" />
          </g>
          <line className="tick-top"    style={TO} x1="110" y1="48"  x2="110" y2="56"  stroke={ACCENT} strokeWidth="2" strokeLinecap="round" />
          <line className="tick-right"  style={TO} x1="172" y1="110" x2="164" y2="110" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" />
          <line className="tick-bottom" style={TO} x1="110" y1="172" x2="110" y2="164" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" />
          <line className="tick-left"   style={TO} x1="48"  y1="110" x2="56"  y2="110" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* ── LAYER 4 · INNER ARCS ── */}
        <g ref={innerArcsRef} className="layer-inner-arcs">
          <circle cx="110" cy="110" r="34" stroke={TRACK} strokeWidth="1" fill="none" />
          <g className="arc-inner-fast" style={TO}>
            <path d="M110 76 A34 34 0 0 1 144 110"
              stroke={ACCENT} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </g>
          <g className="arc-inner-slow" style={TO}>
            <path d="M110 144 A34 34 0 0 1 76 110"
              stroke={ACCENT} strokeWidth="1" fill="none"
              strokeLinecap="round" strokeOpacity="0.4" />
          </g>
        </g>

        {/* ── LAYER 5 · ORBIT DOTS + CORE ── */}
        <g ref={orbitCoreRef} className="layer-orbit-core">
          <g className="orbit-dot-1" style={TO}>
            <circle cx="110" cy="110" r="5.5" fill={ACCENT} />
          </g>
          <g className="orbit-dot-2" style={TO}>
            <circle cx="110" cy="110" r="3.8" fill={ACCENT} fillOpacity="0.65" />
          </g>
          <g className="orbit-dot-3" style={TO}>
            <circle cx="110" cy="110" r="2.5" fill={ACCENT} fillOpacity="0.35" />
          </g>
          <circle cx="110" cy="110" r="10" fill={CORE_BG} />
          <circle className="core-pulse" style={TO} cx="110" cy="110" r="7" fill={ACCENT} />
          <circle cx="110" cy="110" r="2.5" fill={ACCENT_LIGHT} opacity="0.6" />
        </g>

      </svg>

      {/* ── TEXT REVEAL SECTION ── */}
      <div className="entry-text-container">
        <h1 className="entry-welcome-title" style={{ display: 'flex', gap: '0.4rem', overflow: 'hidden' }}>
          <span ref={word1Ref} className="word-welcome">WELCOME,</span>
          <span ref={word2Ref} className="word-designation">{designation}</span>
        </h1>
        <div className="entry-progress-track" ref={progressTrackRef}>
          <div className="entry-progress-bar" ref={progressBarRef} />
        </div>
      </div>
    </div>
  );
}
