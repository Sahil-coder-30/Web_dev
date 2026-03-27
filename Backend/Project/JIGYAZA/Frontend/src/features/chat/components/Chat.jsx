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
        if (!inputValue.trim()) return;
        
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
            handleSend();
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
                                    <div key={index} className="ai-message-row message-reveal">
                                        <div className="ai-content">
                                            <div className="msg-text-blocks markdown-body">
                                                <ReactMarkdown 
                                                    remarkPlugins={[remarkGfm]}
                                                    components={{
                                                        code: CodeBlock
                                                    }}
                                                >
                                                    {msg.content}
                                                </ReactMarkdown>
                                            </div>
                                            <div className="ai-actions">
                                                <button aria-label="Copy"><span className="material-symbols-outlined">content_copy</span></button>
                                                <button aria-label="Like"><span className="material-symbols-outlined">thumb_up</span></button>
                                                <button aria-label="Regenerate"><span className="material-symbols-outlined">refresh</span></button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            ))}

                            {/* Optimistic User Message */}
                            {optimisticMessage && (
                                <div className="user-message-row message-reveal">
                                    <h3 className="prompt-text">{optimisticMessage}</h3>
                                </div>
                            )}

                            {/* Typing Indicator */}
                            {isChatLoading && (
                                <div className="typing-indicator-row message-reveal" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                    <Loder size={24} color="#c7621a" />
                                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>Extracting insights...</span>
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
                            placeholder="Continue the research..." 
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
                            className={`send-button ${inputValue.trim() ? 'active' : ''}`} 
                            aria-label="Send Message"
                            onClick={handleSend}
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
