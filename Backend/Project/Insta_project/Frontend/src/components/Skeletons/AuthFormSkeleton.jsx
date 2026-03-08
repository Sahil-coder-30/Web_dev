import React from "react";
import "./Skeletons.scss";

/**
 * AuthFormSkeleton
 * Mirrors the .auth-main > .form-container card exactly.
 * Used while useAuth() is resolving (loading state).
 *
 * @param {"login"|"register"} variant
 *   "login"    → 2 input rows  (username + password)
 *   "register" → 5 input rows  (fullName, username, email, bio, password)
 */
export default function AuthFormSkeleton({ variant = "login" }) {
    const inputCount = variant === "register" ? 5 : 2;

    return (
        <div
            className={`auth-sk${variant === "register" ? " auth-sk--register" : ""}`}
            aria-hidden="true"
        >
            <div className="auth-sk__card">

                {/* Logo — Grand Hotel wordmark placeholder (pill) */}
                <div className="auth-sk__logo" />

                {/* Input fields */}
                <div className="auth-sk__inputs">
                    {Array.from({ length: inputCount }, (_, i) => (
                        <div key={i} className="auth-sk__input" />
                    ))}
                </div>

                {/* Submit button */}
                <div className="auth-sk__btn" />

                {/* Footer — "Don't have an account? Sign Up" */}
                <div className="auth-sk__footer">
                    <span className="auth-sk__footer-text" />
                    <span className="auth-sk__footer-link" />
                </div>

            </div>
        </div>
    );
}
