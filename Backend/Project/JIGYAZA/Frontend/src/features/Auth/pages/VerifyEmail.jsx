import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hook/useAuth';
import Loder from '../../../components/Loaders/loder/Loder';
import '../styles/Login.scss';

const VerifyEmail = () => {
  const [isAutoVerified, setIsAutoVerified] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isProcessing, setIsProcessing] = useState(true);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyDirectEmailLink, logoutUser } = useAuth();
  const attemptRef = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenParam = params.get("token");

    if (!tokenParam) {
      setErrorMsg("Verification link is invalid or corrupted.");
      setIsProcessing(false);
      return;
    }

    const runVerification = async () => {
      // Prevent React StrictMode double invocation
      if (attemptRef.current) return;
      attemptRef.current = true;

      try {
        await verifyDirectEmailLink(tokenParam);
        setIsAutoVerified(true);
      } catch (err) {
        // Assume failure means link expired, corrupted, etc.
        setErrorMsg(err?.errors?.[0]?.msg || err?.message || "Verification failed or link expired.");
      } finally {
        setIsProcessing(false);
      }
    };

    runVerification();
  }, [location.search, verifyDirectEmailLink]);

  return (
    <div className="login-container">
      {/* Left Panel: Matches Identity of Registration UI exactly */}
      <div className="left-panel">
        <motion.div 
          className="branding absolute top-12 left-12 z-10"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
        >
          <Loder size={32} color="#c7621a" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="brand-name font-serif">jigyazaAi</span>
            <div className="divider" />
            <span className="tagline font-mono">Research Engine</span>
          </div>
        </motion.div>

        <div className="illustration-zone">
          <div className="bg-gradient" />
          <motion.div 
            className="text-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <p className="subtitle font-mono">Instant Identity Path</p>
            <h1 className="font-serif">
              Securely unlocking <span className="text-primary">access.</span>
            </h1>
            <p className="font-display">Your research profile is being cryptographically confirmed.</p>
          </motion.div>
        </div>
      </div>

      <div className="right-panel">
        <motion.div 
          className="form-wrapper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '60%' }}
        >
          <AnimatePresence mode="wait">
            {isProcessing ? (
               <motion.div 
                  key="processing"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '220px', gap: '1.25rem' }}
               >
                 <Loder size={75} color="#c7621a" />
                 <p style={{ color: '#cbd5e1', fontWeight: 500, fontSize: '0.95rem', letterSpacing: '0.025em' }}>
                   Analyzing cryptographic token...
                 </p>
               </motion.div>
            ) : errorMsg ? (
               <motion.div 
                 key="error"
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -20 }}
                 style={{ textAlign: 'center' }}
               >
                 <span className="material-symbols-outlined" style={{ fontSize: '4rem', color: '#ef4444', marginBottom: '1rem' }}>cancel</span>
                 <h2 className="font-serif italic font-normal" style={{ marginBottom: '1rem' }}>Verification Error</h2>
                 <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>{errorMsg}</p>
                 <Link to="/register" style={{ color: '#c7621a', textDecoration: 'none', fontWeight: 'bold' }}>
                   &larr; Return to Sign Up
                 </Link>
               </motion.div>
            ) : isAutoVerified && (
               <motion.div
                 key="success"
                 className="auto-verified-success"
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.9 }}
                 transition={{ duration: 0.4, type: 'spring', damping: 20 }}
                 style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '380px', margin: '0 auto' }}
               >
                 <svg
                   width="100"
                   height="100"
                   viewBox="0 0 50 50"
                   fill="none"
                   xmlns="http://www.w3.org/2000/svg"
                 >
                   <motion.circle
                     cx="25"
                     cy="25"
                     r="22"
                     stroke="#10b981"
                     strokeWidth="3.5"
                     initial={{ pathLength: 0 }}
                     animate={{ pathLength: 1 }}
                     transition={{ duration: 0.55, ease: "easeOut" }}
                   />
                   <motion.path
                     d="M15 26l7 7 13-13"
                     stroke="#10b981"
                     strokeWidth="3.5"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     initial={{ pathLength: 0 }}
                     animate={{ pathLength: 1 }}
                     transition={{ delay: 0.45, duration: 0.4, ease: "easeOut" }}
                   />
                 </svg>
                 
                 <div style={{ textAlign: "center", marginTop: "2rem" }}>
                   <h3 className="font-serif italic" style={{ color: '#10b981', fontSize: '1.6rem', margin: '0 0 0.5rem 0', fontWeight: 'normal' }}>Identity Verified</h3>
                   <p style={{ color: '#cbd5e1', margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>Your email has been securely authenticated by the JigazyAi network.</p>
                 </div>
                 
                 <motion.button
                   type="button"
                   className="font-display"
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   onClick={async () => {
                     await logoutUser();
                     navigate('/login');
                   }}
                   style={{
                     marginTop: '2.5rem',
                     padding: '1rem 2rem',
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "center",
                     gap: "10px",
                     backgroundColor: "#10b981",
                     border: "none",
                     color: "#082f22",
                     fontWeight: "bold",
                     borderRadius: '8px',
                     cursor: 'pointer',
                     width: "100%",
                     fontSize: "1rem"
                   }}
                 >
                   Proceed to Login
                   <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>arrow_forward</span>
                 </motion.button>
               </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyEmail;
