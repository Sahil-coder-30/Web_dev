import React from "react";
import SettingsLayout from "./SettingsLayout";

export default function EmailsFromInstagram() {
    return (
        <SettingsLayout title="Emails from Instagram">
            <h1 className="edit-profile-content__title">Emails from Instagram</h1>

            <p className="hint" style={{ marginBottom: '2rem', fontSize: '0.95rem' }}>
                Emails sent from Instagram within the last 14 days regarding security and login.
            </p>

            <div className="settings-list">
                <div className="settings-list-item">
                    <div className="settings-list-item__left">
                        <span className="settings-list-item__title">Security</span>
                        <span className="settings-list-item__desc">Recent security and login emails will appear here.</span>
                    </div>
                </div>

                <div className="settings-list-item">
                    <div className="settings-list-item__left">
                        <span className="settings-list-item__title">Other</span>
                        <span className="settings-list-item__desc">Other technical emails will appear here.</span>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#252528', borderRadius: '12px', border: '1px solid #313135' }}>
                <h3 style={{ marginBottom: '0.5rem', fontWeight: '600' }}>Stay Protected</h3>
                <p className="hint" style={{ color: '#a8a8a8', fontSize: '0.85rem' }}>
                    If you receive an email that looks like it's from Instagram but it doesn't appear here, it wasn't from us. Don't click any links in it.
                </p>
            </div>
        </SettingsLayout>
    );
}
