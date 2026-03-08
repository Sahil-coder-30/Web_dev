import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { PostCardSkeleton } from "../../../components/Skeletons";

// DS §7: POST CARD — uses .post-card__* DS canonical classes
// DS §3: Icon buttons use .icon-btn
// DS §1: Avatar uses .avatar-wrap--story + .avatar.avatar--md
// DS resilience: .flex-safe + .truncate on user info
const PostCard = ({ post, currentUser }) => {
    // Preload the post image via new Image() so we aren't blocked by
    // lazy-loading inside a hidden element (which never triggers onLoad).
    const [imgLoaded, setImgLoaded] = useState(false);
    useEffect(() => {
        if (!post.imgUrl) { setImgLoaded(true); return; }
        const img = new Image();
        img.onload = () => setImgLoaded(true);
        img.onerror = () => setImgLoaded(true); // show card even if image 404s
        img.src = post.imgUrl;
    }, [post.imgUrl]);

    return (
        <>
            {/* Shimmer skeleton — visible until the image preloads */}
            {!imgLoaded && <PostCardSkeleton count={1} />}

            {/* Real card — only mounted once the image is ready */}
            {imgLoaded && <article className="post-card">

                {/* Header */}
                <header className="post-card__header">
                    {/* User info — clicking avatar or username navigates to their profile */}
                    <div className="post-card__user flex-safe">
                        <Link
                            to={`/user/${post.user.username}`}
                            className="avatar-wrap avatar-wrap--story"
                            style={{ textDecoration: 'none' }}
                        >
                            <img
                                src={post.user.profileImage}
                                alt={post.user.username}
                                className="avatar avatar--md"
                            />
                        </Link>
                        <div className="post-card__user-info flex-safe">
                            <Link
                                to={`/user/${post.user.username}`}
                                className="post-card__username truncate"
                                style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                                {post.user.username}
                            </Link>
                        </div>
                    </div>

                    {/* Three-dot more button — DS §3 icon-btn */}
                    <div className="post-card__header-right">
                        <button className="icon-btn" aria-label="More options">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                            </svg>
                        </button>
                    </div>
                </header>

                {/* Media — image is already preloaded so it renders instantly */}
                <div className="post-card__media">
                    <img
                        src={post.imgUrl}
                        alt={post.caption}
                        className="post-card__image"
                    />
                </div>

                {/* Actions */}
                <div className="post-card__actions">
                    <div className="post-card__actions-left">
                        <button className="icon-btn" aria-label="Like">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                        </button>
                        <button className="icon-btn" aria-label="Comment">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            </svg>
                        </button>
                        <button className="icon-btn" aria-label="Share">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="22" y1="2" x2="11" y2="13" />
                                <polygon points="22 2 15 22 11 13 2 9 22 2" />
                            </svg>
                        </button>
                    </div>
                    {/* Bookmark — aligned right */}
                    <button className="icon-btn" aria-label="Save">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                        </svg>
                    </button>
                </div>

                {/* Footer */}
                <div className="post-card__footer">
                    {/* Caption */}
                    <div className="post-card__caption">
                        <span className="post-card__caption-user">{post.user.username}</span>
                        <span className="post-card__caption-text truncate-2">{post.caption}</span>
                    </div>

                    {/* Add comment row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', borderTop: '1px solid #313135', paddingTop: '0.65rem', marginTop: '0.2rem' }}>
                        <img
                            src={currentUser?.profileImage}
                            alt="you"
                            className="avatar avatar--xs"
                        />
                        <input
                            type="text"
                            placeholder="Add a comment…"
                            readOnly
                            style={{
                                flex: 1,
                                background: 'none',
                                border: 'none',
                                outline: 'none',
                                fontFamily: 'Inter, sans-serif',
                                fontSize: '0.85rem',
                                color: '#f5f5f5',
                                caretColor: '#8134af',
                            }}
                        />
                        <button
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '0.825rem',
                                fontWeight: 700,
                                color: '#dd2a7b',
                                fontFamily: 'Inter, sans-serif',
                            }}
                        >
                            Post
                        </button>
                    </div>
                </div>

            </article>}
        </>
    );
};

export default PostCard;

