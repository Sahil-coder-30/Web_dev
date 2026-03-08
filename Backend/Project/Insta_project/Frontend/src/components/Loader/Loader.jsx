import React from "react";
import "./Loader.scss";

export default function Loader({ size = "medium", fullScreen = false, text = "" }) {
    return (
        <div className={`loader-wrapper ${fullScreen ? "loader-wrapper--fullscreen" : ""}`}>
            <div className={`loader-spinner loader-spinner--${size}`}>
                <svg viewBox="0 0 50 50" className="loader-spinner__svg">
                    <circle
                        className="loader-spinner__circle"
                        cx="25"
                        cy="25"
                        r="20"
                        fill="none"
                        strokeWidth="4"
                    />
                </svg>
            </div>
            {text && <span className="loader-text">{text}</span>}
        </div>
    );
}
