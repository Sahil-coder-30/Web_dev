import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Loder from '../../../components/Loaders/loder/Loder';
import '../styles/Register.scss';

const Register = () => {
  const [step, setStep] = useState(1); // 1 = Registration Form, 2 = OTP Verification
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const otpInputs = useRef([]);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2); // Proceed to OTP verification step
    }, 1500);
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
    if (val !== '' && index < 5 && otpInputs.current[index + 1]) {
      otpInputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Navigate backwards on Backspace if current field is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0 && otpInputs.current[index - 1]) {
      otpInputs.current[index - 1].focus();
    }
  };

  const handleResendOtp = () => {
    if (!canResend) return;
    setCanResend(false);
    setTimer(30); // reset to 30s
    setOtp(new Array(6).fill('')); // Optional: reset OTP inputs
    if (otpInputs.current[0]) otpInputs.current[0].focus();
    console.log("Resent new OTP!"); // Integration mock
  };

  const handleVerifySubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log('OTP Verified', otp.join(''));
    }, 1500);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
    exit: { opacity: 0 }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  // SVGs for branding
  const LogoSVG = () => (
    <svg className="logo" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.8261 30.5736C16.7203 29.8826 20.2244 29.4783 24 29.4783C27.7756 29.4783 31.2797 29.8826 34.1739 30.5736C36.9144 31.2278 39.9967 32.7669 41.3563 33.8352L24.8486 7.36089C24.4571 6.73303 23.5429 6.73303 23.1514 7.36089L6.64374 33.8352C8.00331 32.7669 11.0856 31.2278 13.8261 30.5736Z" fill="currentColor"></path>
      <path clipRule="evenodd" d="M39.998 35.764C39.9944 35.7463 39.9875 35.7155 39.9748 35.6706C39.9436 35.5601 39.8949 35.4259 39.8346 35.2825C39.8168 35.2403 39.7989 35.1993 39.7813 35.1602C38.5103 34.2887 35.9788 33.0607 33.7095 32.5189C30.9875 31.8691 27.6413 31.4783 24 31.4783C20.3587 31.4783 17.0125 31.8691 14.2905 32.5189C12.0012 33.0654 9.44505 34.3104 8.18538 35.1832C8.17384 35.2075 8.16216 35.233 8.15052 35.2592C8.09919 35.3751 8.05721 35.4886 8.02977 35.589C8.00356 35.6848 8.00039 35.7333 8.00004 35.7388C8.00004 35.739 8 35.7393 8.00004 35.7388C8.00004 35.7641 8.0104 36.0767 8.68485 36.6314C9.34546 37.1746 10.4222 37.7531 11.9291 38.2772C14.9242 39.319 19.1919 40 24 40C28.8081 40 33.0758 39.319 36.0709 38.2772C37.5778 37.7531 38.6545 37.1746 39.3151 36.6314C39.9006 36.1499 39.9857 35.8511 39.998 35.764ZM4.95178 32.7688L21.4543 6.30267C22.6288 4.4191 25.3712 4.41909 26.5457 6.30267L43.0534 32.777C43.0709 32.8052 43.0878 32.8338 43.104 32.8629L41.3563 33.8352C43.104 32.8629 43.1038 32.8626 43.104 32.8629L43.1051 32.865L43.1065 32.8675L43.1101 32.8739L43.1199 32.8918C43.1276 32.906 43.1377 32.9246 43.1497 32.9473C43.1738 32.9925 43.2062 33.0545 43.244 33.1299C43.319 33.2792 43.4196 33.489 43.5217 33.7317C43.6901 34.1321 44 34.9311 44 35.7391C44 37.4427 43.003 38.7775 41.8558 39.7209C40.6947 40.6757 39.1354 41.4464 37.385 42.0552C33.8654 43.2794 29.133 44 24 44C18.867 44 14.1346 43.2794 10.615 42.0552C8.86463 41.4464 7.30529 40.6757 6.14419 39.7209C4.99695 38.7775 3.99999 37.4427 3.99999 35.7391C3.99999 34.8725 4.29264 34.0922 4.49321 33.6393C4.60375 33.3898 4.71348 33.1804 4.79687 33.0311C4.83898 32.9556 4.87547 32.8935 4.9035 32.8471C4.91754 32.8238 4.92954 32.8043 4.93916 32.7889L4.94662 32.777L4.95178 32.7688ZM35.9868 29.004L24 9.77997L12.0131 29.004C12.4661 28.8609 12.9179 28.7342 13.3617 28.6282C16.4281 27.8961 20.0901 27.4783 24 27.4783C27.9099 27.4783 31.5719 27.8961 34.6383 28.6282C35.082 28.7342 35.5339 28.8609 35.9868 29.004Z" fill="currentColor" fillRule="evenodd"></path>
    </svg>
  );

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
              <LogoSVG />
              <span className="brand-name font-display">jigyazaAi</span>
            </motion.div>

            <motion.div className="mascot-area" variants={itemVariants}>
              <div className="mascot-wrapper">
                <div className="mascot-circle">
                  <div className="lab-coat" />
                  <div className="nova-head">
                    <div className="eyes">
                      <div className="eye" /><div className="eye" />
                    </div>
                  </div>
                </div>
                <div className="telescope">
                  <div className="lens" />
                </div>
                <div className="floating-star">
                  <span className="material-symbols-outlined text-5xl">star</span>
                </div>
              </div>
              <div className="text-center">
                <h2 className="font-serif italic">
                  Start your <span className="text-primary">journey.</span>
                </h2>
                <p className="font-display">Join the next generation of researchers.</p>
              </div>
            </motion.div>
          </div>

          {/* Right Panel: Registration Form */}
          <div className="right-panel">
            <div className="mobile-logo">
              <LogoSVG />
              <span className="brand-name font-display">jigyazaAi</span>
            </div>

            <motion.div className="form-wrapper" variants={containerVariants}>
              <motion.h1 className="font-serif italic" variants={itemVariants}>
                Create your account
              </motion.h1>
              
              <motion.form onSubmit={handleRegisterSubmit} variants={containerVariants}>
                <motion.div className="input-group" variants={itemVariants}>
                  <label htmlFor="username">Username</label>
                  <div className="input-container">
                    <input 
                      id="username" name="username" type="text"
                      placeholder="nova_researcher"
                      value={formData.username} onChange={handleChange}
                      required 
                    />
                  </div>
                </motion.div>

                <motion.div className="input-group" variants={itemVariants}>
                  <label htmlFor="email">Email address</label>
                  <div className="input-container">
                    <input 
                      id="email" name="email" type="email"
                      placeholder="nova@jigyaza.ai"
                      value={formData.email} onChange={handleChange}
                      required 
                    />
                  </div>
                </motion.div>

                <motion.div className="input-group" variants={itemVariants}>
                  <label htmlFor="password">Password</label>
                  <div className="input-container">
                    <input 
                      id="password" name="password" 
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password} onChange={handleChange}
                      required 
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}>
                      <span className="material-symbols-outlined">
                        {showPassword ? "visibility" : "visibility_off"}
                      </span>
                    </button>
                  </div>
                </motion.div>

                <motion.button 
                  type="submit" 
                  className="submit-btn font-display" 
                  disabled={loading}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  {loading ? (
                    <>
                      <Loder size={20} color="#000" />
                      Processing...
                    </>
                  ) : (
                    'Create account'
                  )}
                </motion.button>
              </motion.form>

              <motion.p className="footer-text font-display" variants={itemVariants}>
                Already have an account? 
                <Link to="/login">Sign in →</Link>
              </motion.p>
            </motion.div>

            <div className="terms-footer font-display">
              <p>
                © 2024 JIGYAZAAI — ALL RIGHTS RESERVED. <br className="hidden lg:block"/>
                <Link to="/privacy">PRIVACY POLICY</Link> • <Link to="/terms">TERMS OF SERVICE</Link>
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
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXSHY83ue5OejQTMqRiWMOxNk60vemPe0Eai5TqNRmKvsF88Kcum2jhXeox9lfvW8ALWFtbUb2vqoMm8cBKtWuleeFmeMAFgq4Ykt4gdGD6L2nhFN43PUwZebOfRNQL7wLzjLPuMggonDE3s7fYMcjtrnxbKdTkk9exTz5_M8l_aOP33hXszjUiSZzGCIzD-X3q-89oH96lgcPfxG68-DxpYJMgPTYvZYcaa1FrEioQv2k0c-IXIiDsl70qOojj1HeHPgCYcWIoUY" alt="Dark aesthetic" />
                <div className="overlay" />
              </div>

              <motion.div className="content-z" variants={containerVariants} initial="hidden" animate="visible">
                <motion.div className="branding-v" variants={itemVariants}>
                  <LogoSVG />
                  <span className="brand-name">jigyazaAi</span>
                </motion.div>

                <motion.h1 variants={itemVariants}>Almost there.</motion.h1>
                <motion.p variants={itemVariants}>We've sent a code to your email to verify your identity.</motion.p>
                
                <motion.div className="promo-box" variants={itemVariants}>
                  <div className="icon-box">
                    <span className="material-symbols-outlined">auto_awesome</span>
                  </div>
                  <div className="info">
                    <p className="title">Meet Nova</p>
                    <p className="subtitle">Your AI learning companion is waiting for you.</p>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Verify Right Panel */}
            <div className="right-panel-verify">
              <motion.div className="verify-wrapper" variants={containerVariants} initial="hidden" animate="visible">
                <div className="header-v">
                  <motion.h2 variants={itemVariants}>Verify your email</motion.h2>
                  <motion.p variants={itemVariants}>Enter the 6-digit code we sent to your email address.</motion.p>
                </div>

                <motion.div className="form-v" variants={itemVariants}>
                  <form onSubmit={handleVerifySubmit}>
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
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                      {loading ? (
                        <>
                          <Loder size={20} color="#000" />
                          Verifying...
                        </>
                      ) : (
                        'Verify code'
                      )}
                    </button>
                    
                    <div className="resend">
                      <p style={{ marginTop: '1.5rem', color: '#8b8a87', fontSize: '0.85rem' }}>
                        Didn't receive a code?{' '}
                        {canResend ? (
                          <span onClick={handleResendOtp} style={{ color: '#c8621a', cursor: 'pointer', fontWeight: 'bold' }}>
                            Resend →
                          </span>
                        ) : (
                          <span>Resend in {timer}s</span>
                        )}
                      </p>
                    </div>
                  </form>
                </motion.div>

                <motion.div className="bottom-links" variants={itemVariants}>
                  <button onClick={() => setStep(1)} type="button">
                    <span className="material-symbols-outlined">arrow_back</span>
                    Back to login
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
