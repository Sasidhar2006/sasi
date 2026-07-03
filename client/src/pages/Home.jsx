import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: "🔍",
      title: "Find Doctors",
      desc: "Browse verified specialists by specialty, location, and availability.",
    },
    {
      icon: "📅",
      title: "Book Instantly",
      desc: "Select your preferred time slot and book appointments in seconds.",
    },
    {
      icon: "📄",
      title: "Upload Documents",
      desc: "Securely upload medical records and insurance documents.",
    },
    {
      icon: "🔔",
      title: "Real-time Alerts",
      desc: "Get instant notifications on appointment confirmations and updates.",
    },
    {
      icon: "🩺",
      title: "Doctor Dashboard",
      desc: "Doctors manage their availability, appointments, and patient records.",
    },
    {
      icon: "🛡️",
      title: "Admin Control",
      desc: "Admins verify doctors, oversee the platform, and ensure compliance.",
    },
  ];

  const stats = [
    { value: "500+", label: "Verified Doctors" },
    { value: "10k+", label: "Appointments Booked" },
    { value: "50+", label: "Specialities" },
    { value: "98%", label: "Patient Satisfaction" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-dark)" }}>
      {/* ── Navbar ── */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.2rem 3rem",
          background: "rgba(10,22,40,0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border-color)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontFamily: "var(--font-heading)",
            fontWeight: 800,
            fontSize: "1.3rem",
            color: "var(--text-primary)",
          }}
        >
          <span style={{ fontSize: "1.6rem" }}>🏥</span>
          Book<span style={{ color: "var(--primary)" }}>ADoctor</span>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link to="/login">
            <button className="btn-outline-custom">Login</button>
          </Link>
          <Link to="/register">
            <button className="btn-primary-custom">Get Started</button>
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero">
        <div style={{ position: "relative", zIndex: 1 }}>
          <div className="hero-badge animate-fadeInUp">
            <span>✨</span> Healthcare, Simplified
          </div>
          <h1
            className="hero-title animate-fadeInUp"
            style={{ animationDelay: "0.1s" }}
          >
            Find & Book the Best{" "}
            <span className="gradient-text">Doctors Near You</span>
          </h1>
          <p
            className="hero-desc animate-fadeInUp"
            style={{ animationDelay: "0.2s" }}
          >
            Connect with verified healthcare professionals instantly. Schedule
            appointments, manage your health records, and receive real-time
            updates — all in one place.
          </p>
          <div
            className="hero-actions animate-fadeInUp"
            style={{ animationDelay: "0.3s" }}
          >
            <button
              className="btn-primary-custom"
              onClick={() => navigate("/register")}
              style={{ padding: "14px 36px", fontSize: "1rem" }}
            >
              🚀 Book an Appointment
            </button>
            <button
              className="btn-outline-custom"
              onClick={() => navigate("/login")}
              style={{ padding: "14px 36px", fontSize: "1rem" }}
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section
        style={{
          padding: "4rem 3rem",
          background: "rgba(15,31,61,0.5)",
          borderTop: "1px solid var(--border-color)",
          borderBottom: "1px solid var(--border-color)",
        }}
      >
        <div
          className="grid-4"
          style={{ maxWidth: 1100, margin: "0 auto" }}
        >
          {stats.map((stat, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "2.5rem",
                  fontWeight: 800,
                  fontFamily: "var(--font-heading)",
                  background:
                    "linear-gradient(135deg, var(--primary), var(--secondary))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {stat.value}
              </div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="features-section">
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p className="section-title">Everything You Need</p>
          <p className="section-subtitle">
            A complete healthcare platform built for patients, doctors, and administrators.
          </p>
          <div className="divider" />
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-card">
                <span className="feature-icon">{f.icon}</span>
                <h3 className="feature-title">{f.title}</h3>
                <p style={{ fontSize: "0.9rem", margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        style={{
          padding: "5rem 3rem",
          textAlign: "center",
          background: "rgba(15,31,61,0.5)",
          borderTop: "1px solid var(--border-color)",
        }}
      >
        <h2 style={{ marginBottom: "1rem" }}>
          Ready to take control of your health?
        </h2>
        <p
          style={{
            color: "var(--text-muted)",
            maxWidth: 500,
            margin: "0 auto 2rem",
          }}
        >
          Join thousands of patients who trust BookADoctor for their healthcare
          needs.
        </p>
        <button
          className="btn-primary-custom"
          onClick={() => navigate("/register")}
          style={{ padding: "14px 48px", fontSize: "1rem" }}
        >
          Create Free Account
        </button>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          borderTop: "1px solid var(--border-color)",
          padding: "2rem 3rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
          © 2024 BookADoctor. All rights reserved.
        </div>
        <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
          Built with ❤️ for better healthcare
        </div>
      </footer>
    </div>
  );
};

export default Home;
