import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Loder from "../../../components/Loaders/loder/Loder";
import "../styles/Login.scss"; // Reuse precise typography, structure, and aesthetic
import { useAuth } from "../hook/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../auth.slice";

const CreatePassword = () => {
  const [step, setStep] = useState(1); // Step 1: Request, Step 2: Create
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const otpInputs = useRef([]);

  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");

  const { sendCreatePasswordOtpUser, createPasswordUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const isAuthLoading = useSelector((state) => state.auth.loading);
  const authUserPayload = useSelector((state) => state.auth.user);
  const user = authUserPayload?.user || authUserPayload;

  // Auto route if already completely logged in and verified with password
  useEffect(() => {
    if (user && !isAuthLoading && user.verified && user.password) {
      navigate("/");
    }
  }, [user, isAuthLoading, navigate]);

  // Read email and message from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get("email");
    const msgParam = params.get("message");

    if (emailParam) {
      setEmail(emailParam);
    }
    if (msgParam) {
      setInfoMsg(msgParam);
    } else {
      setInfoMsg("Your account was created via Google. To set up a password, we need to verify your email address first.");
    }
  }, [location.search]);

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    if (!email) return setError("Please enter your email address.");

    try {
      dispatch(setLoading(true));
      await sendCreatePasswordOtpUser(email);
      setStep(2);
      setSuccessMsg("Verification code sent! Check your inbox.");
    } catch (err) {
      setError(err?.errors?.[0]?.msg || err?.message || "Failed to send verification code.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    const otpValue = otp.join("");

    if (otpValue.length !== 6) return setError("Please enter the full 6-digit code.");
    if (!password || password.length < 8) return setError("Password must be at least 8 characters.");

    try {
      dispatch(setLoading(true));
      await createPasswordUser(email, otpValue, password);
      setSuccessMsg("Password created successfully! Logging you in...");
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      setError(err?.errors?.[0]?.msg || err?.message || "Failed to create password.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return false;
    const val = value.substring(value.length - 1);
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);
    if (val !== "" && index < 5 && otpInputs.current[index + 1]) {
      otpInputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0 && otpInputs.current[index - 1]) {
      otpInputs.current[index - 1].focus();
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
    exit: { opacity: 0 },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <div className="login-container">
      {/* Left Panel: Identical aesthetic to Login */}
      <div className="left-panel">
        <motion.div
          className="branding absolute top-12 left-12 z-10"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
        >
          <Loder size={32} color="#c7621a" />
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
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
            <p className="subtitle font-mono">Setup Credentials</p>
            <h1 className="font-serif">
              Unlock local <span className="text-primary">access.</span>
            </h1>
            <p className="font-display">Create a password to sign in via email & password alongside Google.</p>
          </motion.div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="right-panel">
        <motion.div
          className="form-wrapper"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          key={step}
        >
          <motion.div className="header" variants={itemVariants}>
            <h2 className="font-serif italic font-normal">
              {step === 1 ? "Create Password" : "Confirm Verification"}
            </h2>
            <p style={{ marginTop: "0.5rem" }}>
              {step === 1
                ? infoMsg
                : "Enter the 6-digit confirmation code sent to your email to save your new password."}
            </p>
          </motion.div>

          <motion.form
            onSubmit={step === 1 ? handleRequestSubmit : handleCreateSubmit}
            variants={containerVariants}
          >
            <AnimatePresence>
              {error && (
                <motion.div
                  className="error-message"
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: "1.5rem" }}
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
                  <span className="material-symbols-outlined" style={{ fontSize: "1.125rem" }}>
                    error
                  </span>
                  <span>{error}</span>
                </motion.div>
              )}
              {successMsg && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: "1.5rem" }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  style={{
                    backgroundColor: "rgba(16, 185, 129, 0.05)",
                    border: "1px solid rgba(16, 185, 129, 0.2)",
                    color: "#10b981",
                    padding: "0.875rem 1rem",
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    overflow: "hidden",
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "1.125rem" }}>
                    check_circle
                  </span>
                  <span>{successMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {isAuthLoading ? (
              <motion.div
                className="loading-overlay"
                key="loading-overlay"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "220px",
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
                  {step === 1 ? "Sending verification code..." : "Setting up your credentials..."}
                </p>
              </motion.div>
            ) : (
              <>
                {step === 1 && (
                  <motion.div className="input-group" variants={itemVariants}>
                    <label htmlFor="email">Recorded email address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="nova@jigyaza.ai"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!!new URLSearchParams(location.search).get("email")}
                      required
                    />
                  </motion.div>
                )}

                {step === 2 && (
                  <>
                    <motion.div className="input-group" variants={itemVariants}>
                      <label>Verification Code</label>
                      <div
                        className="otp-inputs"
                        style={{
                          display: "flex",
                          gap: "8px",
                          justifyContent: "center",
                          marginBottom: "1.5rem",
                        }}
                      >
                        {otp.map((data, index) => (
                          <React.Fragment key={index}>
                            <input
                              type="text"
                              maxLength="1"
                              value={data}
                              ref={(el) => (otpInputs.current[index] = el)}
                              onChange={(e) => handleOtpChange(e, index)}
                              onKeyDown={(e) => handleKeyDown(e, index)}
                              onFocus={(e) => e.target.select()}
                              style={{
                                width: "45px",
                                height: "48px",
                                textAlign: "center",
                                fontSize: "1.5rem",
                                fontWeight: "bold",
                              }}
                              required
                            />
                            {index === 2 && (
                              <div
                                style={{ display: "flex", alignItems: "center", color: "#8c8279" }}
                              >
                                —
                              </div>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </motion.div>

                    <motion.div className="input-group password-group" variants={itemVariants}>
                      <div className="header">
                        <label htmlFor="password">Create Password</label>
                      </div>
                      <div className="input-wrapper">
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          name="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label="Toggle password"
                        >
                          <span className="material-symbols-outlined">
                            {showPassword ? "visibility" : "visibility_off"}
                          </span>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </>
            )}

            <motion.button
              type="submit"
              className="submit-btn font-display"
              disabled={isAuthLoading}
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              style={{ marginTop: "1rem" }}
            >
              <span
                className="content"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                {isAuthLoading
                  ? "Processing..."
                  : step === 1
                    ? "Send Verification Code"
                    : "Create Password"}
                <span className="material-symbols-outlined">arrow_forward</span>
              </span>
            </motion.button>
          </motion.form>

          <motion.p className="footer-text font-display" variants={itemVariants}>
            Go back to <Link to="/login">Sign In</Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default CreatePassword;
