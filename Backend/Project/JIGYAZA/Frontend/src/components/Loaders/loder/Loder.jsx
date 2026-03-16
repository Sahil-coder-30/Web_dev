import React from 'react';
import './JigyazaLoader.scss';

export default function Loder({ size = 220, color = '#C8621A' }) {
  const ACCENT       = color;
  const ACCENT_LIGHT = '#E8924A';
  const TRACK        = '#1A1714';
  const CORE_BG      = '#1C1510';

  return (
    <svg
      className="jigyaza-loader"
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
      width={size}
      height={size}
        viewBox="0 0 220 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ── PULSE RINGS ── */}
        <circle
          className="pulse-ring-1"
          cx="110" cy="110" r="90"
          fill="none"
          stroke={ACCENT}
          strokeWidth="1"
        />
        <circle
          className="pulse-ring-2"
          cx="110" cy="110" r="90"
          fill="none"
          stroke={ACCENT}
          strokeWidth="0.6"
        />

        {/* ── OUTERMOST STATIC TRACK ── */}
        <circle cx="110" cy="110" r="90" stroke={TRACK} strokeWidth="1" fill="none" />

        {/* ── OUTER ARC — long, slow CW ── */}
        <g className="arc-outer-cw">
          <path
            d="M110 20 A90 90 0 0 1 191.5 155"
            stroke={ACCENT}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </g>

        {/* ── OUTER ARC 2 — short, CCW ── */}
        <g className="arc-outer-ccw">
          <path
            d="M110 200 A90 90 0 0 1 28.5 65"
            stroke={ACCENT}
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
            strokeOpacity="0.35"
          />
        </g>

        {/* ── MIDDLE TRACK ── */}
        <circle cx="110" cy="110" r="62" stroke={TRACK} strokeWidth="1" fill="none" />

        {/* ── MIDDLE DASHED RING — CCW ── */}
        <g className="ring-middle-dashed">
          <circle
            cx="110" cy="110" r="62"
            stroke={ACCENT}
            strokeWidth="1.2"
            fill="none"
            strokeDasharray="5 8"
            strokeOpacity="0.4"
          />
        </g>

        {/* ── COMPASS TICK MARKS ── */}
        {/* top */}
        <line
          className="tick-top"
          x1="110" y1="46" x2="110" y2="54"
          stroke={ACCENT} strokeWidth="2" strokeLinecap="round"
        />
        {/* right */}
        <line
          className="tick-right"
          x1="174" y1="110" x2="166" y2="110"
          stroke={ACCENT} strokeWidth="2" strokeLinecap="round"
        />
        {/* bottom */}
        <line
          className="tick-bottom"
          x1="110" y1="174" x2="110" y2="166"
          stroke={ACCENT} strokeWidth="2" strokeLinecap="round"
        />
        {/* left */}
        <line
          className="tick-left"
          x1="46" y1="110" x2="54" y2="110"
          stroke={ACCENT} strokeWidth="2" strokeLinecap="round"
        />

        {/* ── INNER TRACK ── */}
        <circle cx="110" cy="110" r="34" stroke={TRACK} strokeWidth="1" fill="none" />

        {/* ── INNER ARC — fast spin ── */}
        <g className="arc-inner-fast">
          <path
            d="M110 76 A34 34 0 0 1 144 110"
            stroke={ACCENT}
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
        </g>

        {/* ── INNER ARC 2 — opposite slow ── */}
        <g className="arc-inner-slow">
          <path
            d="M110 144 A34 34 0 0 1 76 110"
            stroke={ACCENT}
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
            strokeOpacity="0.4"
          />
        </g>

        {/* ── 3 ORBITING DOTS ── */}
        <g className="orbit-dot-1">
          <circle cx="110" cy="110" r="5.5" fill={ACCENT} />
        </g>
        <g className="orbit-dot-2">
          <circle cx="110" cy="110" r="3.8" fill={ACCENT} fillOpacity="0.65" />
        </g>
        <g className="orbit-dot-3">
          <circle cx="110" cy="110" r="2.5" fill={ACCENT} fillOpacity="0.35" />
        </g>

        {/* ── CORE DOT ── */}
        <circle cx="110" cy="110" r="10" fill={CORE_BG} />
        <circle
          className="core-pulse"
          cx="110" cy="110" r="7"
          fill={ACCENT}
        />
        {/* core inner highlight */}
        <circle cx="110" cy="110" r="2.5" fill={ACCENT_LIGHT} opacity="0.6" />
      </svg>
  );
}
