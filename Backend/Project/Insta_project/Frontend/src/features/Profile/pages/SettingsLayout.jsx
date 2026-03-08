import React from "react";
import "../../Post/styles/feed.scss";
import "../styles/edit-profile.scss";
import DesktopSidebar from "../../Post/components/DesktopSidebar";
import MobileBottomNav from "../components/MobileBottomNav";
import MobileHeader from "../components/MobileHeader";
import SettingsSidebar from "../components/SettingsSidebar";

// Re-using same data source structure for UI placeholder
export const USER_PROFILE = {
    username: "alex_designs",
    name: "Alex Thompson",
    bio: "✨ Crafting digital experiences\n📍 Living life one pixel at a time\n👇 Check out my latest work",
    website: "alexdesigns.co",
    avatar: "https://i.pravatar.cc/150?img=11",
};

export default function SettingsLayout({ children, title = "Settings" }) {
    return (
        <div className="feed-layout settings-layout">
            <DesktopSidebar currentUser={USER_PROFILE} />
            <main className="feed-main settings-main">
                <MobileHeader title={title} />
                <div className="settings-container">
                    <SettingsSidebar />
                    <section className="edit-profile-content">
                        {children}
                    </section>
                </div>
            </main>
            <MobileBottomNav currentUser={USER_PROFILE} />
        </div>
    );
}
