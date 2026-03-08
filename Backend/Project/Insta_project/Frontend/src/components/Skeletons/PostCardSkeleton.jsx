import React from "react";
import "./Skeletons.scss";

/**
 * PostCardSkeleton
 * Mirrors the real PostCard layout exactly.
 * @param {number} count – number of skeleton cards to render (default 3)
 */
function SinglePostCardSkeleton({ index }) {
    return (
        <article className={`post-card-sk sk-item--${index + 1}`} aria-hidden="true">

            {/* ── Header ──────────────────────────────────── */}
            <div className="post-card-sk__header">
                <div className="post-card-sk__user">
                    {/* Avatar 44px */}
                    <span className="sk-circle sk-avatar--md" />

                    <div className="post-card-sk__user-info">
                        {/* Username — 40–55% wide */}
                        <span className="sk-line" style={{ width: "48%" }} />
                        {/* Location — 25–35% wide */}
                        <span className="sk-line" style={{ width: "30%" }} />
                    </div>
                </div>

                <div className="post-card-sk__header-right">
                    {/* Follow button shape */}
                    <span className="sk-rect" style={{ width: 70, height: 30 }} />
                </div>
            </div>

            {/* ── Media — full width square ────────────────── */}
            <div className="post-card-sk__media" />

            {/* ── Actions ──────────────────────────────────── */}
            <div className="post-card-sk__actions">
                <div className="post-card-sk__actions-left">
                    {/* Like, Comment, Share icon circles */}
                    <span className="sk-circle" style={{ width: 36, height: 36 }} />
                    <span className="sk-circle" style={{ width: 36, height: 36 }} />
                    <span className="sk-circle" style={{ width: 36, height: 36 }} />
                </div>
                {/* Bookmark icon */}
                <span className="sk-circle" style={{ width: 36, height: 36 }} />
            </div>

            {/* ── Footer ───────────────────────────────────── */}
            <div className="post-card-sk__footer">
                {/* Like count — 35–40% wide */}
                <span className="sk-line sk-line--lg" style={{ width: "38%" }} />
                {/* Caption line 1 — 85–90% */}
                <span className="sk-line" style={{ width: "88%" }} />
                {/* Caption line 2 — 60–70% */}
                <span className="sk-line" style={{ width: "65%" }} />
                {/* Comments link — 45–55% */}
                <span className="sk-line" style={{ width: "50%" }} />
                {/* Timestamp — 25–30% */}
                <span className="sk-line" style={{ width: "27%" }} />
            </div>

        </article>
    );
}

export default function PostCardSkeleton({ count = 3 }) {
    return (
        <>
            {Array.from({ length: count }, (_, i) => (
                <SinglePostCardSkeleton key={i} index={Math.min(i, 2)} />
            ))}
        </>
    );
}
