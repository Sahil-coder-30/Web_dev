import React, { useEffect, useState } from "react";
import "../styles/profile.scss";
import DesktopSidebar from "../../Post/components/DesktopSidebar";
import MobileBottomNav from "../components/MobileBottomNav";
import MobileProfileHeader from "../components/MobileProfileHeader";
import { useParams, Navigate } from "react-router";
import ProfileSkeleton from "../../../components/Skeletons/ProfileSkeleton";
import {
  userPosts,
  userProfile,
  allFollowers,
  allFollowing,
  requestFollow,
  unfollowUser,
} from "../services/profile.api";
import { useAuth } from "../../Auth/hooks/useAuth";

// ─── Dummy Data ───────────────────────────────────────────────────────────────
// Replace these with real API data once the backend is ready.

const DUMMY_HIGHLIGHTS = [
  {
    id: 1,
    name: "Travel",
    cover:
      "https://images.unsplash.com/photo-1542314831-c53cd4185af1?w=150&q=80",
  },
  {
    id: 2,
    name: "Design",
    cover:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=150&q=80",
  },
  {
    id: 3,
    name: "Sunsets",
    cover:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=150&q=80",
  },
  {
    id: 4,
    name: "Food",
    cover:
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=150&q=80",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatItems = ({ posts, followers, following }) => (
  <div className="profile-header__stats">
    <div className="stat-item">
      <span className="stat-item__value">{posts}</span>
      <span className="stat-item__label">posts</span>
    </div>
    <div className="stat-item">
      <span className="stat-item__value">{followers}</span>
      <span className="stat-item__label">followers</span>
    </div>
    <div className="stat-item">
      <span className="stat-item__value">{following}</span>
      <span className="stat-item__label">following</span>
    </div>
  </div>
);

// Follow / Message / More — the visitor-facing action buttons
const VisitorActions = ({ className = "", isFollowing, onFollow }) => (
  <div className={`profile-header__actions ${className}`}>
    <button
      className={`btn profile-header__btn ${isFollowing ? "profile-btn" : "btn--primary"}`}
      style={{ minWidth: 100 }}
      onClick={onFollow}
    >
      {isFollowing ? "Following" : "Follow"}
    </button>
    <button className="btn profile-btn profile-header__btn">Message</button>
    {/* More options icon */}
    <button
      className="btn profile-btn profile-header__icon-btn"
      aria-label="More options"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
      </svg>
    </button>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export default function UserProfile() {
  const { username } = useParams();
  const { currentUser, user } = useAuth();
  const activeUser = currentUser || user;
  const [activeTab, setActiveTab] = useState("posts");

  // Discrete local state for the viewed user
  const [USER, setUSER] = useState(null);
  const [POSTS, setPOSTS] = useState([]);
  const [followersData, setFollowersData] = useState([]);
  const [followingData, setFollowingData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setPostsLoading(true);

    Promise.all([
      userProfile(username).catch(() => null),
      allFollowers(username).catch(() => []),
      allFollowing(username).catch(() => []),
      // Backend returns posts in `userPosts`, so fall back to `posts` if available.
      userPosts(username)
        .then((res) => res?.userPosts || res?.posts || [])
        .catch(() => []),
    ]).then(([profileRes, followersRes, followingRes, postsRes]) => {
      if (!isMounted) return;

      if (
        !profileRes ||
        profileRes.message === "You are opening your own Profile...."
      ) {
        setIsOwnProfile(true);
        setLoading(false);
        return;
      }

      setUSER(profileRes.Data);
      setIsFollowing(
        profileRes.isFollowing === "True" || profileRes.isFollowing === true,
      );
      setFollowersData(followersRes || []);
      setFollowingData(followingRes || []);
      setPOSTS(postsRes || []);

      setLoading(false);
      setPostsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [username]);

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await unfollowUser(username);
        setIsFollowing(false);
      } else {
        await requestFollow(username);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };
  const HIGHLIGHTS = [];

  if (isOwnProfile) return <Navigate to="/profile" replace />;
  if (loading || !USER) return <ProfileSkeleton />;

  return (
    <div className="feed-layout">
      {/* ── Left sidebar ─────────────────────────────────────── */}
      <DesktopSidebar currentUser={activeUser} />

      {/* ── Main content column ──────────────────────────────── */}
      <main className="profile-main">
        {/* Mobile top nav — shows username */}
        <MobileProfileHeader currentUser={USER} />

        {/* ── PROFILE HEADER ────────────────────────────────── */}
        <section className="profile-header">
          {/* Col 1 — Avatar */}
          <div className="profile-header__avatar-col">
            <div className="avatar-wrap avatar-wrap--story">
              <img
                src={USER.profileImage}
                alt={USER.username}
                className="avatar avatar--xl"
              />
            </div>
          </div>

          {/* Col 2 — Info */}
          <div className="profile-header__info">
            {/* Row 1 — fullName + @username + action buttons (desktop) */}
            <div className="profile-header__username-row">
              <div className="profile-header__name-group">
                <h2 className="profile-header__username-text">
                  {USER.fullName}
                </h2>
                <span className="profile-header__username-sub">
                  @{USER.username}
                </span>
              </div>
              <VisitorActions
                className="profile-header__actions--desktop"
                isFollowing={isFollowing}
                onFollow={handleFollow}
              />
            </div>

            {/* Row 2 — Stats */}
            <StatItems
              posts={POSTS.length}
              followers={followersData?.length || 0}
              following={followingData?.length || 0}
            />

            {/* Row 3 — Bio block (desktop) */}
            <div className="profile-header__bio">
              {USER.fullName && (
                <p className="profile-header__name">{USER.fullName}</p>
              )}
              {USER.category && (
                <p className="profile-header__category">{USER.category}</p>
              )}
              {USER.bio && (
                <p className="profile-header__bio-text word-safe">
                  {USER.bio.split("\n").map((line, i, arr) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < arr.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </p>
              )}
              {USER.website && (
                <a
                  href={`https://${USER.website}`}
                  className="profile-header__link"
                  target="_blank"
                  rel="noreferrer"
                >
                  {USER.website}
                </a>
              )}
            </div>
          </div>
        </section>

        {/* ── MOBILE BIO (below header row on mobile) ───────── */}
        <div className="profile-bio-mobile">
          {USER.fullName && (
            <p className="profile-bio-mobile__name">{USER.fullName}</p>
          )}
          {USER.category && (
            <p className="profile-bio-mobile__category">{USER.category}</p>
          )}
          {USER.bio && (
            <p className="profile-bio-mobile__text word-safe">
              {USER.bio.split("\n").map((line, i, arr) => (
                <React.Fragment key={i}>
                  {line}
                  {i < arr.length - 1 && <br />}
                </React.Fragment>
              ))}
            </p>
          )}
          {USER.website && (
            <a
              href={`https://${USER.website}`}
              className="profile-bio-mobile__link"
              target="_blank"
              rel="noreferrer"
            >
              {USER.website}
            </a>
          )}
        </div>

        {/* ── MOBILE ACTION BUTTONS ─────────────────────────── */}
        <div className="profile-actions-mobile">
          <VisitorActions isFollowing={isFollowing} onFollow={handleFollow} />
        </div>

        {/* ── HIGHLIGHTS ROW ────────────────────────────────── */}
        <section className="highlights">
          <div className="highlights__scroll">
            {HIGHLIGHTS.map((h) => (
              <div key={h.id} className="highlight-item">
                <div className="highlight-item__ring highlight-item__ring--gradient">
                  <img
                    src={h.cover}
                    alt={h.name}
                    className="highlight-item__img"
                  />
                </div>
                <span className="highlight-item__label truncate">{h.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── PROFILE TABS ──────────────────────────────────── */}
        <div className="profile-tabs">
          {/* Posts tab */}
          <button
            className={`profile-tabs__tab${activeTab === "posts" ? " profile-tabs__tab--active" : ""}`}
            aria-label="Posts"
            onClick={() => setActiveTab("posts")}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="21" x2="9" y2="9" />
            </svg>
          </button>

          {/* Reels tab */}
          <button
            className={`profile-tabs__tab${activeTab === "reels" ? " profile-tabs__tab--active" : ""}`}
            aria-label="Reels"
            onClick={() => setActiveTab("reels")}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="12" cy="12" r="10" />
              <polygon points="10 8 16 12 10 16 10 8" />
            </svg>
          </button>

          {/* Tagged tab */}
          <button
            className={`profile-tabs__tab${activeTab === "tagged" ? " profile-tabs__tab--active" : ""}`}
            aria-label="Tagged"
            onClick={() => setActiveTab("tagged")}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
        </div>

        {/* ── POST GRID ─────────────────────────────────────── */}
        {activeTab === "posts" && (
          <section className="post-grid">
            {postsLoading && (
              <p style={{ padding: "1rem", color: "var(--text-sub)" }}>
                Loading posts...
              </p>
            )}
            {!postsLoading && POSTS.length === 0 && (
              <p style={{ padding: "1rem", color: "var(--text-sub)" }}>
                No posts yet.
              </p>
            )}
            {POSTS.map((post) => (
              <div key={post._id} className="post-grid__item">
                <img
                  src={post.imgUrl}
                  alt=""
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.opacity = "0";
                  }}
                />
                <div className="post-grid__overlay">
                  <span>
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      width="16"
                      height="16"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </span>
                  <span>
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      width="16"
                      height="16"
                    >
                      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                    </svg>
                  </span>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Reels empty state */}
        {activeTab === "reels" && (
          <div className="upv-empty">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              width="48"
              height="48"
            >
              <circle cx="12" cy="12" r="10" />
              <polygon points="10 8 16 12 10 16 10 8" />
            </svg>
            <p>No reels yet</p>
          </div>
        )}

        {/* Tagged empty state */}
        {activeTab === "tagged" && (
          <div className="upv-empty">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              width="48"
              height="48"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <p>No tagged posts</p>
          </div>
        )}
      </main>

      {/* ── Mobile bottom nav ─────────────────────────────────── */}
      <MobileBottomNav currentUser={activeUser} />
    </div>
  );
}
