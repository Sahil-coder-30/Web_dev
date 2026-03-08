import React from "react";
import SettingsLayout from "./SettingsLayout";

// DS §12: ChevronIcon — 16px, color $text-muted via .settings-row__chevron
const ChevronIcon = () => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="settings-row__chevron"
    >
        <path d="M9 18l6-6-6-6" />
    </svg>
);

export default function PrivacySecurity() {
    return (
        <SettingsLayout title="Privacy and security">
            <h1 className="edit-profile-content__title">Privacy and security</h1>

            {/* DS §12: settings-list > settings-row pattern */}
            <div className="settings-list">

                <div className="settings-row settings-row--pressable">
                    <div className="settings-row__content">
                        <span className="settings-row__label">Account Privacy</span>
                        <span className="settings-row__sublabel">Public</span>
                    </div>
                    <ChevronIcon />
                </div>

                <div className="settings-row settings-row--pressable">
                    <div className="settings-row__content">
                        <span className="settings-row__label">Interactions</span>
                        <span className="settings-row__sublabel">
                            Manage comments, tags, and story replies
                        </span>
                    </div>
                    <ChevronIcon />
                </div>

                <div className="settings-row settings-row--pressable">
                    <div className="settings-row__content">
                        <span className="settings-row__label">Your Activity</span>
                        <span className="settings-row__sublabel">
                            Time spent, deleted recently, archived
                        </span>
                    </div>
                    <ChevronIcon />
                </div>

                <div className="settings-row settings-row--pressable">
                    <div className="settings-row__content">
                        <span className="settings-row__label">Security</span>
                        <span className="settings-row__sublabel">
                            Passwords, two-factor authentication, data download
                        </span>
                    </div>
                    <ChevronIcon />
                </div>

                <div className="settings-row settings-row--pressable">
                    <span className="settings-row__label">Blocked Accounts</span>
                    <ChevronIcon />
                </div>

            </div>
        </SettingsLayout>
    );
}
