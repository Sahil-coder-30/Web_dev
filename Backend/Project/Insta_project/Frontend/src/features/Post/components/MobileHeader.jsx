import React from "react";

// DS §4: TOP NAVIGATION BAR — uses .navbar .navbar__* canonical classes
// Shown on mobile only (< 768px). Tablet/desktop shows the left sidebar instead.
const MobileHeader = () => (
    <nav className="navbar" aria-label="Top navigation">
        {/* Brand wordmark — Grand Hotel font + IG gradient via .navbar__wordmark */}
        <span className="navbar__wordmark">Instagram</span>

        <div className="navbar__actions">
            {/* Notifications — DS §3 icon-btn */}
            <button className="icon-btn" aria-label="Notifications">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
            </button>
            {/* Messages — DS §3 icon-btn */}
            <button className="icon-btn" aria-label="Messages">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
            </button>
        </div>
    </nav>
);

export default MobileHeader;
