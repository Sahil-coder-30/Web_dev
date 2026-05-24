import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import '../styles/Dashboard.scss';
import Loder from '../../../components/Loaders/loder/Loder';

const CodeBlock = ({ node, inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');
    const codeString = String(children).replace(/\n$/, '');
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(codeString);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    if (!inline) {
        return (
            <div className="code-block-wrapper">
                <div className="code-block-header">
                    <span className="lang-label">{match ? match[1] : 'text'}</span>
                    <button className="copy-code-btn" onClick={handleCopy} aria-label="Copy snippet">
                        {isCopied ? (
                            <><span className="material-symbols-outlined shrink">check</span> Copied!</>
                        ) : (
                            <><span className="material-symbols-outlined shrink">content_copy</span> Copy code</>
                        )}
                    </button>
                </div>
                <pre {...props}>
                    <code className={className}>
                        {children}
                    </code>
                </pre>
            </div>
        );
    }

    return <code className={className} {...props}>{children}</code>;
};

const AIMessageRow = React.memo(({ msg, isLast, isChatLoading }) => {
    const [displayedContent, setDisplayedContent] = useState("");
    const [isExpanded, setIsExpanded] = useState(true);
    const bufferRef = useRef("");
    const animationFrameRef = useRef(null);

    const targetContent = msg.content || "";
    const hasThinking = !!msg.thinking;
    const isThinkingDone = !isChatLoading || !!targetContent;

    // Automatically manage collapsible state of thinking block
    useEffect(() => {
        if (isThinkingDone) {
            setIsExpanded(false); // Collapse when done
        } else if (hasThinking) {
            setIsExpanded(true); // Keep open when actively thinking/searching
        }
    }, [isThinkingDone, hasThinking]);

    // Handle token buffer & smooth typing animation
    useEffect(() => {
        // If not active message, or not loading, or if the animation caught up, display full content immediately
        if (!isLast || !isChatLoading) {
            setDisplayedContent(targetContent);
            return;
        }

        bufferRef.current = targetContent;

        const tick = () => {
            setDisplayedContent((prev) => {
                const target = bufferRef.current;
                if (prev.length >= target.length) {
                    return prev;
                }
                // Add tokens smoothly
                const diff = target.length - prev.length;
                const step = Math.max(1, Math.min(3, Math.ceil(diff / 4)));
                return prev + target.slice(prev.length, prev.length + step);
            });

            animationFrameRef.current = requestAnimationFrame(tick);
        };

        animationFrameRef.current = requestAnimationFrame(tick);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [targetContent, isLast, isChatLoading]);

    return (
        <div className="ai-message-row message-reveal">
            <div className="ai-content">
                {hasThinking && (
                    <div className="thinking-block">
                        <div 
                            className="thinking-header" 
                            onClick={() => setIsExpanded(!isExpanded)}
                            style={{ cursor: 'pointer' }}
                        >
                            {!isThinkingDone ? (
                                <div className="thinking-spinner"></div>
                            ) : (
                                <span className="material-symbols-outlined check-icon">check_circle</span>
                            )}
                            <span className="thinking-title">
                                {!isThinkingDone ? "Searching & Analyzing..." : "Search & Thought Process"}
                            </span>
                            <span className="material-symbols-outlined arrow-icon" style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}>
                                keyboard_arrow_down
                            </span>
                        </div>
                        {isExpanded && (
                            <div className="thinking-details">
                                {msg.thinking}
                            </div>
                        )}
                    </div>
                )}
                {displayedContent ? (
                    <div className="msg-text-blocks markdown-body">
                        <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            components={{
                                code: CodeBlock
                            }}
                        >
                            {displayedContent}
                        </ReactMarkdown>
                    </div>
                ) : (
                    // Show formulating response while loader is spinning AND we aren't doing thinking actions
                    isChatLoading && isLast && !hasThinking && (
                        <div className="typing-indicator-row" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', margin: 0 }}>
                            <Loder size={20} color="#c7621a" />
                            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>Formulating response...</span>
                        </div>
                    )
                )}
                {displayedContent && (
                    <div className="ai-actions">
                        <button aria-label="Copy"><span className="material-symbols-outlined">content_copy</span></button>
                        <button aria-label="Like"><span className="material-symbols-outlined">thumb_up</span></button>
                        <button aria-label="Regenerate"><span className="material-symbols-outlined">refresh</span></button>
                    </div>
                )}
            </div>
        </div>
    );
}, (prevProps, nextProps) => {
    return prevProps.msg.content === nextProps.msg.content &&
           prevProps.msg.thinking === nextProps.msg.thinking &&
           prevProps.isLast === nextProps.isLast &&
           prevProps.isChatLoading === nextProps.isChatLoading;
});

const Chat = ({ isSidebarOpen, toggleSidebar, userName, messages, chatTitle, onNewChat, activeChatId, isChatLoading, handelSendMessage }) => {
    const [inputValue, setInputValue] = useState("");
    const [optimisticMessage, setOptimisticMessage] = useState(null);
    const endOfMessagesRef = useRef(null);

    // Auto-scroll logic when new messages or loading states arrive
    useEffect(() => {
        if (endOfMessagesRef.current) {
            endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isChatLoading, optimisticMessage]);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    };

    const handleSend = async () => {
        if (!inputValue.trim() || isChatLoading) return;
        
        const inputPayload = inputValue;
        setInputValue("");
        setOptimisticMessage(inputPayload);
        
        try {
            // Dispatch actual message directly to Backend via custom useChat Hook
            await handelSendMessage({ messages: inputPayload, chatId: activeChatId });
        } finally {
            setOptimisticMessage(null);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!isChatLoading) {
                handleSend();
            }
        }
    };

    return (
        <main className={`dashboard-main ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'} ${(messages.length === 0 && !optimisticMessage) ? 'new-chat-mode' : 'active-chat-mode'}`}>
            {/* Top Navigation Bar */}
            <header className="chat-header">
                <div className="header-left">
                    {!isSidebarOpen && (
                        <div 
                            className="sidebar-open-btn-fallback" 
                            onClick={toggleSidebar} 
                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            title="Open Sidebar"
                        >
                            <Loder size={28} color="#c7621a" />
                        </div>
                    )}
                    <h2>{chatTitle}</h2>
                </div>
                <div className="header-actions">
                    <button className="new-chat-header-btn" onClick={onNewChat} aria-label="New Chat" title="Start New Chat">
                        <span className="material-symbols-outlined">add</span>
                    </button>
                    <button className="icon-btn" aria-label="Share">
                        <span className="material-symbols-outlined">share</span>
                    </button>
                    <button className="icon-btn" aria-label="Bookmark">
                        <span className="material-symbols-outlined">bookmark</span>
                    </button>
                    <button className="icon-btn" aria-label="Expand">
                        <span className="material-symbols-outlined">open_in_full</span>
                    </button>
                </div>
            </header>

            {/* Message Thread */}
            {(messages.length > 0 || optimisticMessage) && (
                <div className="message-thread">
                    <div className="thread-container">
                       
                        <>
                            {messages.map((msg, index) => (
                                msg.role === 'user' ? (
                                    <div key={index} className="user-message-row message-reveal">
                                        <h3 className="prompt-text">{msg.content}</h3>
                                    </div>
                                ) : (
                                    <AIMessageRow 
                                        key={index}
                                        msg={msg}
                                        isLast={index === messages.length - 1}
                                        isChatLoading={isChatLoading}
                                    />
                                )
                            ))}

                            {/* Optimistic User Message */}
                            {optimisticMessage && (
                                <div className="user-message-row message-reveal">
                                    <h3 className="prompt-text">{optimisticMessage}</h3>
                                </div>
                            )}
                            
                            {/* Invisible Tracking Div to enforce auto-scrolling to the very bottom */}
                            <div ref={endOfMessagesRef} style={{ height: '30px' }} />
                        </>
                    </div>
                </div>
            )}

            {/* Input Area Container */}
            <div className="input-area-container">
                <div className="input-wrapper">

                    {messages.length === 0 && !optimisticMessage && (
                        <div className="new-chat-greeting message-reveal">
                            <div className="brand-logo-container">
                                <Loder size={40} color="#c7621a" />
                            </div>
                            <h1 className="greeting-text">{getGreeting()}, {userName}</h1>
                        </div>
                    )}

                    {/* Textarea Area */}
                    <div className="textarea-container">
                        <textarea 
                            placeholder={isChatLoading ? "AI is formulating a response..." : "Continue the research..."} 
                            rows="2"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        
                        <div className="input-actions-left">
                            <button type="button" aria-label="Attach File">
                                <span className="material-symbols-outlined">attach_file</span>
                            </button>
                            <button type="button" aria-label="Upload Image">
                                <span className="material-symbols-outlined">image</span>
                            </button>
                        </div>
                        
                        {/* Send button (Activating if input is present) */}
                        <button 
                            type="button"
                            className={`send-button ${inputValue.trim() && !isChatLoading ? 'active' : ''}`} 
                            aria-label="Send Message"
                            onClick={handleSend}
                            disabled={isChatLoading || !inputValue.trim()}
                        >
                            <span className="material-symbols-outlined">north</span>
                        </button>
                    </div>



                    {messages.length === 0 && !optimisticMessage && (
                        <div className="quick-chips message-reveal">
                            <div className="chip">
                                <span className="material-symbols-outlined icon">code</span>Code
                            </div>
                            <div className="chip">
                                <span className="material-symbols-outlined icon">edit</span>Write
                            </div>
                            <div className="chip">
                                <span className="material-symbols-outlined icon">school</span>Learn
                            </div>
                            <div className="chip">
                                <span className="material-symbols-outlined icon">psychology</span>Brainstorm
                            </div>
                            <div className="chip">
                                <span className="material-symbols-outlined icon">lightbulb</span>Jigyaza's Choice
                            </div>
                        </div>
                    )}

                    {/* Footer Disclaimer */}
                    <div className="disclaimer">
                        <p>Jigyaza AI · Responses may contain errors · Verify important facts</p>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Chat;
