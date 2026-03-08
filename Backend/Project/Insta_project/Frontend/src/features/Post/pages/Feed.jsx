import React, { useEffect, useMemo } from "react";
import "../styles/feed.scss";
import DesktopSidebar from "../components/DesktopSidebar";
import MobileHeader from "../components/MobileHeader";
import PostCard from "../components/PostCard";
import RightSidebar from "../components/RightSidebar";
import MobileBottomNav from "../components/MobileBottomNav";
import { usePost } from "../Hooks/usePost";
import { FeedSkeleton } from "../../../components/Skeletons";
import { useAuth } from "../../Auth/hooks/useAuth";

// ─── Static placeholder data ───────────────────────────────────────────────────

const SUGGESTIONS = [
  {
    id: 1,
    username: "design_daily",
    reason: "Followed by art_guru + 2 more",
    avatar: `https://i.pravatar.cc/150?img=10`,
  },
  {
    id: 2,
    username: "pixel_perfect",
    reason: "Suggested for you",
    avatar: `https://i.pravatar.cc/150?img=11`,
  },
  {
    id: 3,
    username: "tech_insider",
    reason: "New to Instagram",
    avatar: `https://i.pravatar.cc/150?img=12`,
  },
  {
    id: 4,
    username: "minimal_home",
    reason: "Followed by decor_fan",
    avatar: `https://i.pravatar.cc/150?img=13`,
  },
  {
    id: 5,
    username: "coffee_vibes",
    reason: "Suggested for you",
    avatar: `https://i.pravatar.cc/150?img=14`,
  },
];

// ─── Main Feed Page ────────────────────────────────────────────────────────────
const Feed = () => {
  const { loading, post, feed, getFeed } = usePost();
  const { currentUserData, currentUser } = useAuth();

  useEffect(() => {
    // Initial load
    currentUserData();
    getFeed();

    // Auto-refresh every 60 seconds to pick up new posts
    const interval = setInterval(() => {
      getFeed();
    }, 60_000);

    return () => clearInterval(interval);
  }, []);

  const POSTS = feed?.posts;
  const CURRENT_USER = currentUser;
  

  // useMemo MUST be above any early return — Rules of Hooks
  const postsList = useMemo(() => {
    if (!POSTS) return null;

    // Fisher-Yates shuffle — randomises order on every feed fetch,
    // stays stable between re-renders (useMemo caches until feed changes)
    const shuffled = [...POSTS];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.map((post) => (
      <PostCard key={post._id} post={post} currentUser={CURRENT_USER} />
    ));
  }, [feed]);

  // Show full-page skeleton while the first load is in-flight
  if (loading || !feed) {
    return <FeedSkeleton />;
  }

  return (
    <div className="feed-layout">
      {/* Left sidebar — hidden on mobile, shows on ≥768px */}
      <DesktopSidebar currentUser={CURRENT_USER} />

      {/* Centre column */}
      <main className="feed-main">
        {/* Mobile-only top header */}
        <MobileHeader />
        {/* Posts */}
        <div className="feed-main__posts">
          {postsList}
        </div>
      </main>

      {/* Right sidebar — desktop only (≥1024px) */}
      <RightSidebar currentUser={CURRENT_USER} suggestions={SUGGESTIONS} />

      {/* Mobile bottom nav — hidden on ≥768px */}
      <MobileBottomNav currentUser={CURRENT_USER} />
    </div>
  );
};

export default Feed;
