import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import API from "../api/axiosInstance";
import { setUser } from "../redux/userSlice";
import { showLoading, hideLoading } from "../redux/alertSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      return toast.error("Please fill in all fields.");
    }
    try {
      setSubmitting(true);
      dispatch(showLoading());
      const { data } = await API.post("/auth/login", form);
      if (data.success) {
        localStorage.setItem("token", data.token);
        dispatch(setUser(data.data));
        toast.success("Login successful! Welcome back 👋");
        if (data.data.isAdmin) navigate("/admin/dashboard");
        else if (data.data.isDoctor) navigate("/doctor/dashboard");
        else navigate("/dashboard");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed.");
    } finally {
      setSubmitting(false);
      dispatch(hideLoading());
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="logo-icon-lg">🏥</div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your BookADoctor account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              id="login-email"
              className="form-control-custom"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              id="login-password"
              className="form-control-custom"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            id="login-submit"
            className="btn-primary-custom"
            style={{ width: "100%", justifyContent: "center", padding: "13px", marginTop: "0.5rem" }}
            disabled={submitting}
          >
            {submitting ? "Signing in..." : "🔑 Sign In"}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            fontSize: "0.9rem",
            color: "var(--text-muted)",
          }}
        >
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "var(--primary)", fontWeight: 600 }}>
            Create one
          </Link>
        </p>
        <p style={{ textAlign: "center", marginTop: "0.5rem" }}>
          <Link to="/" style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            ← Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
