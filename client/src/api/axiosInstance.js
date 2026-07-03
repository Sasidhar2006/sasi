import axios from "axios";

/**
 * Axios instance pre-configured with the backend API base URL.
 * The URL is sourced from the client .env file:
 *   VITE_API_BASE_URL=http://localhost:5000/api
 *
 * All API calls in the app should import and use this instance
 * instead of raw axios, ensuring the base URL is defined in one place.
 */
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// ── Request Interceptor ─────────────────────────────────────
// Automatically attach JWT token to every outgoing request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ────────────────────────────────────
// Handle 401 (token expired / invalid) globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;
