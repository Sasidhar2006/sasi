import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../../api/axiosInstance";
import Layout from "../../components/Layout";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, doctors: 0, appointments: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const [usersRes, doctorsRes, apptsRes] = await Promise.all([
        API.get("/admin/getAllUsers"),
        API.get("/admin/getAllDoctors"),
        API.get("/admin/getAllAppointments"),
      ]);
      const pending = doctorsRes.data.data?.filter((d) => d.status === "pending").length || 0;
      setStats({
        users: usersRes.data.data?.length || 0,
        doctors: doctorsRes.data.data?.filter((d) => d.status === "approved").length || 0,
        appointments: apptsRes.data.data?.length || 0,
        pending,
      });
    } catch { toast.error("Failed to load stats."); }
    finally { setLoading(false); }
  };

  const statCards = [
    { icon: "👥", label: "Total Users", value: stats.users, color: "blue" },
    { icon: "🩺", label: "Approved Doctors", value: stats.doctors, color: "cyan" },
    { icon: "📅", label: "Appointments", value: stats.appointments, color: "gold" },
    { icon: "⏳", label: "Pending Approvals", value: stats.pending, color: "red" },
  ];

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title">🛡️ Admin Dashboard</h1>
          <p className="page-subtitle">Platform overview and management controls.</p>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: "2.5rem" }}>
        {statCards.map((s) => (
          <div key={s.label} className="stat-card">
            <div className={`stat-icon ${s.color}`}>{s.icon}</div>
            <div className="stat-info">
              <h3>{loading ? "—" : s.value}</h3>
              <p>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="card-glass">
          <h3 style={{ marginBottom: "1rem" }}>Quick Actions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <a href="/admin/doctors" style={{ textDecoration: "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px", background: "rgba(0,198,167,0.06)", borderRadius: "var(--radius-sm)", border: "1px solid rgba(0,198,167,0.15)", cursor: "pointer", transition: "var(--transition)" }}>
                <span style={{ fontSize: "1.4rem" }}>🩺</span>
                <div>
                  <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>Review Doctor Applications</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{stats.pending} pending approvals</div>
                </div>
              </div>
            </a>
            <a href="/admin/users" style={{ textDecoration: "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px", background: "rgba(90,141,238,0.06)", borderRadius: "var(--radius-sm)", border: "1px solid rgba(90,141,238,0.15)", cursor: "pointer" }}>
                <span style={{ fontSize: "1.4rem" }}>👥</span>
                <div>
                  <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>Manage Users</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{stats.users} registered users</div>
                </div>
              </div>
            </a>
            <a href="/admin/appointments" style={{ textDecoration: "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px", background: "rgba(243,156,18,0.06)", borderRadius: "var(--radius-sm)", border: "1px solid rgba(243,156,18,0.15)", cursor: "pointer" }}>
                <span style={{ fontSize: "1.4rem" }}>📅</span>
                <div>
                  <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>View All Appointments</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{stats.appointments} total</div>
                </div>
              </div>
            </a>
          </div>
        </div>

        <div className="card-glass">
          <h3 style={{ marginBottom: "1rem" }}>Platform Status</h3>
          {[
            { label: "Database", value: "MongoDB Connected", color: "var(--success)" },
            { label: "API Server", value: "Running on Port 5000", color: "var(--success)" },
            { label: "Auth", value: "JWT Active", color: "var(--success)" },
            { label: "File Uploads", value: "Multer Enabled", color: "var(--success)" },
          ].map((item) => (
            <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--border-color)" }}>
              <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>{item.label}</span>
              <span style={{ color: item.color, fontSize: "0.85rem", fontWeight: 600 }}>● {item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
