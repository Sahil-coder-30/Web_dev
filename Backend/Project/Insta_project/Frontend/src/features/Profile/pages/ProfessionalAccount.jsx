import React from "react";
import SettingsLayout from "./SettingsLayout";

const ChevronIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
);

export default function ProfessionalAccount() {
    return (
        <SettingsLayout title="Professional account">
            <h1 className="edit-profile-content__title">Professional account</h1>

            <div className="settings-list">
                <div className="settings-list-item">
                    <div className="settings-list-item__left">
                        <span className="settings-list-item__title">Account Type</span>
                        <span className="settings-list-item__desc">Creator</span>
                    </div>
                    <div className="settings-list-item__right"><ChevronIcon /></div>
                </div>

                <div className="settings-list-item">
                    <div className="settings-list-item__left">
                        <span className="settings-list-item__title">Switch to Business Account</span>
                        <span className="settings-list-item__desc">Best for retailers, local businesses, brands</span>
                    </div>
                    <div className="settings-list-item__right"><ChevronIcon /></div>
                </div>

                <div className="settings-list-item">
                    <div className="settings-list-item__left">
                        <span className="settings-list-item__title">Category</span>
                        <span className="settings-list-item__desc">Digital Creator (Hidden on profile)</span>
                    </div>
                    <div className="settings-list-item__right"><ChevronIcon /></div>
                </div>

                <div className="settings-list-item">
                    <div className="settings-list-item__left">
                        <span className="settings-list-item__title" style={{ color: '#ed4956' }}>Switch to Personal Account</span>
                        <span className="settings-list-item__desc">You will lose access to professional insights</span>
                    </div>
                </div>
            </div>
        </SettingsLayout>
    );
}
