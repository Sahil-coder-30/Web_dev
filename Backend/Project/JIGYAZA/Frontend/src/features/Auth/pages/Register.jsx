import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Loder from "../../../components/Loaders/loder/Loder";
import "../styles/Register.scss";
import { useAuth } from "../hook/useAuth";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";


const Register = () => {
  const [step, setStep] = useState(1); // 1 = Registration Form, 2 = OTP Verification
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const otpInputs = useRef([]);
  const [timer, setTimer] = useState(10);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState("");
  const [verifyError, setVerifyError] = useState("");
  const [isAutoVerified, setIsAutoVerified] = useState(false);
  const { registerUser, fetchCurrentUser, verifyUserOtp, resendUserOtp, logoutUser, checkUserAutoVerify } = useAuth();
  const navigate = useNavigate();

  // Safely grab user from Redux store (state.auth.user can be null initially)
  const authUserPayload = useSelector((state) => state.auth.user);
  const user = authUserPayload?.user || authUserPayload;
  const isAuthLoading = useSelector((state) => state.auth.loading);

  // Auto-routing based on Redux user state
  useEffect(() => {
    if (!isAuthLoading && user) {
      if (user.verified) {
        // Redux already considers them verified (edge case). They still need
        // to login to acquire a token if they just registered.
        logoutUser().then(() => navigate('/login'));
      } else {
        setStep(2); // If registered but not verified = stay on OTP step
      }
    }
  }, [user, isAuthLoading, navigate, logoutUser]);

  // Background polling: wait for user to click verification link in their email
  useEffect(() => {
    let pollInterval;
    if (step === 2 && user && !user.verified && !isAutoVerified) {
      pollInterval = setInterval(async () => {
        try {
          const isVerified = await checkUserAutoVerify(user.email);
          if (isVerified) {
            // User clicked the link! Trigger the beautiful completion animation.
            clearInterval(pollInterval);
            setIsAutoVerified(true);
          }
        } catch (e) {
          // ignore polling errors
        }
      }, 5000); // Check every 5 seconds
    }
    return () => clearInterval(pollInterval);
  }, [step, user?.verified, checkUserAutoVerify, isAutoVerified, user?.email]);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.username || !formData.email || !formData.password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!acceptedTerms) {
      setError("You must accept the Terms and Conditions and Privacy Policy.");
      return;
    }

    setLoading(true);
    try {
      await registerUser(formData.username, formData.email, formData.password);
      setStep(2);
      setLoading(false);
    } catch (err) {
      setError( err.message || "Registration failed. Please try again.");
      setLoading(false);
      return;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let interval;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return false;

    // Only take the last character entered
    const val = value.substring(value.length - 1);

    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Focus next input securely using refs, ignoring DOM siblings
    if (val !== "" && index < 5 && otpInputs.current[index + 1]) {
      otpInputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Navigate backwards on Backspace if current field is empty
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0 &&
      otpInputs.current[index - 1]
    ) {
      otpInputs.current[index - 1].focus();
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    try {
      if (!user?.email) throw new Error("User email not found");
      await resendUserOtp(user.email);
      setCanResend(false);
      setTimer(10); // Reset to 5 minutes (300 seconds) since the backend sets it to 5 min
      setOtp(new Array(6).fill("")); // Reset OTP inputs
      if (otpInputs.current[0]) otpInputs.current[0].focus();
    } catch (e) {
      setVerifyError(e?.errors?.[0]?.msg || e?.message || "Failed to resend OTP");
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setVerifyError("");

    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setVerifyError("Please enter the full 6-digit code.");
      return;
    }

    setLoading(true);
    try {
      if (!user?.email) throw new Error("Session expired. Please log in again.");
      await verifyUserOtp(user.email, otpValue);
      // Validated OTP successfully in the backend. 
      // Unload dummy session and move them to login to acquire a token!
      await logoutUser();
      navigate('/login');
    } catch (e) {
      setVerifyError(e?.errors?.[0]?.msg || e?.message || "Invalid verification code.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      setStep(1); // Since we are already on /register, resetting the step natively shows the register form again
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
    exit: { opacity: 0 },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  // We natively use the Loder component for the brand logo now!

  return (
    <AnimatePresence mode="wait">
      {step === 1 ? (
        <motion.div
          key="register"
          className="register-container"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {/* Left Panel: Mascot Nova & Branding */}
          <div className="left-panel">
            <div className="bg-stars star-field" />
            <motion.div className="branding-top" variants={itemVariants}>
              <Loder size={32} color="#c7621a" />
              <span className="brand-name font-display">jigyazaAi</span>
            </motion.div>

            <motion.div className="mascot-area" variants={itemVariants}>
              <div className="mascot-wrapper">
                <div className="mascot-circle">
                  <div className="lab-coat" />
                  <div className="nova-head">
                    <div className="eyes">
                      <div className="eye" />
                      <div className="eye" />
                    </div>
                  </div>
                </div>
                <div className="telescope">
                  <div className="lens" />
                </div>
                <div className="floating-star">
                  <span className="material-symbols-outlined text-5xl">
                    star
                  </span>
                </div>
              </div>
              <div className="text-center">
                <h2 className="font-serif italic">
                  Start your <span className="text-primary">journey.</span>
                </h2>
                <p className="font-display">
                  Join the next generation of researchers.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Panel: Registration Form */}
          <div className="right-panel">
            <div className="mobile-logo">
              <Loder size={28} color="#c7621a" />
              <span className="brand-name font-display">jigyazaAi</span>
            </div>

            <motion.div className="form-wrapper" variants={containerVariants}>
              <motion.h1 className="font-serif italic" variants={itemVariants}>
                Create your account
              </motion.h1>

              <motion.form
                onSubmit={handleRegisterSubmit}
                variants={containerVariants}
              >
                <AnimatePresence>
                  {error && (
                    <motion.div
                      className="error-message"
                      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                      animate={{
                        opacity: 1,
                        height: "auto",
                        marginBottom: "1.5rem",
                      }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      style={{
                        backgroundColor: "rgba(239, 68, 68, 0.05)",
                        border: "1px solid rgba(239, 68, 68, 0.2)",
                        color: "#ef4444",
                        padding: "0.875rem 1rem",
                        borderRadius: "0.5rem",
                        fontSize: "0.875rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        overflow: "hidden",
                      }}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: "1.125rem" }}
                      >
                        error
                      </span>
                      <span>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {loading ? (
                  <motion.div
                    className="loading-overlay"
                    key="registration-loading-overlay"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      minHeight: "280px",
                      gap: "1.25rem",
                    }}
                  >
                    <Loder size={65} color="#c7621a" />
                    <p
                      style={{
                        color: "#cbd5e1",
                        fontWeight: 500,
                        fontSize: "0.95rem",
                        letterSpacing: "0.025em",
                      }}
                    >
                      Creating your account...
                    </p>
                  </motion.div>
                ) : (
                  <>
                    <motion.div className="input-group" variants={itemVariants}>
                      <label htmlFor="username">Username</label>
                      <div className="input-container">
                        <input
                          id="username"
                          name="username"
                          type="text"
                          placeholder="nova_researcher"
                          value={formData.username}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </motion.div>

                    <motion.div className="input-group" variants={itemVariants}>
                      <label htmlFor="email">Email address</label>
                      <div className="input-container">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="nova@jigyaza.ai"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </motion.div>

                    <motion.div className="input-group" variants={itemVariants}>
                      <label htmlFor="password">Password</label>
                      <div className="input-container">
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <span className="material-symbols-outlined">
                            {showPassword ? "visibility" : "visibility_off"}
                          </span>
                        </button>
                      </div>
                    </motion.div>

                    <motion.div
                      className="input-group checkbox-group"
                      variants={itemVariants}
                      style={{
                        flexDirection: "row",
                        alignItems: "flex-start",
                        gap: "0.75rem",
                        marginTop: "0.5rem",
                        marginBottom: "1.5rem",
                      }}
                    >
                      <div className="custom-checkbox">
                        <input
                          type="checkbox"
                          id="terms"
                          checked={acceptedTerms}
                          onChange={(e) => setAcceptedTerms(e.target.checked)}
                          required
                          style={{
                            cursor: "pointer",
                            width: "16px",
                            height: "16px",
                            accentColor: "#c7621a",
                            marginTop: "4px",
                          }}
                        />
                      </div>
                      <label
                        htmlFor="terms"
                        style={{
                          fontSize: "0.85rem",
                          color: "#8c8279",
                          lineHeight: "1.5",
                          cursor: "pointer",
                          userSelect: "none",
                          fontWeight: 400,
                          textTransform: "none",
                          letterSpacing: "normal",
                        }}
                      >
                        I agree to the{" "}
                        <Link
                          to="/terms"
                          target="_blank"
                          style={{ color: "#c7621a", textDecoration: "none" }}
                        >
                          Terms and Conditions
                        </Link>{" "}
                        and{" "}
                        <Link
                          to="/privacy"
                          target="_blank"
                          style={{ color: "#c7621a", textDecoration: "none" }}
                        >
                          Privacy Policy
                        </Link>
                        .
                      </label>
                    </motion.div>
                  </>
                )}

                <motion.button
                  type="submit"
                  className="submit-btn font-display"
                  disabled={loading}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  {loading ? "Processing..." : "Create account"}
                </motion.button>
              </motion.form>

              <motion.p
                className="footer-text font-display"
                variants={itemVariants}
              >
                Already have an account?
                <Link to="/login">Sign in →</Link>
              </motion.p>
            </motion.div>

            <div className="terms-footer font-display">
              <p>
                © 1 April 2026 JIGYAZAAI — ALL RIGHTS RESERVED.{" "}
                <br className="hidden lg:block" />
                <Link to="/privacy">PRIVACY POLICY</Link> •{" "}
                <Link to="/terms">TERMS OF SERVICE</Link>
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="verify"
          className="verify-container font-display"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="card">
            {/* Verify Left Panel */}
            <div className="left-panel-verify">
              <div className="bg-image">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXSHY83ue5OejQTMqRiWMOxNk60vemPe0Eai5TqNRmKvsF88Kcum2jhXeox9lfvW8ALWFtbUb2vqoMm8cBKtWuleeFmeMAFgq4Ykt4gdGD6L2nhFN43PUwZebOfRNQL7wLzjLPuMggonDE3s7fYMcjtrnxbKdTkk9exTz5_M8l_aOP33hXszjUiSZzGCIzD-X3q-89oH96lgcPfxG68-DxpYJMgPTYvZYcaa1FrEioQv2k0c-IXIiDsl70qOojj1HeHPgCYcWIoUY"
                  alt="Dark aesthetic"
                />
                <div className="overlay" />
              </div>

              <motion.div
                className="content-z"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div className="branding-v" variants={itemVariants}>
                  <Loder size={32} color="#c7621a" />
                  <span className="brand-name">jigyazaAi</span>
                </motion.div>

                <motion.h1 variants={itemVariants}>Almost there.</motion.h1>
                <motion.p variants={itemVariants}>
                  We've sent a code and a verification link to your email to verify your identity.
                </motion.p>

                <motion.div className="promo-box" variants={itemVariants}>
                  <div className="icon-box">
                    <span className="material-symbols-outlined">
                      auto_awesome
                    </span>
                  </div>
                  <div className="info">
                    <p className="title">Meet Nova</p>
                    <p className="subtitle">
                      Your AI learning companion is waiting for you.
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Verify Right Panel */}
            <div className="right-panel-verify">
              <motion.div
                className="verify-wrapper"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="header-v">
                  <motion.h2 variants={itemVariants}>
                    Verify your email
                  </motion.h2>
                  <motion.p variants={itemVariants}>
                    Enter the 6-digit code or click the verification link we sent to your email address.
                  </motion.p>
                  <motion.div 
                    variants={itemVariants} 
                    style={{ 
                      marginTop: '0.75rem', 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '6px', 
                      backgroundColor: 'rgba(199, 98, 26, 0.1)', 
                      padding: '0.35rem 0.75rem', 
                      borderRadius: '100px',
                      color: '#c7621a', 
                      fontSize: '0.8rem', 
                      fontWeight: 500 
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>schedule</span>
                    Verification code expires in 5 minutes
                  </motion.div>
                </div>

                <motion.div className="form-v" variants={itemVariants}>
                  <form onSubmit={handleVerifySubmit}>
                    <AnimatePresence>
                      {verifyError && (
                        <motion.div
                          className="error-message"
                          initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                          animate={{
                            opacity: 1,
                            height: "auto",
                            marginBottom: "1.5rem",
                          }}
                          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                          style={{
                            backgroundColor: "rgba(239, 68, 68, 0.05)",
                            border: "1px solid rgba(239, 68, 68, 0.2)",
                            color: "#ef4444",
                            padding: "0.875rem 1rem",
                            borderRadius: "0.5rem",
                            fontSize: "0.875rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            overflow: "hidden",
                          }}
                        >
                          <span
                            className="material-symbols-outlined"
                            style={{ fontSize: "1.125rem" }}
                          >
                            error
                          </span>
                          <span>{verifyError}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {loading ? (
                      <motion.div
                        className="loading-overlay"
                        key="verify-loading-overlay"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          minHeight: "140px",
                          gap: "1.25rem",
                        }}
                      >
                        <Loder size={65} color="#c7621a" />
                        <p
                          style={{
                            color: "#cbd5e1",
                            fontWeight: 500,
                            fontSize: "0.95rem",
                            letterSpacing: "0.025em",
                          }}
                        >
                          Verifying identity...
                        </p>
                      </motion.div>
                    ) : isAutoVerified ? (
                      <motion.div
                        className="auto-verified-success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4, type: 'spring', damping: 20 }}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '2rem 0 1rem 0' }}
                      >
                        <svg
                          width="90"
                          height="90"
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
                        
                        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
                          <h3 className="font-serif italic" style={{ color: '#10b981', fontSize: '1.45rem', margin: '0 0 0.5rem 0', fontWeight: 'normal' }}>Identity Verified</h3>
                          <p style={{ color: '#cbd5e1', margin: 0, fontSize: '0.95rem' }}>Your email has been securely authenticated.</p>
                        </div>
                        
                        <motion.button
                          type="button"
                          className="font-display"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={async () => {
                            setLoading(true);
                            await logoutUser();
                            navigate('/login');
                          }}
                          style={{
                            marginTop: '2rem',
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
                    ) : (
                      <>
                        <div className="otp-inputs">
                          {otp.map((data, index) => {
                            return (
                              <React.Fragment key={index}>
                                <input
                                  type="text"
                                  maxLength="1"
                                  value={data}
                                  ref={(el) => (otpInputs.current[index] = el)}
                                  onChange={(e) => handleOtpChange(e, index)}
                                  onKeyDown={(e) => handleKeyDown(e, index)}
                                  onFocus={(e) => e.target.select()}
                                />
                                {index === 2 && <div className="dash">—</div>}
                              </React.Fragment>
                            );
                          })}
                        </div>

                        <button
                          type="submit"
                          className="verify-btn font-display"
                          disabled={loading}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                          }}
                        >
                          Verify code
                        </button>

                        <div className="resend">
                          <p
                            style={{
                              marginTop: "1.5rem",
                              color: "#8b8a87",
                              fontSize: "0.85rem",
                            }}
                          >
                            Didn't receive a code?{" "}
                            {canResend ? (
                              <span
                                onClick={handleResendOtp}
                                style={{
                                  color: "#c8621a",
                                  cursor: "pointer",
                                  fontWeight: "bold",
                                }}
                              >
                                Resend →
                              </span>
                            ) : (
                              <span>
                                Resend in {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                              </span>
                            )}
                          </p>
                        </div>
                      </>
                    )}
                  </form>
                </motion.div>

                <motion.div className="bottom-links" variants={itemVariants}>
                  <button onClick={handleLogout} type="button" disabled={loading}>
                    <span className="material-symbols-outlined">
                      arrow_back
                    </span>
                    Back to register
                  </button>
                  <div className="badges">
                    <span>Encrypted</span>
                    <span>Secure</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Register;
