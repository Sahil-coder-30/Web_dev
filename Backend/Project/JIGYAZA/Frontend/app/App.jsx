import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import EntryLoader from "../components/Loaders/EntryLoader/EntryLoader.jsx";
import LandingPage from "../features/LandingPage/LandingPage.jsx";
import Login from "../features/Auth/pages/Login.jsx";
import Register from "../features/Auth/pages/Register.jsx";
import LoaderDemo from "../components/Loaders/loder/LoaderDemo.jsx";
import PrivacyPolicy from "../features/Legal/pages/PrivacyPolicy.jsx";
import TermsAndConditions from "../features/Legal/pages/TermsAndConditions.jsx";

function App() {
  const [showEntryLoader, setShowEntryLoader] = useState(
    window.location.pathname === "/",
  );
  const [init, setInit] = useState(true);

  useEffect(() => {
    // MOCK API Call for /api/users/me (Wait for 500ms to simulate network)
    const checkAuthStatus = async () => {
      try {
        const isLoggedIn = false;

        await new Promise((resolve) => setTimeout(resolve, 500));

        if (isLoggedIn || window.location.pathname !== "/") {
          setShowEntryLoader(false);
        } else {
          sessionStorage.setItem("hasSeenEntryLoader", "true");
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
    <BrowserRouter>
      {showEntryLoader && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "#0A0806",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <EntryLoader onComplete={() => setShowEntryLoader(false)} />
        </div>
      )}

      {/* Render the actual App Routes underneath */}
      <Routes>
        <Route path="/" element={<LandingPage isReady={!showEntryLoader} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/loader" element={<LoaderDemo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
