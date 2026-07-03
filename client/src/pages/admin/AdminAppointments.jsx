import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../../api/axiosInstance";
import Layout from "../../components/Layout";

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => { fetchAppointments(); }, []);

  const fetchAppointments = async () => {
    try {
      const { data } = await API.get("/admin/getAllAppointments");
      if (data.success) setAppointments(data.data);
    } catch { toast.error("Failed to load appointments."); }
    finally { setLoading(false); }
  };

  const filtered = filter === "all" ? appointments : appointments.filter((a) => a.status === filter);

  const statusClass = (s) => {
    const map = { pending: "badge-pending", approved: "badge-approved", rejected: "badge-rejected", completed: "badge-completed" };
    return map[s] || "badge-pending";
  };

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title">📅 All Appointments</h1>
          <p className="page-subtitle">Platform-wide appointment activity.</p>
        </div>
        <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{appointments.length} total</span>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {["all", "pending", "approved", "rejected", "completed"].map((tab) => (
          <button
            key={tab}
            id={`filter-${tab}`}
            onClick={() => setFilter(tab)}
            style={{
              padding: "7px 18px",
              borderRadius: "50px",
              border: "1px solid",
              borderColor: filter === tab ? "var(--primary)" : "var(--border-color)",
              background: filter === tab ? "rgba(0,198,167,0.12)" : "transparent",
              color: filter === tab ? "var(--primary)" : "var(--text-muted)",
              cursor: "pointer",
              fontSize: "0.85rem",
              fontWeight: 600,
              textTransform: "capitalize",
              transition: "var(--transition)",
            }}
          >
            {tab}
            <span style={{ marginLeft: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "50px", padding: "1px 7px", fontSize: "0.75rem" }}>
              {tab === "all" ? appointments.length : appointments.filter((a) => a.status === tab).length}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="empty-state"><span className="empty-icon">⏳</span><h3>Loading...</h3></div>
      ) : (
        <div className="card-glass" style={{ overflowX: "auto" }}>
          <table className="table-custom">
            <thead>
              <tr>
                <th>#</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Specialisation</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((appt, i) => (
                <tr key={appt._id}>
                  <td style={{ color: "var(--text-muted)" }}>{i + 1}</td>
                  <td>
                    <strong style={{ color: "var(--text-primary)" }}>{appt.userInfo?.name}</strong>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{appt.userInfo?.email}</div>
                  </td>
                  <td>
                    <strong style={{ color: "var(--text-primary)" }}>Dr. {appt.doctorInfo?.fullname}</strong>
                  </td>
                  <td>{appt.doctorInfo?.specialisation}</td>
                  <td>{appt.date}</td>
                  <td>{appt.time}</td>
                  <td><span className={`badge-status ${statusClass(appt.status)}`}>{appt.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="empty-state" style={{ padding: "2rem" }}>
              <p>No appointments with status "{filter}".</p>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default AdminAppointments;
