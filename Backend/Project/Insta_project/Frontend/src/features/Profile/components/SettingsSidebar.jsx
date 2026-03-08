import React from "react";
import { Link, useLocation } from "react-router";

const SettingsSidebar = () => {
    const location = useLocation();

    const getNavClass = (path) => {
        return `settings-sidebar__nav-item ${location.pathname === path ? 'settings-sidebar__nav-item--active' : ''}`;
    };

    return (
        <aside className="settings-sidebar">
            <h2 className="settings-sidebar__title">Settings</h2>
            <nav className="settings-sidebar__nav">
                <Link to="/edit-profile" className={getNavClass('/edit-profile')}>
                    <span>Edit Profile</span>
                </Link>
                <Link to="/settings/professional" className={getNavClass('/settings/professional')}>
                    <span>Professional account</span>
                </Link>
                <Link to="/settings/notifications" className={getNavClass('/settings/notifications')}>
                    <span>Notifications</span>
                </Link>
                <Link to="/settings/privacy" className={getNavClass('/settings/privacy')}>
                    <span>Privacy and security</span>
                </Link>
                <Link to="/settings/login-activity" className={getNavClass('/settings/login-activity')}>
                    <span>Login activity</span>
                </Link>
                <Link to="/settings/emails" className={getNavClass('/settings/emails')}>
                    <span>Emails from Instagram</span>
                </Link>
                <Link to="/settings/help" className={getNavClass('/settings/help')}>
                    <span>Help</span>
                </Link>
                <Link to="#" className="settings-sidebar__nav-item text-brand">
                    <span>Meta Accounts Center</span>
                </Link>
            </nav>
        </aside>
    );
};

export default SettingsSidebar;
