import React, { useState } from "react";
import { Link, useLocation } from "react-router";
import CreatePostModal from "./CreatePostModal";

// DS §6: LEFT SIDEBAR — uses .sidebar .sidebar__* canonical classes
const DesktopSidebar = ({ currentUser }) => {
    const location = useLocation();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const itemClass = (path) =>
        `sidebar__item${location.pathname === path ? " sidebar__item--active" : ""}`;

    return (
        <>
            <aside className="sidebar">
                {/* Logo — Grand Hotel font with IG gradient, via .navbar__wordmark */}
                <div className="sidebar__logo navbar__wordmark">Instagram</div>

                <nav className="sidebar__nav">
                    <Link to="/" className={itemClass("/")}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                        <span className="sidebar__label">Home</span>
                    </Link>
                    <a href="#" className="sidebar__item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <span className="sidebar__label">Search</span>
                    </a>
                    <a href="#" className="sidebar__item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" />
                        </svg>
                        <span className="sidebar__label">Reels</span>
                    </a>
                    <a href="#" className="sidebar__item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        <span className="sidebar__label">Messages</span>
                    </a>
                    <Link to="/activity" className={itemClass("/activity")}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                        <span className="sidebar__label">Notifications</span>
                    </Link>
                    <a href="#" className="sidebar__item" onClick={(e) => { e.preventDefault(); setIsCreateModalOpen(true); }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
                        </svg>
                        <span className="sidebar__label">Create</span>
                    </a>
                    <Link to="/profile" className={itemClass("/profile")}>
                        {/* Profile — uses avatar--sm, no story ring in sidebar */}
                        <div className="avatar-wrap">
                            <img
                                src={currentUser?.profileImage}
                                alt={currentUser?.username || "profile"}
                                className="avatar avatar--sm"
                            />
                        </div>
                        <span className="sidebar__label">Profile</span>
                    </Link>
                </nav>

                {/* More — pinned to bottom */}
                <div className="sidebar__bottom">
                    <a href="#" className="sidebar__item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                        <span className="sidebar__label">More</span>
                    </a>
                </div>
            </aside>

            <CreatePostModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </>
    );
};

export default DesktopSidebar;
