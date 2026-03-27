import React, { useState, useEffect, useCallback } from 'react';
import Loder from '../../../components/Loaders/loder/Loder';
import '../styles/Dashboard.scss';

const Sidebar = ({ userInitials, userName, onNewChat, isOpen, toggle, history, onLoadChat, activeChatId, onDeleteChat, onLogout }) => {
    const [width, setWidth] = useState(280);
    const [isResizing, setIsResizing] = useState(false);
    const [activeDropdownId, setActiveDropdownId] = useState(null);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);

    // Global click listener to auto-close the dropdowns when clicking elsewhere
    useEffect(() => {
        const handleClickOutside = () => {
            setActiveDropdownId(null);
            setShowProfileDropdown(false);
        };
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    const startResizing = useCallback((e) => {
        setIsResizing(true);
        e.preventDefault();
    }, []);

    const stopResizing = useCallback(() => {
        setIsResizing(false);
    }, []);

    const resize = useCallback((e) => {
        if (isResizing) {
            const newWidth = e.clientX;
            
            // Auto close if dragged extremely thin
            if (newWidth < 150) {
                stopResizing();
                if (isOpen) {
                    toggle();
                }
                return;
            }

            if (newWidth >= 220 && newWidth <= 550) {
                setWidth(newWidth);
            }
        }
    }, [isResizing, isOpen, toggle, stopResizing]);

    useEffect(() => {
        if (isResizing) {
            window.addEventListener('mousemove', resize);
            window.addEventListener('mouseup', stopResizing);
            return () => {
                window.removeEventListener('mousemove', resize);
                window.removeEventListener('mouseup', stopResizing);
            };
        }
    }, [isResizing, resize, stopResizing]);

    return (
        <aside 
            className={`dashboard-sidebar ${isOpen ? 'open' : 'closed'} ${isResizing ? 'is-resizing' : ''}`}
            style={isOpen ? { width: `${width}px` } : undefined}
        >
            <div className="sidebar-content">
                {/* Logo Header */}
                <div className="logo-header">
                    <div 
                        className="logo-group" 
                        onClick={toggle} 
                        style={{ cursor: 'pointer' }}
                        title="Close Sidebar"
                    >
                        <Loder size={32} color="#c7621a" />
                        <div className="logo-text">
                            <span className="logo-wordmark">Jigyaza</span>
                            <span className="logo-sub">RESEARCH ENGINE</span>
                        </div>
                    </div>
                    {/* Close button for Mobile/Tablet */}
                    <button type="button" className="sidebar-close-btn" onClick={toggle} aria-label="Close Sidebar">
                        <span className="material-symbols-outlined">menu_open</span>
                    </button>
                </div>

                {/* New Chat Button */}
                <div className="new-chat-btn-wrapper">
                    <button type="button" onClick={onNewChat} aria-label="New Research">
                        <span className="material-symbols-outlined icon">add</span>
                        <span className="text">New Research</span>
                    </button>
                </div>

                {/* History Section */}
                <div className="history-section">
                    <div className="section-label">Recent</div>
                    <nav>
                        {history && history.map((item) => (
                            <div key={item.id} className="history-item-wrapper" style={{ position: 'relative' }}>
                                <a 
                                    href="#" 
                                    className={`history-item ${activeChatId === item.id ? 'active' : ''}`}
                                    onClick={(e) => { e.preventDefault(); onLoadChat(item); }}
                                >
                                    <div className="item-header">
                                        <span className="item-title">{item.title}</span>
                                        <div className="item-right-content">
                                            <span className="item-time">{item.time}</span>
                                            <button 
                                                type="button"
                                                className="chat-options-btn"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setActiveDropdownId(activeDropdownId === item.id ? null : item.id);
                                                }}
                                                aria-label="Chat options"
                                            >
                                                <span className="material-symbols-outlined">more_vert</span>
                                            </button>
                                        </div>
                                    </div>
                                    <span className="item-desc">{item.desc}</span>
                                </a>

                                {activeDropdownId === item.id && (
                                    <div className="chat-options-dropdown" onClick={(e) => e.stopPropagation()}>
                                        <button 
                                            type="button"
                                            className="delete-action-btn"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                if (onDeleteChat) onDeleteChat(item.id);
                                                setActiveDropdownId(null);
                                            }}
                                        >
                                            <span className="material-symbols-outlined">delete</span>
                                            Delete Chat
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>
                </div>

                {/* User Profile Footer */}
                <div className="profile-footer">
                    <div className="profile-inner">
                        <div className="user-info">
                            <div className="avatar">
                                <span>{userInitials}</span>
                            </div>
                            <div className="details">
                                <span className="name">{userName}</span>
                                <span className="tier">Academic Tier</span>
                            </div>
                        </div>
                        <div className="settings-wrapper" style={{ position: 'relative' }}>
                            <button 
                                type="button"
                                className="settings-btn" 
                                aria-label="Settings"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setShowProfileDropdown(!showProfileDropdown);
                                    setActiveDropdownId(null); // close chat dropdowns
                                }}
                            >
                                <span className="material-symbols-outlined">settings</span>
                            </button>

                            {showProfileDropdown && (
                                <div className="profile-settings-dropdown" onClick={(e) => e.stopPropagation()}>
                                    <button 
                                        type="button"
                                        className="logout-action-btn"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            if (onLogout) onLogout();
                                            setShowProfileDropdown(false);
                                        }}
                                    >
                                        <span className="material-symbols-outlined">logout</span>
                                        Log Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Drag Handle for Resizing */}
            <div className="sidebar-resizer" onMouseDown={startResizing}></div>
        </aside>
    );
};

export default Sidebar;
