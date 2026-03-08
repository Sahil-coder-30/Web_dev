import React from "react";
import "./Skeletons.scss";

/**
 * NotificationSkeleton
 * Mirrors a notification row:
 *   - Avatar (44px) on left
 *   - Two text lines (different widths)
 *   - Square 44px image thumbnail on far right
 * Shows 5 rows with stagger delays.
 */
export default function NotificationSkeleton({ count = 5 }) {
    return (
        <div aria-hidden="true">
            {Array.from({ length: count }, (_, i) => (
                <div key={i} className={`notif-row-sk sk-item--${Math.min(i + 1, 5)}`}>

                    {/* Avatar 44px */}
                    <span className="sk-circle sk-avatar--md" />

                    {/* Text lines */}
                    <div className="notif-row-sk__lines">
                        {/* Username + action text — 65% */}
                        <span className="sk-line sk-line--lg" style={{ width: "65%" }} />
                        {/* Timestamp — 28% */}
                        <span className="sk-line" style={{ width: "28%" }} />
                    </div>

                    {/* Image thumbnail — 44×44 square */}
                    <div className="notif-row-sk__thumb" />

                </div>
            ))}
        </div>
    );
}
