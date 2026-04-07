import { createContext, useContext, useEffect, useState, useCallback } from 'react'

const SidebarContext = createContext(null)

const STORAGE_KEY       = 'arena_sidebar_collapsed'
const SIDEBAR_W         = '240px'
const SIDEBAR_COLLAPSED = '60px'
const MOBILE_BP         = 768

const isMobile = () => window.innerWidth < MOBILE_BP

// Set the CSS variable that drives .arena-main's margin-left
function setCSSVar(collapsed) {
  document.documentElement.style.setProperty(
    '--sidebar-w',
    collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_W
  )
}

export function SidebarProvider({ children }) {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false
    if (isMobile()) return false                        // mobile always uses overlay mode
    const stored = localStorage.getItem(STORAGE_KEY) === 'true'
    setCSSVar(stored)
    return stored
  })

  // Mobile: sidebar slides in as an overlay (not collapsed, just hidden)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Toggle: desktop = collapse/expand, mobile = open overlay
  const toggle = useCallback(() => {
    if (isMobile()) {
      setMobileOpen(o => !o)
    } else {
      setCollapsed(c => {
        const next = !c
        localStorage.setItem(STORAGE_KEY, String(next))
        setCSSVar(next)
        return next
      })
    }
  }, [])

  const closeMobile = useCallback(() => setMobileOpen(false), [])

  // On resize: close mobile overlay and reset CSS var
  useEffect(() => {
    const onResize = () => {
      if (!isMobile()) {
        setMobileOpen(false)
        // Re-sync CSS var with desktop collapsed state
        const stored = localStorage.getItem(STORAGE_KEY) === 'true'
        setCSSVar(stored)
      } else {
        // On mobile the sidebar is overlay — main is always full width
        setCSSVar(false)
      }
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <SidebarContext.Provider value={{ collapsed, mobileOpen, toggle, closeMobile }}>
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => useContext(SidebarContext)
