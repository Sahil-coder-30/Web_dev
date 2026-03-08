import React, { useEffect } from "react";
import "../styles/profile.scss";

import DesktopSidebar from "../../Post/components/DesktopSidebar";
import MobileBottomNav from "../components/MobileBottomNav";
import MobileProfileHeader from "../components/MobileProfileHeader";
import { useProfile } from "../hooks/useProfile";
import ProfileSkeleton from "../../../components/Skeletons/ProfileSkeleton";

// ─── Static placeholder data ─────────────────────────────────────────────────
// const USER_PROFILE = {
//   username: "alex_designs",
//   name: "Alex Thompson",
//   category: "Digital Creator",
//   bio: "✨ Crafting digital experiences\n📍 Living life one pixel at a time\n👇 Check out my latest work",
//   website: "alexdesigns.co",
//   avatar: "https://i.pravatar.cc/150?img=11",
//   stats: { posts: 142, followers: "12.5k", following: 458 },
// };

const HIGHLIGHTS = [
  {
    id: 1,
    name: "Highlights",
    cover:
      "https://images.unsplash.com/photo-1542314831-c53cd4185af1?w=150&q=80",
  },
  {
    id: 2,
    name: "fun",
    cover:
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=150&q=80",
  },
];

// const PROFILE_POSTS = [
//   "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80",
//   "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80",
//   "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
//   "https://images.unsplash.com/photo-1542314831-c53cd4185af1?w=600&q=80",
//   "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80",
//   "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80",
//   "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=600&q=80",
//   "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&q=80",
//   "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
// ];

// Shared stat items — rendered once, positioned by CSS
const StatItems = ({ posts, followers, following }) => (
  <div className="profile-header__stats">
    <div className="stat-item">
      <span className="stat-item__value">{posts ?? 18}</span>
      <span className="stat-item__label">posts</span>
    </div>
    <div className="stat-item">
      <span className="stat-item__value">{followers ?? 168}</span>
      <span className="stat-item__label">followers</span>
    </div>
    <div className="stat-item">
      <span className="stat-item__value">{following ?? 158}</span>
      <span className="stat-item__label">following</span>
    </div>
  </div>
);

// Action buttons — shared between mobile and desktop positions
const ActionButtons = ({ className = "" }) => (
  <div className={`profile-header__actions ${className}`}>
    <a
      href="/edit-profile"
      className="btn profile-btn profile-header__btn"
    >
      Edit Profile
    </a>
    <button className="btn profile-btn profile-header__btn">
      View archive
    </button>
  </div>
);

export default function Profile() {
  const { getProfileData, getAllPosts, profileData, postsData, loading, Allfollowers, followers, Allfollowing, following } =
    useProfile();

  useEffect(() => {
    getProfileData();
    getAllPosts();
  }, []);

  useEffect(() => {
    if (profileData?.username) {
      Allfollowers(profileData.username);
      Allfollowing(profileData.username);
    }
  }, [profileData?.username]);

  if (loading) {
    return <ProfileSkeleton />;
  }
  const completeProfile = profileData || {};
  const { posts } = postsData || {};
  const followersData = followers || [];
  const followingData = following || [];
  const PROFILE_POSTS = posts;
  const USER_PROFILE = completeProfile;

  return (
    <div className="feed-layout">
      <DesktopSidebar currentUser={USER_PROFILE} />

      <main className="profile-main">
        {/* Mobile navbar — shows username at top */}
        <MobileProfileHeader currentUser={USER_PROFILE} />

        {/* ── PROFILE HEADER ──────────────────────────────────────────
                  Layout:
                  Mobile  (<768px): [avatar 86px] | [stats]
                                     [bio block]
                                     [action buttons — full width]
                  Desktop (≥768px): [avatar 150px] | [username + actions]
                                                      [stats]
                                                      [bio block]
                ─────────────────────────────────────────────────────────── */}
        <section className="profile-header">
          {/* ── Col 1: Avatar ── */}
          <div className="profile-header__avatar-col">
            <div className="avatar-wrap avatar-wrap--story">
              <img
                src={USER_PROFILE?.profileImage}
                alt={USER_PROFILE?.username}
                className="avatar avatar--xl"
              />
            </div>
          </div>

          {/* ── Col 2: Info ── */}
          <div className="profile-header__info">
            {/* Row 1 — desktop only: username + inline action buttons
                              Hidden on mobile; MobileProfileHeader shows username in navbar */}
            <div className="profile-header__username-row">
              <div className="profile-header__name-group">
                <h2 className="profile-header__username-text">
                  {USER_PROFILE?.fullName}
                </h2>
                <span className="profile-header__username-sub">
                  @{USER_PROFILE?.username}
                </span>
              </div>
              <ActionButtons className="profile-header__actions--desktop" />
            </div>

            {/* Row 2: Stats
                              Mobile: shows in info col (to the right of avatar) — compact
                              Desktop: shows below username row */}
            <StatItems
              posts={PROFILE_POSTS?.length || 0}
              followers={followersData?.length || 0}
              following={followingData?.length || 0}
            />

            {/* Row 3: Bio block */}
            <div className="profile-header__bio">
              {USER_PROFILE?.fullName && (
                <p className="profile-header__name">{USER_PROFILE.fullName}</p>
              )}
              {USER_PROFILE?.category && (
                <p className="profile-header__category">
                  {USER_PROFILE.category}
                </p>
              )}
              {USER_PROFILE?.bio && (
                <p className="profile-header__bio-text word-safe">
                  {USER_PROFILE.bio.split("\n").map((line, i, arr) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < arr.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </p>
              )}
              {USER_PROFILE?.website && (
                <a
                  href={`https://${USER_PROFILE.website}`}
                  className="profile-header__link"
                  target="_blank"
                  rel="noreferrer"
                >
                  {USER_PROFILE.website}
                </a>
              )}
            </div>
          </div>
        </section>

        {/* ── MOBILE-ONLY BIO BLOCK ────────────────────────────────────
                    On mobile, bio is hidden inside profile-header__bio (not enough space).
                    This full-width section renders it below the header row.
                    Hidden on desktop (bio shows inside header info col).
                ─────────────────────────────────────────────────────────────── */}
        <div className="profile-bio-mobile">
          {USER_PROFILE?.fullName && (
            <p className="profile-bio-mobile__name">{USER_PROFILE.fullName}</p>
          )}
          {USER_PROFILE?.username && (
            <p className="profile-bio-mobile__username">@{USER_PROFILE.username}</p>
          )}
          {USER_PROFILE?.category && (
            <p className="profile-bio-mobile__category">
              {USER_PROFILE.category}
            </p>
          )}
          {USER_PROFILE?.bio && (
            <p className="profile-bio-mobile__text word-safe">
              {USER_PROFILE.bio.split("\n").map((line, i, arr) => (
                <React.Fragment key={i}>
                  {line}
                  {i < arr.length - 1 && <br />}
                </React.Fragment>
              ))}
            </p>
          )}
          {USER_PROFILE?.website && (
            <a
              href={`https://${USER_PROFILE.website}`}
              className="profile-bio-mobile__link"
              target="_blank"
              rel="noreferrer"
            >
              {USER_PROFILE.website}
            </a>
          )}
        </div>

        {/* ── MOBILE-ONLY ACTION BUTTONS ────────────────────────────────
                    On mobile, action buttons appear below bio (full-width).
                    On desktop, they appear inline with username inside the header.
                ─────────────────────────────────────────────────────────────── */}
        <div className="profile-actions-mobile">
          <a
            href="/edit-profile"
            className="btn profile-btn profile-header__btn"
          >
            Edit Profile
          </a>
          <button className="btn profile-btn profile-header__btn">
            View archive
          </button>
        </div>

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
            <div className="highlight-item">
              <div className="highlight-item__ring highlight-item__ring--new">
                <div className="highlight-item__inner">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    width="22"
                    height="22"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </div>
              </div>
              <span className="highlight-item__label">New</span>
            </div>
          </div>
        </section>

        {/* ── PROFILE TABS ── */}
        <div className="profile-tabs">
          <button
            className="profile-tabs__tab profile-tabs__tab--active"
            aria-label="Posts"
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
          <button className="profile-tabs__tab" aria-label="Reels">
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
          <button className="profile-tabs__tab" aria-label="Saved">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </button>
          <button className="profile-tabs__tab" aria-label="Tagged">
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

        {/* ── POST GRID — repeat(3, minmax(0,1fr)) never overflows ── */}
        <section className="post-grid">
          {PROFILE_POSTS?.map((posts, idx) => (
            <div key={idx} className="post-grid__item">
              <img
                src={posts.imgUrl}
                alt="" /* empty alt — decorative grid images */
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
                  4.5k
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
                  128
                </span>
              </div>
            </div>
          ))}
        </section>
      </main>

      <MobileBottomNav currentUser={USER_PROFILE} />
    </div>
  );
}
