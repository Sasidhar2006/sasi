import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/userSlice";
import { toast } from "react-toastify";
import API from "../../api/axiosInstance";
import Layout from "../../components/Layout";

const Notifications = () => {
  const dispatch = useDispatch();
  const [notifications, setNotifications] = useState([]);
  const [seen, setSeen] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await API.get("/user/getNotifications");
      if (data.success) {
        setNotifications(data.data.notifications);
        setSeen(data.data.seenNotifications);
      }
    } catch {
      toast.error("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    try {
      const { data } = await API.post("/user/markAllRead");
      if (data.success) {
        toast.success("All notifications marked as read.");
        dispatch(setUser(data.data));
        setSeen([...seen, ...notifications]);
        setNotifications([]);
      }
    } catch {
      toast.error("Action failed.");
    }
  };

  const deleteAll = async () => {
    if (!window.confirm("Delete all notifications?")) return;
    try {
      const { data } = await API.delete("/user/deleteAllNotifications");
      if (data.success) {
        toast.success("Notifications cleared.");
        dispatch(setUser(data.data));
        setNotifications([]);
        setSeen([]);
      }
    } catch {
      toast.error("Action failed.");
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title">🔔 Notifications</h1>
          <p className="page-subtitle">Stay updated on your appointments and applications.</p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          {notifications.length > 0 && (
            <button id="mark-all-read" className="btn-outline-custom" onClick={markAllRead}>
              ✅ Mark All Read
            </button>
          )}
          {(notifications.length > 0 || seen.length > 0) && (
            <button id="delete-all-notifs" className="btn-danger-custom" onClick={deleteAll}>
              🗑️ Delete All
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="empty-state"><span className="empty-icon">⏳</span><h3>Loading...</h3></div>
      ) : notifications.length === 0 && seen.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🔕</span>
          <h3>No notifications</h3>
          <p>You're all caught up!</p>
        </div>
      ) : (
        <>
          {notifications.length > 0 && (
            <>
              <h3 style={{ marginBottom: "1rem", color: "var(--primary)", fontSize: "1rem" }}>
                Unread ({notifications.length})
              </h3>
              {notifications.map((n, i) => (
                <div key={i} className="notification-item unread">
                  <div className="notification-dot" />
                  <div>
                    <p style={{ margin: 0, color: "var(--text-primary)", fontWeight: 500 }}>
                      {n.message}
                    </p>
                    <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                      {n.type}
                    </span>
                  </div>
                </div>
              ))}
            </>
          )}

          {seen.length > 0 && (
            <>
              <h3 style={{ margin: "2rem 0 1rem", fontSize: "1rem", color: "var(--text-muted)" }}>
                Read ({seen.length})
              </h3>
              {seen.map((n, i) => (
                <div key={i} className="notification-item">
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--border-color)", marginTop: 6, flexShrink: 0 }} />
                  <div>
                    <p style={{ margin: 0, color: "var(--text-secondary)" }}>{n.message}</p>
                    <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{n.type}</span>
                  </div>
                </div>
              ))}
            </>
          )}
        </>
      )}
    </Layout>
  );
};

export default Notifications;
