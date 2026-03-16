import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './features/Auth/pages/Login';
import Register from './features/Auth/pages/Register';
import LoaderDemo from './components/Loaders/loder/LoaderDemo';
import EntryLoader from './components/Loaders/EntryLoader/EntryLoader';

function App() {
  const [showEntryLoader, setShowEntryLoader] = useState(true);
  const [init, setInit] = useState(true);

  useEffect(() => {
    // Check if we've already shown the loader in this session
    const hasSeenLoader = sessionStorage.getItem('hasSeenEntryLoader');

    // MOCK API Call for /api/users/me (Wait for 500ms to simulate network)
    const checkAuthStatus = async () => {
      try {
        // [TODO]: Replace this with actual axios/fetch call to backend:
        // const response = await axios.get('/api/users/me');
        // const isLoggedIn = response.data.success;
        
        // Mocking a response returning false (User is NOT logged in)
        const isLoggedIn = false; 
        
        // Add artificial delay to simulate network latency
        await new Promise(resolve => setTimeout(resolve, 500));

        if (isLoggedIn) {
          // Don't show entry animation for logged-in recurrent users
          setShowEntryLoader(false);
        } else if (hasSeenLoader) {
          // Don't show if they've already seen it this session even if not logged in
          setShowEntryLoader(false);
        } else {
          // First visit for an unauthenticated user!
          sessionStorage.setItem('hasSeenEntryLoader', 'true');
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setShowEntryLoader(false);
      } finally {
        setInit(false);
      }
    };

    checkAuthStatus();
  }, []);

  if (init) return null; // Prevent flash of content before checking storage

  return (
    <>
      {showEntryLoader && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: '#0A0806',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <EntryLoader onComplete={() => setShowEntryLoader(false)} />
        </div>
      )}

      {/* Render the actual App Routes underneath */}
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/loader" element={<LoaderDemo />} />
        <Route path="/entry-loader" element={<EntryLoader />} />
      </Routes>
    </>
  );

}

export default App;
