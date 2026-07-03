import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../redux/userSlice";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state) => state.user);

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(clearUser());
    navigate("/login");
  };

  const isActive = (path) =>
    location.pathname === path ? "active" : "";

  // Build sidebar menu based on role
  const buildMenu = () => {
    if (user?.isAdmin) {
      return [
        { path: "/admin/dashboard", icon: "🏠", label: "Dashboard" },
        { path: "/admin/users",     icon: "👥", label: "Users" },
        { path: "/admin/doctors",   icon: "🩺", label: "Doctors" },
        { path: "/admin/appointments", icon: "📅", label: "Appointments" },
      ];
    }
    if (user?.isDoctor) {
      return [
        { path: "/doctor/dashboard",    icon: "🏠", label: "Dashboard" },
        { path: "/doctor/appointments", icon: "📅", label: "Appointments" },
        { path: "/doctor/profile",      icon: "👤", label: "Profile" },
        { path: "/notifications",       icon: "🔔", label: "Notifications" },
      ];
    }
    return [
      { path: "/dashboard",      icon: "🏠", label: "Home" },
      { path: "/appointments",   icon: "📅", label: "Appointments" },
      { path: "/notifications",  icon: "🔔", label: "Notifications" },
    ];
  };

  const menuItems = buildMenu();
  const unreadCount = user?.notifications?.length || 0;

  return (
    <div className="layout">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">🏥</div>
          <span>BookADoctor</span>
        </div>

        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link to={item.path} className={`${isActive(item.path)}`}>
                <span className="icon">{item.icon}</span>
                {item.label}
                {item.path === "/notifications" && unreadCount > 0 && (
                  <span
                    style={{
                      marginLeft: "auto",
                      background: "var(--primary)",
                      color: "#fff",
                      borderRadius: "50px",
                      padding: "1px 8px",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* Logout at bottom of sidebar */}
        <div style={{ padding: "0 0.75rem", marginTop: "auto" }}>
          <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "1rem" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 16px",
                borderRadius: "var(--radius-sm)",
                marginBottom: "8px",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "#fff",
                  flexShrink: 0,
                }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div style={{ overflow: "hidden" }}>
                <div
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {user?.name}
                </div>
                <div
                  style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}
                >
                  {user?.isAdmin ? "Admin" : user?.isDoctor ? "Doctor" : "Patient"}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="btn-danger-custom"
              style={{ width: "100%", textAlign: "center", justifyContent: "center" }}
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="page-content">{children}</main>
    </div>
  );
};

export default Layout;
