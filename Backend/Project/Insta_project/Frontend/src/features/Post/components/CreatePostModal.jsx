import React, { useRef, useState, useEffect } from "react";
import "../styles/create-post.scss";
import { CreatePostModalSkeleton } from "../../../components/Skeletons";
import { usePost } from "../Hooks/usePost";

export default function CreatePostModal({ isOpen, onClose }) {
    const fileInputRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(null);   // File object → for upload
    const [previewUrl, setPreviewUrl] = useState(null);         // blob URL → for <img> preview
    const [caption, setCaption] = useState("");
    const { createPost, getFeed } = usePost();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Show skeleton immediately on open, reveal real content after 400ms
    const [isReady, setIsReady] = useState(false);
    useEffect(() => {
        if (isOpen) {
            setIsReady(false);
            const t = setTimeout(() => setIsReady(true), 400);
            return () => clearTimeout(t);
        }
    }, [isOpen]);

    if (!isOpen) return null;


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);                          // store File for upload
            setPreviewUrl(URL.createObjectURL(file));        // blob URL just for preview
        }

    };

    const handleBackdropClick = (e) => {
        if (e.target.classList.contains("modal-overlay")) {
            onClose();
            setSelectedImage(null);
            setPreviewUrl(null);
            setCaption("");
        }
    };

    const handleShare = async () => {
        if (!selectedImage || isSubmitting) return;
        try {
            setIsSubmitting(true);
            await createPost(caption, selectedImage);  // wait for upload
            await getFeed();                           // refresh feed
            onClose();
            setSelectedImage(null);
            setPreviewUrl(null);
            setCaption("");
        } catch (error) {
            console.error("Failed to create post:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Show skeleton body inside the modal while opening or submitting
    if (!isReady || isSubmitting) {
        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <div className="modal-header">
                        <span className="sk-line sk-line--lg" style={{ width: "45%" }} />
                        <span className="sk-circle" style={{ width: 32, height: 32 }} />
                    </div>
                    <div className="modal-body" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", padding: "2rem" }}>
                        <span className="sk-circle" style={{ width: 64, height: 64 }} />
                        <span className="sk-line" style={{ width: "60%" }} />
                        <span className="sk-rect sk-rect--pill" style={{ width: 160, height: 36 }} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-overlay" onClick={handleBackdropClick}>
            <div className="modal-content">
                <div className="modal-header">
                    <h3 className="modal-header__title">Create new post</h3>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {selectedImage && (
                            <button className="btn btn--ghost btn--sm" onClick={handleShare}>
                                Share
                            </button>
                        )}
                        <button className="icon-btn" onClick={onClose} aria-label="Close">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="modal-body">
                    {!selectedImage ? (
                        <div className="upload-area" onClick={() => fileInputRef.current?.click()}>
                            <svg className="upload-area__icon" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                            <span className="upload-area__text">Drag photos and videos here</span>
                            <button className="btn btn--primary btn--sm" style={{ marginTop: '0.5rem' }}>
                                Select from computer
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="preview-container">
                                <img src={previewUrl} alt="Post preview" className="preview-img" />
                                <button
                                    className="btn btn--outline btn--sm change-photo-btn"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    Change photo
                                </button>
                            </div>
                            <textarea
                                className="caption-input"
                                placeholder="Write a caption..."
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                            />
                        </>
                    )}

                    <input
                        type="file"
                        accept="image/*,video/*"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                    />
                </div>
            </div>
        </div>
    );
}
