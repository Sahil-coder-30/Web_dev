import React from "react";
import "../../Post/styles/feed.scss";
import "../styles/edit-profile.scss";
import SettingsLayout, { USER_PROFILE } from "./SettingsLayout";
import ProfilePhotoUpload from "../components/ProfilePhotoUpload";

// DS §13: Form field wrapper component
const InputField = ({ id, label, children, hint, charCount }) => (
    <div className="input-group">
        <label className="input-group__label" htmlFor={id}>{label}</label>
        {children}
        {hint && <span className="input-group__hint">{hint}</span>}
        {charCount !== undefined && (
            <span className="input-group__char-count">{charCount}</span>
        )}
    </div>
);

export default function EditProfile() {
    return (
        <SettingsLayout title="Edit Profile">
            <h1 className="edit-profile-content__title">Edit Profile</h1>

            {/* Profile Photo Upload Component */}
            <ProfilePhotoUpload
                currentAvatar={USER_PROFILE.avatar}
                username={USER_PROFILE.username}
                name={USER_PROFILE.name}
            />

            {/* DS §13: All fields use .input-group > .input-group__field */}
            <form className="edit-profile-form" onSubmit={(e) => e.preventDefault()}>

                <InputField
                    id="name"
                    label="Name"
                    hint="You can only change your name twice within 14 days."
                >
                    <input
                        className="input-group__field"
                        type="text"
                        id="name"
                        defaultValue={USER_PROFILE.name}
                        placeholder="Name"
                        readOnly
                    />
                </InputField>

                <InputField
                    id="username"
                    label="Username"
                    hint={`In most cases, you'll be able to change your username back to ${USER_PROFILE.username} for another 14 days.`}
                >
                    <input
                        className="input-group__field"
                        type="text"
                        id="username"
                        defaultValue={USER_PROFILE.username}
                        placeholder="Username"
                        readOnly
                    />
                </InputField>

                <InputField
                    id="website"
                    label="Website"
                    hint="Editing your links is only available on mobile."
                >
                    <input
                        className="input-group__field"
                        type="text"
                        id="website"
                        defaultValue={USER_PROFILE.website}
                        placeholder="Website"
                        readOnly
                    />
                </InputField>

                <InputField
                    id="bio"
                    label="Bio"
                    charCount="0 / 150"
                >
                    <textarea
                        className="input-group__field input-group__field--textarea"
                        id="bio"
                        defaultValue={USER_PROFILE.bio}
                        placeholder="Bio"
                        readOnly
                        rows={4}
                    />
                </InputField>

                <InputField
                    id="gender"
                    label="Gender"
                    hint="This won't be part of your public profile."
                >
                    <select
                        className="input-group__field"
                        id="gender"
                        defaultValue="male"
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="custom">Custom</option>
                        <option value="prefer_not">Prefer not to say</option>
                    </select>
                </InputField>

                {/* DS §12: Toggle row — replaces raw checkbox with .toggle component */}
                <div className="settings-row" style={{ padding: '0.6rem 0', border: 'none' }}>
                    <div className="settings-row__content">
                        <span className="settings-row__label" style={{ fontSize: '0.875rem' }}>
                            Show account suggestions on profiles
                        </span>
                        <span className="settings-row__sublabel">
                            Choose whether people can see similar account suggestions on your profile.
                        </span>
                    </div>
                    {/* DS §12: .toggle > input + .toggle__track */}
                    <label className="toggle" htmlFor="account-suggestions">
                        <input
                            type="checkbox"
                            id="account-suggestions"
                            defaultChecked
                        />
                        <span className="toggle__track" />
                    </label>
                </div>

                {/* DS §2: btn--primary submit */}
                <div className="form-actions">
                    <button className="btn btn--primary submit-btn" type="submit">
                        Submit
                    </button>
                </div>

            </form>
        </SettingsLayout>
    );
}
