import React from "react";
import "./Skeletons.scss";

/**
 * CreatePostModalSkeleton
 * Mirrors the CreatePostModal layout:
 *   - Modal overlay (darkened backdrop)
 *   - Header: title + close button
 *   - Body: upload area placeholder (icon + text + button)
 *
 * Displayed while the modal is mounting / assets are loading.
 */
export default function CreatePostModalSkeleton() {
    return (
        <div className="create-post-sk-overlay" aria-hidden="true">
            <div className="create-post-sk">

                {/* ── Header ──────────────────────────────────── */}
                <div className="create-post-sk__header">
                    {/* Title */}
                    <span className="sk-line sk-line--lg" style={{ width: "45%" }} />
                    {/* Close icon button */}
                    <span className="sk-circle" style={{ width: 32, height: 32 }} />
                </div>

                {/* ── Upload area ─────────────────────────────── */}
                <div className="create-post-sk__body">
                    {/* Upload icon placeholder */}
                    <span className="sk-circle create-post-sk__icon" />
                    {/* "Drag photos and videos here" text */}
                    <span className="sk-line" style={{ width: "60%" }} />
                    {/* "Select from computer" button */}
                    <span className="sk-rect sk-rect--pill create-post-sk__btn" />
                </div>

            </div>
        </div>
    );
}
