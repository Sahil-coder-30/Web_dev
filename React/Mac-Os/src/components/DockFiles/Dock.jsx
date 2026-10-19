import React, { useState, useRef } from 'react'
import './dock.scss'

const dockItems = [
    { id: 'finder', name: 'Finder', icon: '/icons/finder.svg' },
    { id: 'launchpad', name: 'Launchpad', icon: '/icons/launchpad.svg' },
    { id: 'link', name: 'Safari', icon: '/icons/safari.svg' },
    { id: 'message', name: 'Messages', icon: '/icons/messages.svg' },
    { id: 'mail', name: 'Mail', icon: '/icons/mail.svg' },
    { id: 'maps', name: 'Maps', icon: '/icons/maps.svg' },
    { id: 'photos', name: 'Photos', icon: '/icons/photos.svg' },
    { id: 'calendar', name: 'Calendar', icon: '/icons/calendar.svg' },
    { id: 'note', name: 'Notes', icon: '/icons/notes.svg' },
    { id: 'settings', name: 'System Settings', icon: '/icons/settings.svg' },
    { id: 'appstore', name: 'App Store', icon: '/icons/appstore.svg' },
    { id: 'cli', name: 'Terminal', icon: '/icons/terminal.svg' },
    { id: 'pdf', name: 'Preview', icon: '/icons/preview.svg' },
    { id: 'spotify', name: 'Spotify', icon: '/icons/spotify.svg' },
    { id: 'trash', name: 'Trash', icon: '/icons/trash.svg' }
]

const Dock = () => {
    const [openApps, setOpenApps] = useState(['finder', 'mail', 'cli', 'message', 'spotify'])

    const dockRef = useRef(null)
    const iconRefs = useRef([])

    const handleAppClick = (e, id) => {
        if (e.detail === 3) {
            setOpenApps(prev => prev.filter(appId => appId !== id))
            return
        }

        if (!openApps.includes(id)) {
            setOpenApps([...openApps, id])
        }
    }

    const BASE_WIDTH = 40
    const MAX_WIDTH = 60
    const INFLUENCE_RANGE = 150

    const requestRef = useRef()

    const handleMouseMove = (e) => {
        if (window.innerWidth < 768) return

        const mouseX = e.clientX

        if (requestRef.current) cancelAnimationFrame(requestRef.current)

        requestRef.current = requestAnimationFrame(() => {
            iconRefs.current.forEach((icon) => {
                if (!icon) return

                const rect = icon.getBoundingClientRect()
                const iconCenterX = rect.left + rect.width / 2
                const distance = Math.abs(mouseX - iconCenterX)

                let targetWidth = BASE_WIDTH

                if (distance < INFLUENCE_RANGE) {
                    const normalizedDistance = distance / INFLUENCE_RANGE
                    const curve = Math.cos(normalizedDistance * Math.PI / 2)
                    targetWidth = BASE_WIDTH + (MAX_WIDTH - BASE_WIDTH) * curve
                }

                icon.style.width = `${targetWidth}px`
                icon.style.height = `${targetWidth}px`
            })
        })
    }

    const handleMouseLeave = () => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current)

        iconRefs.current.forEach((icon) => {
            if (icon) {
                icon.style.width = ''
                icon.style.height = ''
            }
        })
    }

    return (
        <footer className="dock-container">
            <div
                className="dock"
                ref={dockRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                <div className="dock__list">
                    {dockItems.map((item, index) => (
                        <div
                            key={item.id}
                            ref={(el) => (iconRefs.current[index] = el)}
                            className={`dock__item ${item.id}`}
                            onClick={(e) => handleAppClick(e, item.id)}
                        >
                            <span className="dock__tooltip">{item.name}</span>
                            <div className="dock__icon">
                                <img
                                    src={item.icon}
                                    alt={item.name}
                                    onError={(e) => {
                                        if (e.target.src.includes('svg')) return
                                        e.target.style.display = 'none'
                                    }}
                                />
                            </div>
                            <div className={`dock__dot ${openApps.includes(item.id) ? 'active' : ''}`}></div>
                        </div>
                    ))}
                </div>
            </div>
        </footer>
    )
}

export default Dock