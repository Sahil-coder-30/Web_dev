import React from "react";
import SettingsLayout from "./SettingsLayout";

const ChevronIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
);

export default function Help() {
    return (
        <SettingsLayout title="Help">
            <h1 className="edit-profile-content__title">Help</h1>

            <div className="settings-list">
                <div className="settings-list-item">
                    <div className="settings-list-item__left">
                        <span className="settings-list-item__title">Report a Problem</span>
                    </div>
                    <div className="settings-list-item__right"><ChevronIcon /></div>
                </div>

                <div className="settings-list-item">
                    <div className="settings-list-item__left">
                        <span className="settings-list-item__title">Account Status</span>
                    </div>
                    <div className="settings-list-item__right"><ChevronIcon /></div>
                </div>

                <div className="settings-list-item">
                    <div className="settings-list-item__left">
                        <span className="settings-list-item__title">Help Center</span>
                    </div>
                    <div className="settings-list-item__right"><ChevronIcon /></div>
                </div>

                <div className="settings-list-item">
                    <div className="settings-list-item__left">
                        <span className="settings-list-item__title">Privacy and Security Help</span>
                    </div>
                    <div className="settings-list-item__right"><ChevronIcon /></div>
                </div>

                <div className="settings-list-item">
                    <div className="settings-list-item__left">
                        <span className="settings-list-item__title">Support Requests</span>
                    </div>
                    <div className="settings-list-item__right"><ChevronIcon /></div>
                </div>
            </div>
        </SettingsLayout>
    );
}
