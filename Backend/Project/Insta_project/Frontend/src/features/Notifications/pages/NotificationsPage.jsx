import React, { useState } from "react";
import { Link } from "react-router";
import DesktopSidebar from "../../Post/components/DesktopSidebar";
import MobileBottomNav from "../../Profile/components/MobileBottomNav";
import { getFollowRequests, acceptFollowRequest, rejectFollowRequest } from "../../Profile/services/profile.api";
import { useAuth } from "../../Auth/hooks/useAuth";
import "../styles/notifications.scss";


// ─── Mock activity notifications ──────────────────────────────────────────────
const ACTIVITY = [
    // TODAY
    {
        id: "n_001",
        type: "like",
        username: "travel_diaries",
        avatar: "https://i.pravatar.cc/150?img=3",
        message: "liked your photo.",
        timestamp: "12m",
        postThumb: "https://picsum.photos/seed/notif1/100/100",
        isRead: false,
        group: "Today",
    },
    {
        id: "n_002",
        type: "follow",
        username: "pixel_perfect",
        avatar: "https://i.pravatar.cc/150?img=11",
        message: "started following you.",
        timestamp: "45m",
        postThumb: null,
        isRead: false,
        group: "Today",
    },
    {
        id: "n_003",
        type: "comment",
        username: "design_daily",
        avatar: "https://i.pravatar.cc/150?img=10",
        message: 'commented: "Absolutely stunning shot! 🔥"',
        timestamp: "2h",
        postThumb: "https://picsum.photos/seed/notif2/100/100",
        isRead: false,
        group: "Today",
    },
    {
        id: "n_004",
        type: "like",
        username: "coffee_vibes",
        avatar: "https://i.pravatar.cc/150?img=14",
        message: "liked your photo.",
        timestamp: "3h",
        postThumb: "https://picsum.photos/seed/notif3/100/100",
        isRead: true,
        group: "Today",
    },
    {
        id: "n_005",
        type: "mention",
        username: "techie_nyc",
        avatar: "https://i.pravatar.cc/150?img=18",
        message: "mentioned you in a comment.",
        timestamp: "4h",
        postThumb: "https://picsum.photos/seed/notif4/100/100",
        isRead: true,
        group: "Today",
    },
    // THIS WEEK
    {
        id: "n_006",
        type: "like",
        username: "minimal_home",
        avatar: "https://i.pravatar.cc/150?img=13",
        message: "and 6 others liked your photo.",
        timestamp: "2d",
        postThumb: "https://picsum.photos/seed/notif5/100/100",
        isRead: true,
        group: "This Week",
    },
    {
        id: "n_007",
        type: "follow",
        username: "art_guru",
        avatar: "https://i.pravatar.cc/150?img=8",
        message: "started following you.",
        timestamp: "2d",
        postThumb: null,
        isRead: true,
        group: "This Week",
    },
    {
        id: "n_008",
        type: "comment",
        username: "ui_spark",
        avatar: "https://i.pravatar.cc/150?img=22",
        message: 'commented: "Love the composition ✨"',
        timestamp: "3d",
        postThumb: "https://picsum.photos/seed/notif6/100/100",
        isRead: true,
        group: "This Week",
    },
    {
        id: "n_009",
        type: "like",
        username: "wanderlust_k",
        avatar: "https://i.pravatar.cc/150?img=27",
        message: "liked your reel.",
        timestamp: "4d",
        postThumb: "https://picsum.photos/seed/notif7/100/100",
        isRead: true,
        group: "This Week",
    },
    // THIS MONTH
    {
        id: "n_010",
        type: "follow",
        username: "studio.kai",
        avatar: "https://i.pravatar.cc/150?img=31",
        message: "started following you.",
        timestamp: "2w",
        postThumb: null,
        isRead: true,
        group: "This Month",
    },
    {
        id: "n_011",
        type: "like",
        username: "neon_pixels",
        avatar: "https://i.pravatar.cc/150?img=34",
        message: "and 24 others liked your photo.",
        timestamp: "3w",
        postThumb: "https://picsum.photos/seed/notif8/100/100",
        isRead: true,
        group: "This Month",
    },
];

// ─── SVG Icons ─────────────────────────────────────────────────────────────────
const HeartFilledIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
);

const HeartIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
);

const CommentIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
);

const PersonAddIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <line x1="19" y1="8" x2="19" y2="14" />
        <line x1="22" y1="11" x2="16" y2="11" />
    </svg>
);

const MentionIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="4" />
        <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" />
    </svg>
);

const CheckIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const XIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const BackIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M15 18l-6-6 6-6" />
    </svg>
);

// ─── Type badge icon inside avatar ────────────────────────────────────────────
const TypeBadge = ({ type }) => {
    const config = {
        like: { icon: <HeartFilledIcon />, cls: "notif-badge notif-badge--like" },
        comment: { icon: <CommentIcon />, cls: "notif-badge notif-badge--comment" },
        follow: { icon: <PersonAddIcon />, cls: "notif-badge notif-badge--follow" },
        mention: { icon: <MentionIcon />, cls: "notif-badge notif-badge--mention" },
    };
    const { icon, cls } = config[type] ?? config.like;
    return <span className={cls}>{icon}</span>;
};

// ─── Skeleton row ─────────────────────────────────────────────────────────────
const SkeletonRow = () => (
    <div className="notif-skeleton">
        <div className="skeleton skeleton--circle" style={{ width: 44, height: 44, flexShrink: 0 }} />
        <div className="notif-skeleton__lines">
            <div className="skeleton skeleton--line skeleton--w70" />
            <div className="skeleton skeleton--line skeleton--w45" />
        </div>
        <div className="skeleton" style={{ width: 46, height: 46, borderRadius: 4, flexShrink: 0 }} />
    </div>
);

// ─── Follow‑request card ──────────────────────────────────────────────────────
const FollowRequestCard = ({ req, onAccept, onDecline }) => (
    <div className="follow-req-card">
        <Link to={`/user/${req.username}`} className="follow-req-card__left">
            <div className="avatar-wrap">
                <img src={req.avatar} alt={`@${req.username}`} className="avatar avatar--md" />
            </div>
            <div className="follow-req-card__info">
                <span className="follow-req-card__username">{req.username}</span>
                <span className="follow-req-card__sub">
                    {req.mutualFollowers > 0
                        ? `${req.mutualFollowers} mutual · ${req.timestamp} ago`
                        : `Wants to follow you · ${req.timestamp} ago`}
                </span>
            </div>
        </Link>

        <div className="follow-req-card__actions">
            <button
                id={`accept-${req.id}`}
                className="follow-req-card__btn follow-req-card__btn--accept"
                onClick={() => onAccept(req.id)}
                aria-label={`Confirm follow request from ${req.username}`}
            >
                <CheckIcon />
                <span>Confirm</span>
            </button>
            <button
                id={`decline-${req.id}`}
                className="follow-req-card__btn follow-req-card__btn--decline"
                onClick={() => onDecline(req.id)}
                aria-label={`Delete follow request from ${req.username}`}
            >
                <XIcon />
                <span>Delete</span>
            </button>
        </div>
    </div>
);

// ─── Activity row ─────────────────────────────────────────────────────────────
const ActivityRow = ({ item, style }) => (
    <div
        className={`notif-row${item.isRead ? "" : " notif-row--unread"}`}
        style={style}
        role="listitem"
    >
        {/* Avatar + type badge */}
        <div className="notif-row__avatar-wrap">
            <Link to={`/user/${item.username}`}>
                <img src={item.avatar} alt={`@${item.username}`} className="avatar avatar--md" />
            </Link>
            <TypeBadge type={item.type} />
        </div>

        {/* Text */}
        <div className="notif-row__content">
            <p className="notif-row__text">
                <Link to={`/user/${item.username}`} className="notif-row__username">
                    {item.username}
                </Link>{" "}
                <span className="notif-row__message">{item.message}</span>{" "}
                <span className="notif-row__time">{item.timestamp} ago</span>
            </p>
        </div>

        {/* Right slot — post thumbnail or Follow button */}
        {item.postThumb ? (
            <div className="notif-row__thumb">
                <img src={item.postThumb} alt="post" />
            </div>
        ) : (
            <div className="notif-row__cta">
                <button className="btn btn--outline btn--sm">Follow</button>
            </div>
        )}
    </div>
);

// ─── Main page ────────────────────────────────────────────────────────────────
export default function NotificationsPage() {
    const { currentUser } = useAuth();
    const [requests, setRequests] = useState([]);
    const [showAllRequests, setShowAllRequests] = useState(false);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const fetchRequests = async () => {
            try {
                const data = await getFollowRequests();
                // Backend: { message, followRequestExist: [{follower, followee, status}] }
                const list = Array.isArray(data?.followRequestExist) ? data.followRequestExist : [];
                const mapped = list.map((r) => ({
                    id: r.follower,           // follower username — used for API calls
                    username: r.follower,
                    displayName: r.follower,
                    avatar: `https://i.pravatar.cc/150?u=${r.follower}`,
                    mutualFollowers: 0,
                    timestamp: "recently",
                }));
                setRequests(mapped);
            } catch (err) {
                console.error("Failed to fetch follow requests:", err);
                setRequests([]);
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, []);

    // Accept — POST /api/users/follow/accept/:username (username = follower's username)
    const handleAccept = async (followerUsername) => {
        try {
            await acceptFollowRequest(followerUsername);
            setRequests((prev) => prev.filter((r) => r.id !== followerUsername));
        } catch (err) {
            console.error("Failed to accept follow request:", err);
        }
    };

    // Decline — POST /api/users/follow/reject/:username (username = follower's username)
    const handleDecline = async (followerUsername) => {
        try {
            await rejectFollowRequest(followerUsername);
            setRequests((prev) => prev.filter((r) => r.id !== followerUsername));
        } catch (err) {
            console.error("Failed to decline follow request:", err);
        }
    };

    // group activity by period
    const GROUPS = ["Today", "This Week", "This Month"];
    const grouped = GROUPS.reduce((acc, g) => {
        const items = ACTIVITY.filter((n) => n.group === g);
        if (items.length) acc[g] = items;
        return acc;
    }, {});

    const unreadCount = ACTIVITY.filter((n) => !n.isRead).length;
    const visibleRequests = showAllRequests ? requests : requests.slice(0, 2);
    const hasContent = requests.length > 0 || ACTIVITY.length > 0;

    return (
        <div className="feed-layout notif-layout">
            {/* ── Left / Desktop Sidebar ─────────────────────────────────────── */}
            <DesktopSidebar currentUser={currentUser} />

            {/* ── Main Column ───────────────────────────────────────────────── */}
            <main className="notif-main" id="notifications-main">

                {/* Mobile-only sticky top bar */}
                <nav className="notif-mobile-header" aria-label="Notifications">
                    <Link to="/" className="icon-btn notif-mobile-header__back" aria-label="Back">
                        <BackIcon />
                    </Link>
                    <span className="notif-mobile-header__title">
                        Notifications
                        {unreadCount > 0 && (
                            <span className="notif-mobile-header__badge">{unreadCount}</span>
                        )}
                    </span>
                    {/* Spacer for centering */}
                    <div style={{ width: 36 }} />
                </nav>

                {/* Desktop page title */}
                <header className="notif-page-header">
                    <h1 className="notif-page-header__title">Notifications</h1>
                    {unreadCount > 0 && (
                        <span className="notif-page-header__new">{unreadCount} new</span>
                    )}
                </header>

                {/* ── Scrollable content ──────────────────────────────────────── */}
                <div className="notif-scroll">

                    {/* Skeleton loading state */}
                    {loading && (
                        <div className="notif-section">
                            <div className="notif-section__head">
                                <div className="skeleton skeleton--line skeleton--w35" style={{ height: 14 }} />
                            </div>
                            {[1, 2, 3, 4].map((i) => <SkeletonRow key={i} />)}
                        </div>
                    )}

                    {/* Real content */}
                    {!loading && (
                        <>
                            {/* ── Follow Requests ─────────────────────────────────── */}
                            {requests.length > 0 && (
                                <section className="notif-section" aria-label="Follow Requests">
                                    <div className="notif-section__head">
                                        <h2 className="notif-section__title">Follow Requests</h2>
                                        <span className="notif-section__count">{requests.length}</span>
                                        {requests.length > 2 && (
                                            <button
                                                id="toggle-all-requests"
                                                className="notif-section__see-all"
                                                onClick={() => setShowAllRequests((v) => !v)}
                                            >
                                                {showAllRequests
                                                    ? "Show less"
                                                    : `See all ${requests.length}`}
                                            </button>
                                        )}
                                    </div>

                                    <div className="follow-req-list" role="list">
                                        {visibleRequests.map((req, idx) => (
                                            <FollowRequestCard
                                                key={req.id}
                                                req={req}
                                                onAccept={handleAccept}
                                                onDecline={handleDecline}
                                                style={{ animationDelay: `${idx * 0.05}s` }}
                                            />
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* ── Activity ─────────────────────────────────────────── */}
                            {Object.entries(grouped).map(([group, items]) => (
                                <section className="notif-section" key={group} aria-label={group}>
                                    <div className="notif-section__head">
                                        <h2 className="notif-section__title">{group}</h2>
                                    </div>
                                    <div className="notif-list" role="list">
                                        {items.map((item, idx) => (
                                            <ActivityRow
                                                key={item.id}
                                                item={item}
                                                style={{ animationDelay: `${idx * 0.04}s` }}
                                            />
                                        ))}
                                    </div>
                                </section>
                            ))}

                            {/* ── Empty state ───────────────────────────────────────── */}
                            {!hasContent && (
                                <div className="notif-empty" role="status">
                                    <span className="notif-empty__icon">
                                        <HeartIcon />
                                    </span>
                                    <p className="notif-empty__title">Activity On Your Posts</p>
                                    <p className="notif-empty__sub">
                                        When someone likes or comments on one of your posts,
                                        you'll see it here.
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>

            {/* ── Mobile Bottom Nav ────────────────────────────────────────────── */}
            <MobileBottomNav currentUser={currentUser} />
        </div>
    );
}
