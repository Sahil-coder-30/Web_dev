import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../Auth/auth.context.jsx'
import { useSidebar } from '../context/sidebar.context.jsx'
import Avatar from '../../../components/Avatar.jsx'

const NAV = [
  { to: '/',            label: 'New Battle',  icon: 'bolt',        end: true  },
  { to: '/history',     label: 'History',     icon: 'history',     end: false },
  { to: '/leaderboard', label: 'Leaderboard', icon: 'leaderboard', end: false },
]

// ── Reusable SVG Logo ─────────────────────────────────────────
function BrandLogo({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 38 38" fill="none"
      xmlns="http://www.w3.org/2000/svg" className="brand-svg-logo">
      <defs>
        <linearGradient id="logoGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#6eb4ff" />
          <stop offset="100%" stopColor="#4f9cff" />
        </linearGradient>
        <linearGradient id="logoGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#ff4560" />
          <stop offset="100%" stopColor="#cc2a44" />
        </linearGradient>
        <filter id="logoGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect x="1" y="1" width="36" height="36"
        stroke="url(#logoGrad1)" strokeWidth="1"
        fill="rgba(6,6,11,0.95)"
        strokeDasharray="4 2" strokeLinecap="square" />
      <path d="M14 7 L9 20 L14.5 20 L11 31 L22 16.5 L16 16.5 L20 7Z"
        fill="url(#logoGrad1)" filter="url(#logoGlow)" opacity="0.9" />
      <path d="M23 11 L19.5 22 L23.5 22 L21 31 L30 19 L25.5 19 L28.5 11Z"
        fill="url(#logoGrad2)" opacity="0.85" />
    </svg>
  )
}

// ── Collapsed icon strip ──────────────────────────────────────
function CollapsedSidebar({ onToggle, onNavigate, onLogout }) {
  return (
    <>
      {/* Logo mark */}
      <div className="cs-logo">
        <BrandLogo size={30} />
      </div>

      {/* Expand arrow */}
      <button className="cs-expand-btn" onClick={onToggle} title="Expand sidebar">
        <span className="material-icons">chevron_right</span>
      </button>

      {/* Divider */}
      <div className="cs-divider" />

      {/* Nav icons */}
      <nav className="cs-nav">
        {NAV.map(({ to, label, icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) => `cs-nav-item${isActive ? ' active' : ''}`}
            title={label}
          >
            <span className="material-icons">{icon}</span>
          </NavLink>
        ))}
      </nav>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Logout icon */}
      <button className="cs-logout-btn" onClick={onLogout} title="Sign out">
        <span className="material-icons">logout</span>
      </button>
    </>
  )
}

// ── Expanded full sidebar ─────────────────────────────────────
function ExpandedSidebar({ user, name, onToggle, onLogout, onNavigate }) {
  return (
    <>
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="brand-logo-wrap">
          <BrandLogo size={34} />
        </div>
        <div className="brand-text">
          <span className="brand-name">AI Battle</span>
          <span className="brand-sub">Arena</span>
        </div>
      </div>

      {/* Collapse strip */}
      <button className="sidebar-toggle-strip" onClick={onToggle} title="Collapse sidebar">
        <span className="material-icons">chevron_left</span>
      </button>

      {/* Nav */}
      <nav className="sidebar-nav">
        <span className="nav-group-label">MENU</span>
        {NAV.map(({ to, label, icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            title={label}
          >
            <span className="material-icons nav-icon">{icon}</span>
            <span className="nav-label">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <Avatar name={name} size={32} />
        <div className="user-meta">
          <div className="user-name">{name}</div>
          <div className="user-email">{user?.email}</div>
        </div>
        <button
          className="logout-btn"
          onClick={onLogout}
          title="Sign out"
        >
          <span className="material-icons">logout</span>
        </button>
      </div>
    </>
  )
}

// ── Main Sidebar export ───────────────────────────────────────
export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { collapsed, mobileOpen, toggle, closeMobile } = useSidebar()
  const name = user?.username || user?.email || 'Operator'

  const handleLogout = () => { logout(); navigate('/login') }

  const sidebarClass = [
    'arena-sidebar',
    collapsed   ? 'sidebar--collapsed'   : '',
    mobileOpen  ? 'sidebar--mobile-open' : '',
  ].filter(Boolean).join(' ')

  return (
    <>
      {/* Mobile hamburger */}
      <button className="mobile-menu-btn" onClick={toggle} title="Open menu">
        <span className="material-icons">menu</span>
      </button>

      {/* Mobile backdrop */}
      {mobileOpen && <div className="sidebar-backdrop" onClick={closeMobile} />}

      <aside className={sidebarClass}>
        {collapsed
          ? <CollapsedSidebar onToggle={toggle} onNavigate={closeMobile} onLogout={handleLogout} />
          : <ExpandedSidebar  user={user} name={name} onToggle={toggle} onLogout={handleLogout} onNavigate={closeMobile} />
        }
      </aside>
    </>
  )
}
