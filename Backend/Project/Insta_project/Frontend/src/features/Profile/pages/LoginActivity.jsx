import React from "react";
import SettingsLayout from "./SettingsLayout";

export default function LoginActivity() {
    return (
        <SettingsLayout title="Login Activity">
            <h1 className="edit-profile-content__title">Login activity</h1>

            <div className="login-activity-wrap">
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Was This You?</h3>
                    <p className="hint" style={{ color: '#a8a8a8', fontSize: '0.9rem' }}>We noticed a login from a device or location you don't usually use.</p>
                </div>

                <h3 style={{ fontWeight: '600', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #313135' }}>Active now</h3>
                <div className="settings-list" style={{ marginBottom: '2rem' }}>
                    <div className="settings-list-item">
                        <div className="settings-list-item__left">
                            <span className="settings-list-item__title">iPhone 14</span>
                            <span className="settings-list-item__desc">Mumbai, India • <span style={{ color: '#28a745' }}>Active now</span></span>
                        </div>
                    </div>
                </div>

                <h3 style={{ fontWeight: '600', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #313135' }}>Older</h3>
                <div className="settings-list" style={{ marginBottom: '2rem' }}>
                    <div className="settings-list-item">
                        <div className="settings-list-item__left">
                            <span className="settings-list-item__title">MacBook Pro</span>
                            <span className="settings-list-item__desc">Delhi, India • Yesterday at 10:45 AM</span>
                        </div>
                    </div>
                    <div className="settings-list-item">
                        <div className="settings-list-item__left">
                            <span className="settings-list-item__title">iPhone 14</span>
                            <span className="settings-list-item__desc">Bangalore, India • 3 days ago</span>
                        </div>
                    </div>
                    <div className="settings-list-item">
                        <div className="settings-list-item__left">
                            <span className="settings-list-item__title">Chrome on Windows</span>
                            <span className="settings-list-item__desc">Mumbai, India • July 12, 2023</span>
                        </div>
                    </div>
                    <div className="settings-list-item">
                        <div className="settings-list-item__left">
                            <span className="settings-list-item__title">iPad Pro</span>
                            <span className="settings-list-item__desc">Pune, India • June 28, 2023</span>
                        </div>
                    </div>
                    <div className="settings-list-item">
                        <div className="settings-list-item__left">
                            <span className="settings-list-item__title">Samsung Galaxy Tab</span>
                            <span className="settings-list-item__desc">Mumbai, India • May 15, 2023</span>
                        </div>
                    </div>
                </div>

                <p className="hint" style={{ color: '#a8a8a8', fontSize: '0.9rem' }}>If you don't recognize a login, we recommend changing your password right away.</p>
                <button className="btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '0.8rem' }}>Change Password</button>
            </div>
        </SettingsLayout>
    );
}
