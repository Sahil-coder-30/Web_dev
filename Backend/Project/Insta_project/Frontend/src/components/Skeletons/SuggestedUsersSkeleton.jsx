import React from "react";
import "./Skeletons.scss";

/**
 * SuggestedUsersSkeleton
 * Mirrors a suggested user / follow-list row:
 *   - Avatar (44px) on left
 *   - Username + full name lines
 *   - Button shape on far right
 * Shows 5 rows.
 */
export default function SuggestedUsersSkeleton({ count = 5 }) {
    return (
        <div aria-hidden="true">
            {Array.from({ length: count }, (_, i) => (
                <div key={i} className={`suggested-row-sk sk-item--${Math.min(i + 1, 5)}`}>

                    {/* Avatar — 44px */}
                    <span className="sk-circle sk-avatar--md" />

                    {/* Username + full name */}
                    <div className="suggested-row-sk__lines">
                        {/* Username — 45% */}
                        <span className="sk-line sk-line--lg" style={{ width: "45%" }} />
                        {/* Full name — 35% */}
                        <span className="sk-line" style={{ width: "35%" }} />
                    </div>

                    {/* Follow button */}
                    <div className="suggested-row-sk__btn" />

                </div>
            ))}
        </div>
    );
}
