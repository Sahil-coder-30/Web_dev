import React from "react";
import "./Skeletons.scss";

/**
 * FeedSkeleton
 * Mirrors the full Feed page layout:
 *   - Left sidebar (desktop ≥768px)
 *   - Centre column: stories strip + 3 post-card skeletons
 *   - Right sidebar (desktop ≥1024px): current-user card + 5 suggested users
 *
 * Uses only design-system shimmer primitives from Skeletons.scss.
 */
export default function FeedSkeleton() {
    return (
        <div className="feed-sk" aria-hidden="true">

            {/* ── LEFT SIDEBAR (hidden on mobile) ─────────────── */}
            <aside className="feed-sk__sidebar">
                {/* Logo */}
                <span className="sk-rect feed-sk__logo" />

                {/* 7 nav items */}
                {Array.from({ length: 7 }, (_, i) => (
                    <div key={i} className="feed-sk__nav-item">
                        <span className="sk-circle" style={{ width: 28, height: 28 }} />
                        <span className="sk-line" style={{ width: "55%" }} />
                    </div>
                ))}

                {/* Avatar row at bottom */}
                <div className="feed-sk__nav-item feed-sk__nav-item--bottom">
                    <span className="sk-circle sk-avatar--sm" />
                    <span className="sk-line" style={{ width: "45%" }} />
                </div>
            </aside>

            {/* ── CENTRE COLUMN ───────────────────────────────── */}
            <main className="feed-sk__main">
                {/* Stories strip */}
                <div className="feed-sk__stories">
                    {Array.from({ length: 7 }, (_, i) => (
                        <div key={i} className="feed-sk__story-item">
                            <span className="sk-circle sk-avatar--lg" />
                            <span className="sk-line" style={{ width: 56 }} />
                        </div>
                    ))}
                </div>

                {/* 3 post card skeletons */}
                {Array.from({ length: 3 }, (_, i) => (
                    <article
                        key={i}
                        className={`post-card-sk sk-item--${i + 1}`}
                        style={{ marginBottom: "1rem" }}
                    >
                        {/* Header */}
                        <div className="post-card-sk__header">
                            <div className="post-card-sk__user">
                                <span className="sk-circle sk-avatar--md" />
                                <div className="post-card-sk__user-info">
                                    <span className="sk-line" style={{ width: "48%" }} />
                                    <span className="sk-line" style={{ width: "28%" }} />
                                </div>
                            </div>
                            <div className="post-card-sk__header-right">
                                <span className="sk-rect" style={{ width: 60, height: 28 }} />
                            </div>
                        </div>

                        {/* Media */}
                        <div className="post-card-sk__media" />

                        {/* Actions */}
                        <div className="post-card-sk__actions">
                            <div className="post-card-sk__actions-left">
                                <span className="sk-circle" style={{ width: 36, height: 36 }} />
                                <span className="sk-circle" style={{ width: 36, height: 36 }} />
                                <span className="sk-circle" style={{ width: 36, height: 36 }} />
                            </div>
                            <span className="sk-circle" style={{ width: 36, height: 36 }} />
                        </div>

                        {/* Footer */}
                        <div className="post-card-sk__footer">
                            <span className="sk-line sk-line--lg" style={{ width: "38%" }} />
                            <span className="sk-line" style={{ width: "90%" }} />
                            <span className="sk-line" style={{ width: "65%" }} />
                            <span className="sk-line" style={{ width: "28%" }} />
                        </div>
                    </article>
                ))}
            </main>

            {/* ── RIGHT SIDEBAR (desktop ≥1024px) ─────────────── */}
            <aside className="feed-sk__right">
                {/* Current user card */}
                <div className="feed-sk__right-user">
                    <span className="sk-circle sk-avatar--md" />
                    <div className="feed-sk__right-user-info">
                        <span className="sk-line" style={{ width: "70%" }} />
                        <span className="sk-line" style={{ width: "50%" }} />
                    </div>
                    <span className="sk-rect sk-rect--pill" style={{ width: 68, height: 28 }} />
                </div>

                {/* Section header */}
                <div className="feed-sk__right-heading">
                    <span className="sk-line sk-line--lg" style={{ width: "55%" }} />
                    <span className="sk-line" style={{ width: "25%" }} />
                </div>

                {/* 5 suggested users */}
                {Array.from({ length: 5 }, (_, i) => (
                    <div key={i} className={`suggested-row-sk sk-item--${Math.min(i + 1, 5)}`}>
                        <span className="sk-circle sk-avatar--sm" />
                        <div className="suggested-row-sk__lines">
                            <span className="sk-line" style={{ width: "65%" }} />
                            <span className="sk-line" style={{ width: "45%" }} />
                        </div>
                        <span className="suggested-row-sk__btn" />
                    </div>
                ))}

                {/* Footer links */}
                <div className="feed-sk__right-footer">
                    {Array.from({ length: 3 }, (_, i) => (
                        <span key={i} className="sk-line" style={{ width: `${30 + i * 8}%` }} />
                    ))}
                </div>
            </aside>

        </div>
    );
}
