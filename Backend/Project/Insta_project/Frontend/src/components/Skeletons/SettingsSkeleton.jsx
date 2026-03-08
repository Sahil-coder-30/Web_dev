import React from "react";
import "./Skeletons.scss";

/**
 * SettingsSkeleton
 * Mirrors a settings section:
 *   - 6 rows, each with a text line + toggle or chevron on right
 * @param {number}  count       – number of rows (default 6)
 * @param {"toggle"|"chevron"} endShape – right-side element style
 */
export default function SettingsSkeleton({ count = 6, endShape = "chevron" }) {
    return (
        <div aria-hidden="true">
            {Array.from({ length: count }, (_, i) => (
                <div key={i} className={`settings-row-sk sk-item--${Math.min(i + 1, 6)}`}>

                    {/* Label — 55–65% */}
                    <span className="sk-line sk-line--lg" style={{ width: "60%" }} />

                    {/* Right element — toggle or chevron */}
                    {endShape === "toggle"
                        ? <div className="settings-row-sk__toggle" />
                        : <div className="settings-row-sk__end" />
                    }

                </div>
            ))}
        </div>
    );
}
