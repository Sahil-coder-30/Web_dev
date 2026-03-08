import React from "react";
import { Link } from "react-router";

// DS §4: TOP NAVIGATION BAR — .navbar .navbar__* canonical classes
// Settings / sub-page variant: back arrow + centred title + spacer
const MobileHeader = ({ title = "Settings" }) => (
    <nav className="navbar" aria-label={title}>
        {/* Back arrow — DS §3 icon-btn */}
        <Link to="/profile" className="icon-btn" aria-label="Back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
            </svg>
        </Link>

        {/* Centred title — DS navbar__title uses absolute left:50% translateX */}
        <span className="navbar__title">{title}</span>

        {/* Spacer balances the back button so title stays perfectly centred */}
        <div className="navbar__spacer" />
    </nav>
);

export default MobileHeader;
