import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api/axiosInstance";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      return toast.error("Name, email, and password are required.");
    }
    if (form.password.length < 6) {
      return toast.error("Password must be at least 6 characters.");
    }
    try {
      setSubmitting(true);
      const { data } = await API.post("/auth/register", form);
      if (data.success) {
        toast.success("Registration successful! Please login.");
        navigate("/login");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card" style={{ maxWidth: 500 }}>
        <div className="auth-logo">
          <div className="logo-icon-lg">🏥</div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join BookADoctor as a patient</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              id="register-name"
              className="form-control-custom"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              id="register-email"
              className="form-control-custom"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number (optional)</label>
            <input
              type="tel"
              name="phone"
              id="register-phone"
              className="form-control-custom"
              placeholder="+1 234 567 8900"
              value={form.phone}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              id="register-password"
              className="form-control-custom"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            id="register-submit"
            className="btn-primary-custom"
            style={{ width: "100%", justifyContent: "center", padding: "13px", marginTop: "0.5rem" }}
            disabled={submitting}
          >
            {submitting ? "Creating Account..." : "🚀 Create Account"}
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
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>
            Sign in
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

export default Register;
