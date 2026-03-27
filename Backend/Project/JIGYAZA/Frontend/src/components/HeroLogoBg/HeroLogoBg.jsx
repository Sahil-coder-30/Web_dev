import React from 'react';

const A  = '#c7621a';       // accent orange
const AL = '#E8924A';       // accent light
const TR = '#1A1714';       // dark track
const CB = '#1C1510';       // core bg

/** A full-size SVG frame that is invisible except for the children passed in */
const Layer = ({ id, children }) => (
  <div
    id={id}
    style={{
      position: 'absolute',
      inset: 0,
      opacity: 0, // GSAP reveals each layer
    }}
  >
    <svg
      viewBox="0 0 220 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      {children}
    </svg>
  </div>
);

/**
 * HeroLogoBg — 5 layer breakdown:
 *   hlb-l1  outer track rings          → flies in from TOP
 *   hlb-l2  outer CW arc               → flies in from TOP-RIGHT
 *   hlb-l3  outer CCW arc              → flies in from BOTTOM-LEFT
 *   hlb-l4  middle dashed ring + ticks → flies in from BOTTOM
 *   hlb-l5  inner arcs + core dot      → scales up from center
 */
export default function HeroLogoBg() {
  return (
    <>
      {/* ── Layer 1: Outer track rings ── top */}
      <Layer id="hlb-l1">
        <circle cx="110" cy="110" r="90" stroke={A}  strokeWidth="0.8" fill="none" opacity="0.7" />
        <circle cx="110" cy="110" r="90" stroke={A}  strokeWidth="0.5" fill="none" opacity="0.3" />
        <circle cx="110" cy="110" r="90" stroke={TR} strokeWidth="1.5" fill="none" />
      </Layer>

      {/* ── Layer 2: Outer CW arc ── top-right */}
      <Layer id="hlb-l2">
        <path
          d="M110 20 A90 90 0 0 1 191.5 155"
          stroke={A} strokeWidth="2.5" fill="none" strokeLinecap="round"
        />
      </Layer>

      {/* ── Layer 3: Outer CCW arc ── bottom-left */}
      <Layer id="hlb-l3">
        <path
          d="M110 200 A90 90 0 0 1 28.5 65"
          stroke={A} strokeWidth="1.2" fill="none"
          strokeLinecap="round" strokeOpacity="0.45"
        />
      </Layer>

      {/* ── Layer 4: Middle dashed ring + compass ticks ── bottom */}
      <Layer id="hlb-l4">
        <circle cx="110" cy="110" r="62" stroke={TR} strokeWidth="1"   fill="none" />
        <circle cx="110" cy="110" r="62" stroke={A}  strokeWidth="1.4" fill="none"
          strokeDasharray="5 8" strokeOpacity="0.45" />
        <line x1="110" y1="46"  x2="110" y2="56"  stroke={A} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="174" y1="110" x2="164" y2="110" stroke={A} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="110" y1="174" x2="110" y2="164" stroke={A} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="46"  y1="110" x2="56"  y2="110" stroke={A} strokeWidth="2.5" strokeLinecap="round" />
      </Layer>

      {/* ── Layer 5: Inner arcs + core ── scale from center */}
      <Layer id="hlb-l5">
        <circle cx="110" cy="110" r="34" stroke={TR} strokeWidth="1"   fill="none" />
        <path d="M110 76 A34 34 0 0 1 144 110"
          stroke={A} strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M110 144 A34 34 0 0 1 76 110"
          stroke={A} strokeWidth="1.2" fill="none"
          strokeLinecap="round" strokeOpacity="0.4" />
        <circle cx="110" cy="110" r="10"  fill={CB} />
        <circle cx="110" cy="110" r="7.5" fill={A}  />
        <circle cx="110" cy="110" r="3"   fill={AL} opacity="0.85" />
      </Layer>
    </>
  );
}
