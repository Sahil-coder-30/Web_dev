import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Loder from '../../../components/Loaders/loder/Loder';
import '../styles/Login.scss';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log('Login submitted:', formData);
    }, 1500);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  const floatVariants = {
    animate: {
      y: [0, -8, 0],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
    }
  };

  // 18 sparkle positions matching the original design
  const sparkles = [
    { top: "15%", left: "10%", size: 0.5, delay: 0 },
    { top: "25%", left: "85%", size: 1, delay: 1 },
    { top: "65%", left: "15%", size: 0.5, delay: 2 },
    { top: "80%", left: "75%", size: 1, delay: 0.5 },
    { top: "40%", left: "5%", size: 0.5, delay: 1.5 },
    { top: "10%", left: "60%", size: 0.5, delay: 2.5 },
    { top: "12%", left: "45%", size: 1, delay: 0.2 },
    { top: "35%", left: "12%", size: 0.5, delay: 0.8 },
    { top: "55%", left: "88%", size: 1, delay: 1.4 },
    { top: "72%", left: "42%", size: 0.5, delay: 2.1 },
    { top: "88%", left: "22%", size: 1, delay: 0.5 },
    { top: "5%", left: "25%", size: 0.5, delay: 3.2 },
    { top: "18%", left: "78%", size: 1, delay: 1.1 },
    { top: "48%", left: "5%", size: 0.5, delay: 2.5 },
    { top: "62%", left: "33%", size: 1, delay: 0.9 },
    { top: "92%", left: "65%", size: 0.5, delay: 1.7 },
    { top: "28%", left: "55%", size: 1, delay: 2.8 },
    { top: "78%", left: "10%", size: 0.5, delay: 0.3 },
    { top: "42%", left: "92%", size: 1, delay: 1.9 },
    { top: "85%", left: "48%", size: 0.5, delay: 3.5 },
    { top: "15%", left: "95%", size: 1, delay: 0.6 },
    { top: "58%", left: "58%", size: 0.5, delay: 2.2 },
    { top: "3%", left: "82%", size: 1, delay: 1.3 },
    { top: "68%", left: "2%", size: 0.5, delay: 0.1 },
  ];

  return (
    <div className="login-container">
      {/* Left Panel: Illustration & Branding */}
      <div className="left-panel">
        {/* Top Wordmark */}
        <motion.div 
          className="branding absolute top-12 left-12 z-10"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="brand-name font-serif">jigyazaAi</span>
          <div className="divider" />
          <span className="tagline font-mono">Research Engine</span>
        </motion.div>

        {/* Illustration Zone */}
        <div className="illustration-zone">
          <div className="bg-gradient" />
          
          {/* Floating UI Elements */}
          <motion.div 
            className="floating-ui-1 animate-drift"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <span className="badge font-mono">[1]</span>
            <span className="text font-display">Citation verified</span>
          </motion.div>

          <motion.div 
            className="floating-ui-2 animate-drift"
            style={{ animationDelay: '-2s' }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <span className="text font-display">Confidence</span>
            <div className="progress-bar">
              <motion.div 
                className="fill"
                initial={{ width: 0 }}
                animate={{ width: '80%' }}
                transition={{ delay: 1.2, duration: 1, ease: 'easeOut' }}
              />
            </div>
          </motion.div>

          <span className="material-symbols-outlined absolute top-1/4 left-1/3 text-primary text-xl animate-sparkle" style={{ position: 'absolute', top: '25%', left: '33%', color: '#c7621a', fontSize: '1.25rem' }}>
            colors_spark
          </span>

          {/* Mascot "Sage" Scene */}
          <motion.div className="mascot-scene animate-idle" variants={floatVariants} animate="animate">
            <div className="mascot-svg-wrapper">
              <svg viewBox="0 0 200 200">
                {/* Books Stack */}
                <rect x="60" y="150" width="80" height="12" fill="#2A2520" stroke="#1A1410" strokeWidth="3" />
                <rect x="55" y="162" width="90" height="12" fill="#1E1B18" stroke="#1A1410" strokeWidth="3" />
                <rect x="62" y="174" width="76" height="12" fill="#2A2520" stroke="#1A1410" strokeWidth="3" />
                <rect x="50" y="186" width="100" height="12" fill="#1E1B18" stroke="#1A1410" strokeWidth="3" />
                {/* Character Sage */}
                {/* Body/Hoodie */}
                <path d="M70 150 Q100 100 130 150 Z" fill="#c7621a" stroke="#1A1410" strokeWidth="3" />
                {/* Head */}
                <circle cx="100" cy="95" r="35" fill="#F5C9A0" stroke="#1A1410" strokeWidth="3" />
                {/* Hair */}
                <path d="M65 95 Q65 65 100 60 Q135 65 135 95 L130 95 Q130 75 100 75 Q70 75 70 95 Z" fill="#2A1F14" stroke="#1A1410" strokeWidth="3" />
                {/* Glasses & Eyes */}
                <circle cx="88" cy="100" r="8" fill="none" stroke="#1A1410" strokeWidth="2" />
                <circle cx="112" cy="100" r="8" fill="none" stroke="#1A1410" strokeWidth="2" />
                <line x1="96" y1="100" x2="104" y2="100" stroke="#1A1410" strokeWidth="2" />
                <circle cx="88" cy="100" r="2" fill="#1A1410" />
                <circle cx="112" cy="100" r="2" fill="#1A1410" />
                {/* Eyebrow & Smile */}
                <path d="M82 85 Q88 82 94 85" fill="none" stroke="#1A1410" strokeWidth="2" />
                <path d="M95 115 Q100 118 105 115" fill="none" stroke="#1A1410" strokeWidth="2" />
                {/* Hands */}
                <circle cx="135" cy="110" r="6" fill="#F5C9A0" stroke="#1A1410" strokeWidth="2" />
                <circle cx="75" cy="145" r="6" fill="#F5C9A0" stroke="#1A1410" strokeWidth="2" />
              </svg>
              {/* Glowing Orb */}
              <div className="glowing-orb animate-pulse-slow" />
            </div>
            {/* Ground Shadow */}
            <div className="shadow" />
          </motion.div>

          {/* Text Content */}
          <motion.div 
            className="text-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <p className="subtitle font-mono">Your Research Companion</p>
            <h1 className="font-serif">
              Research without <span className="text-primary">limits.</span>
            </h1>
            <p className="font-display">Ask anything. Get cited answers in seconds.</p>
          </motion.div>

          <div className="sparkle-container">
            {sparkles.map((sparkle, idx) => (
              <div 
                key={idx}
                className="sparkle-dot animate-sparkle"
                style={{
                  top: sparkle.top,
                  left: sparkle.left,
                  width: `${sparkle.size * 4}px`,
                  height: `${sparkle.size * 4}px`,
                  animationDelay: `${sparkle.delay}s`
                }}
              />
            ))}
            <span className="material-symbols-outlined sparkle-icon animate-drift" style={{ top: '20%', right: '15%' }}>change_history</span>
            <span className="material-symbols-outlined sparkle-icon animate-drift" style={{ bottom: '20%', left: '20%', fontSize: '8px', animationDelay: '-3s' }}>circle</span>
          </div>
        </div>

      </div>

      {/* Right Panel: Login Form */}
      <div className="right-panel">
        <motion.div 
          className="form-wrapper"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="header" variants={itemVariants}>
            <h2 className="font-serif italic font-normal">Good to see you.</h2>
            <p>Please enter your details to sign in to your account.</p>
          </motion.div>

          <motion.div className="social-login-group" variants={itemVariants}>
            <button type="button" className="social-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Google</span>
            </button>
            <button type="button" className="social-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.699-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
              <span>GitHub</span>
            </button>
          </motion.div>

          <motion.form onSubmit={handleSubmit} variants={containerVariants}>
            <motion.div className="input-group" variants={itemVariants}>
              <label htmlFor="email">Email address</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                placeholder="name@company.com" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </motion.div>

            <motion.div className="input-group password-group" variants={itemVariants}>
              <div className="header">
                <label htmlFor="password">Password</label>
              </div>
              <div className="input-wrapper">
                <input 
                  type={showPassword ? "text" : "password"}
                  id="password" 
                  name="password" 
                  placeholder="••••••••" 
                  value={formData.password}
                  onChange={handleChange}
                  required 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <svg fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                    {showPassword && <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="2" />}
                  </svg>
                </button>
              </div>
            </motion.div>

            <motion.div className="form-options" variants={itemVariants}>
              <div className="checkbox-group">
                <input 
                  type="checkbox" 
                  id="remember" 
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                />
                <label htmlFor="remember">Remember me</label>
              </div>
              <Link to="#" className="forgot-password">Forgot password?</Link>
            </motion.div>

            <motion.button 
              type="submit" 
              className="submit-btn font-display" 
              disabled={loading}
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <span className="content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                {loading ? (
                  <>
                    <Loder size={20} color="#000" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in to account
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </>
                )}
              </span>
            </motion.button>
          </motion.form>

          <motion.p className="footer-text font-display" variants={itemVariants}>
            New to jigyazaAi? <Link to="/register">Start your free trial</Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
