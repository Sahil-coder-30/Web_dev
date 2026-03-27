import React, { useEffect, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useChat } from '../Hooks/useChat';
import { useAuth } from '../../Auth/hook/useAuth';
import { setcurrentChatId } from '../chat.slice';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.scss'
import Sidebar from '../components/Sidebar';
import Chat from '../components/Chat';

const Dashboard = () => {
    // Note: If state.auth.user is already the user object, `const user = useSelector(...)` is usually correct, but keeping your original logic.
    const userState = useSelector(state => state.auth.user);
    const loadingState = useSelector(state => state.auth.loading);
    const chat = useChat();
    const auth = useAuth();
    const navigate = useNavigate();

    // Responsive Sidebar State
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    console.log(userState);
    
    // Safely extract user properties if they exist
    const userName = userState?.user?.username || 'J. Kurosawa';
    const userInitials = userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    useEffect(() => {
        const initChat = async () => {
            if (chat && chat.inializeSocketConnection) {
                chat.inializeSocketConnection();
            }
            if (chat && chat.fetchChats) {
                await chat.fetchChats();
                const storedChatId = localStorage.getItem('lastActiveChatId');
                
                if (storedChatId) {
                    dispatch(setcurrentChatId(storedChatId));
                    if (chat && chat.fetchChatMessages) {
                        // Dynamically pull history to prevent blank view
                        chat.fetchChatMessages(storedChatId);
                    }
                }
            }
        };
        
        initChat();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Handle initial responsive hook on mount
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) setIsSidebarOpen(false);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const dispatch = useDispatch();
    const chats = useSelector(state => state.chat.chats) || {};
    const activeChatId = useSelector(state => state.chat.currentChatId);
    const isChatLoading = useSelector(state => state.chat.isLoading);

    // Sync current session state gracefully into localStorage
    useEffect(() => {
        if (activeChatId) {
            localStorage.setItem('lastActiveChatId', activeChatId);
        } else {
            localStorage.removeItem('lastActiveChatId');
        }
    }, [activeChatId]);

    // Derived states
    const currentChat = activeChatId ? chats[activeChatId] : null;
    const messages = currentChat && currentChat.message ? currentChat.message.map(m => ({ role: m.role, content: m.message || m.content })) : [];
    const chatTitle = currentChat ? currentChat.title : "New Research";

    // Derived History directly from Redux Mapping
    const chatHistory = useMemo(() => {
        return Object.values(chats).map(chat => {
            
            // Render basic MM/DD/YYYY timeframe
            const dateObj = new Date(chat.lastUpdated);
            const timeStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            
            // Extract the last message string for the sidebar preview desc
            const msgArray = chat.message || [];
            let preview = "No content available";
            if (msgArray.length > 0) {
                const lastMsgObj = msgArray[msgArray.length - 1];
                const rawString = lastMsgObj.message || lastMsgObj.content;
                preview = (typeof rawString === 'string') ? rawString : "No content available";
            }
            
            return {
                id: chat.id,
                title: chat.title,
                time: timeStr.toUpperCase(),
                desc: preview.length > 40 ? preview.substring(0, 40) + "..." : preview
            };
        }).sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
    }, [chats]);

    const handleNewChat = () => {
        dispatch(setcurrentChatId(null));
        if (window.innerWidth < 1024) setIsSidebarOpen(false);
    };

    const handleLoadChat = (chatData) => {
        // mockHistory uses .id, real API uses ._id
        const targetId = chatData._id || chatData.id;
        
        if (chat && chat.fetchChatMessages) {
            chat.fetchChatMessages(targetId);
        }
        
        dispatch(setcurrentChatId(targetId));
        if (window.innerWidth < 1024) setIsSidebarOpen(false);
    };

    const handleLogout = async () => {
        try {
            await auth.logoutUser();
            localStorage.removeItem('lastActiveChatId'); // Clear cached state securely
            navigate('/login');
        } catch (error) {
            console.error("Failed to sign out:", error);
        }
    };

    // Calculate mind-blowing Galactic Core Rotation Parallax
    const { smallStars, mediumStars, largeStars } = useMemo(() => {
        const generateStars = (count) => 
            Array.from({ length: count }).map((_, i) => ({
                id: i,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.7 + 0.3,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 3 + 2}s`
            }));

        return {
            smallStars: generateStars(150),
            mediumStars: generateStars(50),
            largeStars: generateStars(15),
        };
    }, []);

    return (
        <div className={`dashboard-layout dark ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'} ${messages.length > 0 ? 'is-active-session' : ''}`}>
            {/* Ambient Galactic Starfield */}
            <div className="galactic-star-field">
                <div className="parallax-layer layer-small">
                    {smallStars.map(star => (
                        <div key={`small-${star.id}`} className="star small" style={{ top: star.top, left: star.left, opacity: star.opacity, animationDelay: star.animationDelay, animationDuration: star.animationDuration }} />
                    ))}
                </div>
                <div className="parallax-layer layer-medium">
                    {mediumStars.map(star => (
                        <div key={`medium-${star.id}`} className="star medium" style={{ top: star.top, left: star.left, opacity: star.opacity, animationDelay: star.animationDelay, animationDuration: star.animationDuration }} />
                    ))}
                </div>
                <div className="parallax-layer layer-large">
                    {largeStars.map(star => (
                        <div key={`large-${star.id}`} className="star large" style={{ top: star.top, left: star.left, opacity: star.opacity, animationDelay: star.animationDelay, animationDuration: star.animationDuration }} />
                    ))}
                </div>
                
                {/* Occasional Shooting Stars */}
                <div className="shooting-star" style={{ top: '10%', left: '80%', animationDelay: '2s' }}></div>
                <div className="shooting-star" style={{ top: '30%', right: '10%', animationDelay: '15s' }}></div>
                <div className="shooting-star" style={{ top: '5%', left: '40%', animationDelay: '27s' }}></div>
            </div>

            {/* SIDEBAR */}
            <Sidebar 
                isOpen={isSidebarOpen} 
                toggle={() => setIsSidebarOpen(!isSidebarOpen)}
                userInitials={userInitials} 
                userName={userName} 
                onNewChat={handleNewChat}
                history={chatHistory}
                onLoadChat={handleLoadChat}
                activeChatId={activeChatId}
                onDeleteChat={chat.deleteChatProcess}
                onLogout={handleLogout}
            />

            {/* MAIN CHAT PANEL */}
            <Chat 
                isSidebarOpen={isSidebarOpen} 
                toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
                userName={userName}
                messages={messages}
                chatTitle={chatTitle}
                onNewChat={handleNewChat}
                handelSendMessage={chat.handelSendMessage}
                activeChatId={activeChatId}
                isChatLoading={isChatLoading}
            />

            {/* Visual Polish: Light Source Overlay */}
            <div className="visual-polish-overlay">
                <div className="glow-blob"></div>
            </div>
            
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div className="mobile-overlay" onClick={() => setIsSidebarOpen(false)}></div>
            )}
        </div>
    );
};

export default Dashboard;
