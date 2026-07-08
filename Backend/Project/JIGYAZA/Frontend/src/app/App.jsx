import React, { useState, useEffect } from "react";
import { Routes, Route, BrowserRouter, useNavigate } from "react-router-dom";
import EntryLoader from "../components/Loaders/EntryLoader/EntryLoader.jsx";
import LandingPage from "../features/LandingPage/LandingPage.jsx";
import Login from "../features/Auth/pages/Login.jsx";
import Register from "../features/Auth/pages/Register.jsx";
import VerifyEmail from "../features/Auth/pages/VerifyEmail.jsx";
import ForgotPassword from "../features/Auth/pages/ForgotPassword.jsx";
import CreatePassword from "../features/Auth/pages/CreatePassword.jsx";
import LoaderDemo from "../components/Loaders/loder/LoaderDemo.jsx";
import Loder from "../components/Loaders/loder/Loder.jsx";
import PrivacyInfo from "../features/Legal/pages/PrivacyInfo.jsx";
import TermsAndConditions from "../features/Legal/pages/TermsAndConditions.jsx";
import { useAuth } from "../features/Auth/hook/useAuth.js";
import Protected from "../components/Protected/Protected.jsx";
import Dashboard from "../features/chat/pages/Dashboard.jsx";

function App() {
  const auth = useAuth();
  const [showEntryLoader, setShowEntryLoader] = useState(
    window.location.pathname === "/",
  );
  const [init, setInit] = useState(true);

  useEffect(() => {
    // Check authentication status on app load
    const checkAuthStatus = async () => {
      try {
        // Try to fetch current user to check if authenticated
        await auth.fetchCurrentUser();
        // If successful, user is logged in
        const isLoggedIn = true;

        if (isLoggedIn || window.location.pathname !== "/") {
          setShowEntryLoader(false);
        } else {
          sessionStorage.setItem("hasSeenEntryLoader", "true");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        // If auth check fails, user is not logged in
        const isLoggedIn = false;

        if (isLoggedIn || window.location.pathname !== "/") {
          setShowEntryLoader(false);
        } else {
          sessionStorage.setItem("hasSeenEntryLoader", "true");
        }
      } finally {
        setInit(false);
      }
    };

    checkAuthStatus();
  }, [auth]);

  if (init) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "#0A0806",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.25rem",
          zIndex: 9999,
        }}
      >
        <Loder size={65} color="#c7621a" />
        <p style={{ color: '#cbd5e1', fontWeight: 500, fontSize: '0.95rem', letterSpacing: '0.025em', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          Loading your experience...
        </p>
      </div>
    );
  }

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
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/dashboard"
          element={
            <Protected>
             <Dashboard/>
            </Protected>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ForgotPassword />} />
        <Route path="/create-password" element={<CreatePassword />} />
        <Route path="/privacy" element={<PrivacyInfo />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/loader" element={<LoaderDemo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
