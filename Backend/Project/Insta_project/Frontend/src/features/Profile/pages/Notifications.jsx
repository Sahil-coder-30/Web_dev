import React from "react";
import SettingsLayout from "./SettingsLayout";

// DS §12: ChevronIcon — 16px, color $text-muted
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

// DS §12: Toggle switch — .toggle > input + .toggle__track
// Replaces the old <input type="checkbox" style=...> pattern
const Toggle = ({ defaultChecked = false, id }) => (
    <label className="toggle" htmlFor={id}>
        <input type="checkbox" id={id} defaultChecked={defaultChecked} />
        <span className="toggle__track" />
    </label>
);

export default function Notifications() {
    return (
        <SettingsLayout title="Notifications">
            <h1 className="edit-profile-content__title">Notifications</h1>

            {/* DS §12: settings-list > settings-row pattern */}
            <div className="settings-list">

                {/* Toggle row — DS §12 */}
                <div className="settings-row">
                    <div className="settings-row__content">
                        <span className="settings-row__label">Pause all</span>
                        <span className="settings-row__sublabel">
                            Temporarily pause push notifications
                        </span>
                    </div>
                    <Toggle id="pause-all" defaultChecked={false} />
                </div>

                {/* Chevron rows — DS §12 settings-row--pressable */}
                <div className="settings-row settings-row--pressable">
                    <span className="settings-row__label">Posts, Stories and Comments</span>
                    <ChevronIcon />
                </div>

                <div className="settings-row settings-row--pressable">
                    <span className="settings-row__label">Following and Followers</span>
                    <ChevronIcon />
                </div>

                <div className="settings-row settings-row--pressable">
                    <span className="settings-row__label">Messages and Calls</span>
                    <ChevronIcon />
                </div>

                <div className="settings-row settings-row--pressable">
                    <span className="settings-row__label">Live and Reels</span>
                    <ChevronIcon />
                </div>

                <div className="settings-row settings-row--pressable">
                    <span className="settings-row__label">From Instagram</span>
                    <ChevronIcon />
                </div>

                <div className="settings-row settings-row--pressable">
                    <span className="settings-row__label">Other Notification Types</span>
                    <ChevronIcon />
                </div>

            </div>
        </SettingsLayout>
    );
}
