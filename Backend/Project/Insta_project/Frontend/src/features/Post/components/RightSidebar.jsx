import React from "react";

// DS §1: Avatar — .avatar.avatar--sm for current user, .avatar.avatar--xs for suggestions
// DS Global Resilience: .truncate + .flex-safe on all user-info rows
const RightSidebar = ({ currentUser, suggestions }) => (
    <aside className="feed-right-sidebar">

        {/* Current user row */}
        <div className="feed-right-sidebar__current-user">
            {/* DS §1: no story ring in sidebar — just bare avatar */}
            <div className="avatar-wrap">
                <img
                    src={currentUser?.profileImage}
                    alt={currentUser?.username}
                    className="avatar avatar--sm"
                />
            </div>
            {/* flex-safe + truncate prevent overflow */}
            <div className="feed-right-sidebar__user-info flex-safe">
                <span className="feed-right-sidebar__username truncate">
                    {currentUser?.username}
                </span>
                <span className="feed-right-sidebar__name truncate">
                    {currentUser?.fullName}
                </span>
            </div>
            {/* DS §2: ghost button = .btn.btn--ghost variant */}
            <button className="btn btn--ghost btn--sm">Switch</button>
        </div>

        {/* Suggestions header */}
        <div className="feed-right-sidebar__suggestions-header">
            <span className="feed-right-sidebar__suggestions-title">Suggested for you</span>
            <button className="btn btn--ghost btn--sm">See All</button>
        </div>

        {/* Suggestion list */}
        <ul className="feed-right-sidebar__suggestions">
            {suggestions.map((s) => (
                <li key={s.id} className="feed-right-sidebar__suggestion-item">
                    {/* DS §1: avatar--xs, no story ring for suggestions */}
                    <div className="avatar-wrap">
                        <img
                            src={s.profileImage}
                            alt={s.username}
                            className="avatar avatar--xs"
                            style={{ width: 32, height: 32 }}
                        />
                    </div>
                    {/* flex-safe + truncate prevent long usernames from breaking layout */}
                    <div className="feed-right-sidebar__sugg-info flex-safe">
                        <span className="feed-right-sidebar__sugg-username truncate">
                            {s.username}
                        </span>
                        <span className="feed-right-sidebar__sugg-reason truncate">
                            {s.reason}
                        </span>
                    </div>
                    {/* DS §2: ghost follow button */}
                    <button className="btn btn--ghost btn--sm">Follow</button>
                </li>
            ))}
        </ul>

        {/* Footer */}
        <footer className="feed-right-sidebar__footer">
            <nav className="feed-right-sidebar__footer-links">
                {["About", "Help", "Press", "API", "Jobs", "Privacy", "Terms", "Locations"].map((l) => (
                    <a key={l} href="#" className="feed-right-sidebar__footer-link">{l}</a>
                ))}
            </nav>
            <p className="feed-right-sidebar__copyright">© 2025 INSTAGRAM FROM META</p>
        </footer>

    </aside>
);

export default RightSidebar;
