import React, { useRef, useState } from "react";
import "../../Post/styles/feed.scss";
import "../styles/edit-profile.scss";

export default function ProfilePhotoUpload({ currentAvatar, username, name }) {
    const [avatar, setAvatar] = useState(currentAvatar);
    const fileInputRef = useRef(null);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // For now, just create an object URL to preview the image locally
            const objectUrl = URL.createObjectURL(file);
            setAvatar(objectUrl);

            // In a real app, you would upload the file to the backend here:
            // const formData = new FormData();
            // formData.append("profileImage", file);
            // uploadProfilePhoto(formData);
        }
    };

    return (
        <div className="edit-profile-card__avatar-row">
            <img
                src={avatar}
                alt="Avatar"
                className="avatar avatar--md"
            />
            <div className="edit-profile-card__avatar-info">
                <span className="user">{username}</span>
                <span className="name">{name}</span>
            </div>

            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handlePhotoChange}
                style={{ display: "none" }}
            />

            <button
                type="button"
                className="btn btn--primary btn--sm"
                onClick={() => fileInputRef.current?.click()}
            >
                Change photo
            </button>
        </div>
    );
}
