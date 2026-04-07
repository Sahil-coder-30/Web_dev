/**
 * Avatar — premium gradient-ring monogram.
 * Classy, geometric, visually distinct per user.
 */

// Deterministic hue from any string
function nameToHue(str = '') {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash) % 360
}

// Returns a pair of complementary hues for the gradient arc
function nameToGradientPair(str = '') {
  const h1 = nameToHue(str)
  const h2 = (h1 + 42) % 360
  return [h1, h2]
}

export default function Avatar({ name = '', size = 34, className = '' }) {
  const initial  = (name || 'U').charAt(0).toUpperCase()
  const [h1, h2] = nameToGradientPair(name)

  const ring1  = `hsl(${h1}, 80%, 60%)`
  const ring2  = `hsl(${h2}, 90%, 70%)`
  const inner  = `hsl(${h1}, 30%, 10%)`
  const text   = `hsl(${h1}, 70%, 88%)`

  const pad    = Math.round(size * 0.08)
  const inner_size = size - pad * 2

  return (
    <div
      className={`user-avatar-tile ${className}`}
      title={name}
      style={{
        width:          size,
        height:         size,
        flexShrink:     0,
        userSelect:     'none',
        position:       'relative',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        // Gradient ring via background
        background:     `linear-gradient(135deg, ${ring1} 0%, ${ring2} 100%)`,
        padding:        pad,
        boxShadow:      `0 0 ${Math.round(size * 0.35)}px hsla(${h1}, 80%, 55%, 0.17), 0 2px 8px rgba(0,0,0,0.5)`,
      }}
    >
      {/* Inner dark circle */}
      <div style={{
        width:          inner_size,
        height:         inner_size,
        background:     inner,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        // Cut to match outer (square shape)
      }}>
        <span style={{
          fontFamily:    '"Space Grotesk", sans-serif',
          fontSize:      `${Math.round(size * 0.38)}px`,
          fontWeight:    700,
          letterSpacing: '-0.01em',
          color:         text,
          lineHeight:    1,
          textShadow:    `0 0 12px hsla(${h1}, 80%, 55%, 0.4)`,
        }}>
          {initial}
        </span>
      </div>
    </div>
  )
}
