import React from "react";
import "./Skeletons.scss";

/**
 * PostDetailSkeleton
 * Mirrors the post detail page:
 *   - Header: avatar (44px) + username + location
 *   - Full width square media
 *   - Action icons
 *   - Like count + caption lines
 *   - 3 comment rows
 */
export default function PostDetailSkeleton() {
    return (
        <div className="post-detail-sk" aria-hidden="true">

            {/* ── Header ───────────────────────────────────── */}
            <div className="post-detail-sk__header">
                <span className="sk-circle sk-avatar--md" />
                <div className="post-detail-sk__user-info">
                    {/* Username — 45% */}
                    <span className="sk-line sk-line--lg" style={{ width: "45%" }} />
                    {/* Location — 30% */}
                    <span className="sk-line" style={{ width: "30%" }} />
                </div>
            </div>

            {/* ── Media — full width square ────────────────── */}
            <div className="post-detail-sk__media" />

            {/* ── Actions ──────────────────────────────────── */}
            <div className="post-detail-sk__actions">
                <div className="post-detail-sk__actions-left">
                    <span className="sk-circle" style={{ width: 36, height: 36 }} />
                    <span className="sk-circle" style={{ width: 36, height: 36 }} />
                    <span className="sk-circle" style={{ width: 36, height: 36 }} />
                </div>
                <span className="sk-circle" style={{ width: 36, height: 36 }} />
            </div>

            {/* ── Footer ───────────────────────────────────── */}
            <div className="post-detail-sk__footer">
                {/* Like count — 38% */}
                <span className="sk-line sk-line--lg" style={{ width: "38%" }} />
                {/* Caption line 1 — 87% */}
                <span className="sk-line" style={{ width: "87%" }} />
                {/* Caption line 2 — 65% */}
                <span className="sk-line" style={{ width: "65%" }} />
                {/* Comments link — 50% */}
                <span className="sk-line" style={{ width: "50%" }} />
                {/* Timestamp — 27% */}
                <span className="sk-line" style={{ width: "27%" }} />
            </div>

            {/* ── Comments — 3 rows ────────────────────────── */}
            <div className="post-detail-sk__comments">
                {[0, 1, 2].map((i) => (
                    <div key={i} className={`comment-row-sk sk-item--${i + 1}`}>
                        {/* Avatar 32px */}
                        <span className="sk-circle sk-avatar--sm" />
                        <div className="comment-row-sk__lines">
                            {/* Comment line 1 — 70% */}
                            <span className="sk-line" style={{ width: "70%" }} />
                            {/* Comment line 2 — 50% */}
                            <span className="sk-line" style={{ width: "50%" }} />
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}
