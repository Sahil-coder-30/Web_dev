import React from 'react';
import './ChatSkeleton.scss';

/**
 * ChatSkeleton — shown while fetchChatMessages is in progress.
 * Renders 3 shimmer "conversation pairs" to mimic a real chat thread.
 */
const ChatSkeleton = () => {
    return (
        <div className="chat-skeleton">
            {/* Simulate 3 message pairs */}
            {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton-pair">
                    {/* User message bubble — right aligned */}
                    <div className="skeleton-user-row">
                        <div className="skeleton-bubble user" style={{ width: `${45 + i * 10}%` }} />
                    </div>

                    {/* AI response — left aligned, multi-line */}
                    <div className="skeleton-ai-row">
                        <div className="skeleton-avatar" />
                        <div className="skeleton-ai-lines">
                            <div className="skeleton-line" style={{ width: '92%' }} />
                            <div className="skeleton-line" style={{ width: '78%' }} />
                            <div className="skeleton-line" style={{ width: '65%' }} />
                            {i === 2 && <div className="skeleton-line" style={{ width: '50%' }} />}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ChatSkeleton;
