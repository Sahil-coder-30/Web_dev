import React, { useState } from "react";
import { Link, useLocation } from "react-router";
import CreatePostModal from "./CreatePostModal";

// DS §5: BOTTOM NAVIGATION BAR — uses .bottom-nav .bottom-nav__* canonical classes
const MobileBottomNav = ({ currentUser }) => {
    const location = useLocation();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const itemClass = (path) =>
        `bottom-nav__item${location.pathname === path ? " bottom-nav__item--active" : ""}`;

    return (
        <>
            <nav className="bottom-nav">
                <Link to="/" className={itemClass("/")} aria-label="Home">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                </Link>
                <button className="bottom-nav__item" aria-label="Search" onClick={(e) => e.preventDefault()}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ pointerEvents: 'none' }}>
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                </button>
                <button className="bottom-nav__item" aria-label="Create" onClick={(e) => { e.preventDefault(); setIsCreateModalOpen(true); }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ pointerEvents: 'none' }}>
                        <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
                    </svg>
                </button>
                <button className="bottom-nav__item" aria-label="Reels" onClick={(e) => e.preventDefault()}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ pointerEvents: 'none' }}>
                        <circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" />
                    </svg>
                </button>
                {/* Profile — avatar--xs, active state adds gradient ring border via CSS */}
                <Link to="/profile" className={itemClass("/profile")} aria-label="Profile">
                    <img
                        src={currentUser?.profileImage}
                        alt={currentUser?.username || "profile"}
                        className="avatar avatar--xs"
                    />
                </Link>
            </nav>

            <CreatePostModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </>
    );
};

export default MobileBottomNav;
