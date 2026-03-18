import React from 'react';
import { Link } from 'react-router-dom';
import Loder from '../../../components/Loaders/loder/Loder';
import '../styles/Legal.scss';

const PrivacyPolicy = () => {
  return (
    <div className="legal-page mesh-gradient-bg">
      <nav className="legal-navbar">
        <Link to="/" className="logo">
          <Loder size={28} color="#c7621a" />
          <span>jigyazaAi</span>
        </Link>
        <div className="nav-links">
          <Link to="/terms">Terms & Conditions</Link>
          <Link to="/login" className="back-link">Sign In</Link>
        </div>
      </nav>

      <main className="legal-container">
        <div className="legal-content glass-card custom-scrollbar">
          <h1>Privacy Policy</h1>
          <p className="last-updated">Last updated: March 18, 2026</p>
          
          <div className="markdown-body">
            <h2>1. Introduction</h2>
            <p>Welcome to jigyazaAi ("we", "our", "us"). We operate the jigyazaAi research engine available at jigyazaai.com and through our mobile and desktop applications (collectively, the "Service").</p>
            <p>We take your privacy seriously. This Privacy Policy explains what information we collect, how we use it, who we share it with, and what rights you have over it. Please read it carefully. By using jigyazaAi, you agree to the practices described in this policy.</p>
            <p>If you do not agree with this policy, please do not use our Service.</p>

            <h2>2. Information We Collect</h2>
            <h3>2.1 Information You Provide Directly</h3>
            <ul>
              <li><strong>Account information</strong> — When you register, we collect your name, email address, and password (stored as a hashed value — we never store your plain-text password).</li>
              <li><strong>OAuth login data</strong> — If you sign in via Google or GitHub, we receive your name, email address, and profile picture from those providers. We do not receive your password from them.</li>
              <li><strong>Query content</strong> — The questions, prompts, URLs, and files you submit to jigyazaAi when using the Service.</li>
              <li><strong>Uploaded files</strong> — PDFs, images, and documents you upload for analysis. These are stored securely and used only to generate your requested answer.</li>
              <li><strong>Support communications</strong> — If you contact us via email or our support channels, we retain those communications to resolve your issue.</li>
            </ul>

            <h3>2.2 Information We Collect Automatically</h3>
            <ul>
              <li><strong>Usage data</strong> — Pages visited, features used, queries submitted, response times, and interaction patterns.</li>
              <li><strong>Device information</strong> — Browser type, operating system, device type, screen resolution, and language settings.</li>
              <li><strong>Log data</strong> — IP address, timestamps, referring URLs, and error logs.</li>
              <li><strong>Cookies and similar technologies</strong> — We use session cookies for authentication, preference cookies to remember your settings, and analytics cookies to understand usage patterns.</li>
            </ul>

            <h3>2.3 Information from Third Parties</h3>
            <ul>
              <li><strong>OAuth providers</strong> — As described in 2.1 above.</li>
              <li><strong>Payment processors</strong> — If you subscribe to a paid plan, payment is processed by our third-party payment provider (Stripe). We do not store your full card number. We receive only a transaction confirmation and the last four digits of your card.</li>
              <li><strong>Analytics providers</strong> — We use privacy-respecting analytics tools to understand aggregate usage. These tools do not sell your data.</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect for the following purposes:</p>
            <ul>
              <li><strong>Providing the Service</strong> — Processing your queries, fetching and reasoning over sources, and returning cited answers.</li>
              <li><strong>Account management</strong> — Creating and managing your account, authenticating your sessions, and communicating service-related updates.</li>
              <li><strong>Improving the Service</strong> — Analyzing usage patterns, diagnosing bugs, and improving our AI models and search quality. We may use anonymized and aggregated query data for model improvement. We will never use your personal queries to train models without your explicit opt-in consent.</li>
              <li><strong>Personalization</strong> — Remembering your session history, preferences, and past research threads to provide continuity.</li>
              <li><strong>Communications</strong> — Sending you transactional emails (password reset, account verification), product updates, and — if you opt in — newsletters and feature announcements. You can unsubscribe at any time.</li>
              <li><strong>Safety and security</strong> — Detecting and preventing fraud, abuse, unauthorized access, and violations of our Terms of Service.</li>
              <li><strong>Legal compliance</strong> — Meeting our obligations under applicable laws and responding to lawful requests from authorities.</li>
            </ul>

            <h2>4. How We Store and Protect Your Information</h2>
            <h3>4.1 Storage</h3>
            <p>Your data is stored on secure cloud infrastructure hosted in data centers located in the European Union and/or the United States, depending on your region. We use industry-standard encryption at rest (AES-256) and in transit (TLS 1.2+).</p>

            <h3>4.2 Retention</h3>
            <ul>
              <li><strong>Account data</strong> — Retained for as long as your account is active. If you delete your account, your personal data is deleted within 30 days, except where we are required to retain it by law.</li>
              <li><strong>Query history</strong> — Retained for the period specified in your plan (Free: 7 days, Pro: 30 days, Teams: 90 days). You can delete your history at any time from your account settings.</li>
              <li><strong>Uploaded files</strong> — Deleted from our servers within 24 hours of processing, unless you explicitly save them to your account.</li>
              <li><strong>Logs</strong> — Server logs are retained for up to 90 days for security and debugging purposes, then automatically deleted.</li>
            </ul>

            <h3>4.3 Security</h3>
            <p>We implement technical and organizational measures to protect your data, including end-to-end encryption for data in transit, hashed password storage (bcrypt), role-based access controls for our team, regular security audits and penetration testing, and automatic session expiry.</p>
            <p>Despite these measures, no system is perfectly secure. We cannot guarantee absolute security and will notify you promptly in the event of a data breach affecting your personal information.</p>

            <h2>5. How We Share Your Information</h2>
            <p>We do not sell your personal data. We do not share your data with advertisers. We share your data only in the following limited circumstances:</p>

            <h3>5.1 Service Providers</h3>
            <p>We share data with trusted third-party providers who help us operate the Service, including cloud infrastructure, authentication (e.g. Auth0), payment processing (e.g. Stripe), analytics, and email delivery.</p>

            <h3>5.2 AI Model Providers</h3>
            <p>To generate answers, your query content is sent to third-party AI model providers (such as Anthropic or OpenAI). These providers process your query to generate a response. They are bound by their own privacy policies and data processing agreements. We do not send your name, email, or account information alongside queries — only the query content itself.</p>

            <h3>5.3 Search and Data Sources</h3>
            <p>To fetch sources for your query, anonymized search requests are sent to third-party search APIs. These requests do not include your account information.</p>

            <h3>5.4 Legal Requirements</h3>
            <p>We may disclose your information if required to do so by law, court order, or government authority, or if we believe in good faith that disclosure is necessary to protect the rights, property, or safety of jigyazaAi, our users, or the public.</p>

            <h3>5.5 Business Transfers</h3>
            <p>If jigyazaAi is acquired, merged with, or undergoes a change of ownership, your data may be transferred to the new entity. We will notify you before your data becomes subject to a different privacy policy.</p>

            <h2>6. Your Rights</h2>
            <p>Depending on your location, you may have rights over your personal data including the right of access, rectification, erasure, restriction, data portability, to object, to withdraw consent, and to lodge a complaint. To exercise any of these rights, contact us at <strong>privacy@jigyazaai.com</strong>. We will respond within 30 days.</p>

            <h2>7. Cookies</h2>
            <p>We use strictly necessary, functional, and analytics cookies. You can manage cookie preferences through your browser settings or through our cookie preference center in the app. Disabling functional or analytics cookies will not prevent you from using the Service.</p>

            <h2>8. Children's Privacy</h2>
            <p>jigyazaAi is not intended for use by individuals under the age of 16. We do not knowingly collect personal data from children under 16.</p>

            <h2>9. International Data Transfers</h2>
            <p>If you are located outside the country where our servers are based, your data may be transferred internationally. Where we transfer data outside the European Economic Area (EEA), we ensure appropriate safeguards are in place, such as Standard Contractual Clauses (SCCs).</p>

            <h2>10. Third-Party Links</h2>
            <p>Our Service may contain links to third-party websites or services. This Privacy Policy does not apply to those third parties.</p>

            <h2>11. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. When we do, we will update the "Last updated" date at the top of this page. Your continued use of the Service after changes are posted constitutes acceptance of the updated policy.</p>

            <h2>12. Contact Us</h2>
            <p>If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us:</p>
            <p>
              <strong>jigyazaAi Inc.</strong><br/>
              Email: privacy@jigyazaai.com<br/>
              Website: jigyazaai.com/privacy
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
