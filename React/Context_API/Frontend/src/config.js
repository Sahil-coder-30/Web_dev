// src/config.js
export const API_BASE_URL = window.location.hostname === "localhost" 
  ? "http://localhost:3000" 
  : ""; // Empty string tells axios to use the current domain (Vercel)