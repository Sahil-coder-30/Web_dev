import React from "react";
import "./Skeletons.scss";

/**
 * ExploreSkeleton
 * Mirrors the Explore / Search page:
 *   - Full-width search bar (40px tall)
 *   - 3-column grid of 12 square thumbnails
 */
export default function ExploreSkeleton() {
    return (
        <div className="explore-sk" aria-hidden="true">

            {/* ── Search bar ──────────────────────────────── */}
            <div className="explore-sk__search" />

            {/* ── 3×4 thumbnail grid (12 blocks) ───────────── */}
            <div className="explore-sk__grid">
                {Array.from({ length: 12 }, (_, i) => (
                    <div key={i} className="explore-sk__thumb" />
                ))}
            </div>

        </div>
    );
}
