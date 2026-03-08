import React from "react";
import "./Skeletons.scss";

/**
 * DMListSkeleton
 * Mirrors a DM / conversation list row:
 *   - Avatar (56px) on left
 *   - Name + last message lines (different widths)
 *   - Short timestamp on far right (~20%)
 * Shows 5 rows.
 */
export default function DMListSkeleton({ count = 5 }) {
    return (
        <div aria-hidden="true">
            {Array.from({ length: count }, (_, i) => (
                <div key={i} className={`dm-row-sk sk-item--${Math.min(i + 1, 5)}`}>

                    {/* Avatar — 56px (DM-specific size) */}
                    <span className="sk-circle sk-avatar--dm" />

                    {/* Name + last message */}
                    <div className="dm-row-sk__lines">
                        {/* Username — 50% */}
                        <span className="sk-line sk-line--lg" style={{ width: "50%" }} />
                        {/* Last message preview — 70% */}
                        <span className="sk-line" style={{ width: "70%" }} />
                    </div>

                    {/* Timestamp — ~20% */}
                    <div className="dm-row-sk__time">
                        <span className="sk-line" style={{ width: 44 }} />
                    </div>

                </div>
            ))}
        </div>
    );
}
