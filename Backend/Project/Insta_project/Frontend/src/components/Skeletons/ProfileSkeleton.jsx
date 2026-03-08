import React from "react";
import "./Skeletons.scss";

/**
 * ProfileSkeleton
 * Mirrors the real Profile page layout:
 *   - Profile header (avatar + stats + bio + buttons)
 *   - Highlights row (5 circles)
 *   - Post grid (9 squares, 3×3)
 */
export default function ProfileSkeleton() {
    return (
        <div className="profile-sk" aria-hidden="true">

            {/* ── Profile Header ────────────────────────────── */}
            <div className="profile-sk__header">

                <div className="profile-sk__header-top">
                    {/* Avatar — 86px (own profile mobile), 150px (desktop via CSS) */}
                    <span className="sk-circle sk-avatar--xl" />

                    {/* Stats: Posts / Followers / Following */}
                    <div className="profile-sk__stats">
                        {[0, 1, 2].map((i) => (
                            <div key={i} className="profile-sk__stat-col">
                                {/* Count number */}
                                <span className="sk-line sk-line--xl" style={{ width: 40 }} />
                                {/* Label */}
                                <span className="sk-line" style={{ width: 60 }} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bio lines */}
                <div className="profile-sk__info">
                    {/* Name / display name — 40–55% */}
                    <span className="sk-line sk-line--lg" style={{ width: "48%" }} />
                    {/* Bio line 1 — 70–80% */}
                    <span className="sk-line" style={{ width: "75%" }} />
                    {/* Bio line 2 — 55–65% */}
                    <span className="sk-line" style={{ width: "60%" }} />
                    {/* Bio line 3 — 40–50% */}
                    <span className="sk-line" style={{ width: "44%" }} />
                    {/* Website link — 40–50% */}
                    <span className="sk-line" style={{ width: "46%" }} />
                </div>

                {/* Action buttons */}
                <div className="profile-sk__buttons">
                    <span className="sk-rect" />
                    <span className="sk-rect" />
                </div>

            </div>

            {/* ── Highlights Row — 5 circles ──────────────────── */}
            <div className="profile-sk__highlights">
                {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className={`profile-sk__highlight-item sk-item--${i + 1}`}>
                        {/* 64px highlight ring circle */}
                        <span className="sk-circle sk-avatar--lg" />
                        {/* Label below — 30–40% */}
                        <span className="sk-line" style={{ width: 48 }} />
                    </div>
                ))}
            </div>

            {/* ── Post Grid — 9 squares (3×3) ─────────────────── */}
            <div className="profile-sk__grid">
                {Array.from({ length: 9 }, (_, i) => (
                    <div
                        key={i}
                        className={`profile-sk__grid-item sk-item--${(i % 5) + 1}`}
                    />
                ))}
            </div>

        </div>
    );
}
