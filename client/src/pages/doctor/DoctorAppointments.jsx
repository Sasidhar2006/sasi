import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../../api/axiosInstance";
import Layout from "../../components/Layout";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAppointments(); }, []);

  const fetchAppointments = async () => {
    try {
      const { data } = await API.get("/doctor/getDoctorAppointments");
      if (data.success) setAppointments(data.data);
    } catch { toast.error("Failed to load appointments."); }
    finally { setLoading(false); }
  };

  const updateStatus = async (appointmentId, status) => {
    try {
      const { data } = await API.post("/doctor/updateAppointmentStatus", { appointmentId, status });
      if (data.success) {
        toast.success(`Appointment ${status}`);
        setAppointments(appointments.map((a) => a._id === appointmentId ? { ...a, status } : a));
      }
    } catch { toast.error("Action failed."); }
  };

  const statusClass = (s) => {
    const map = { pending: "badge-pending", approved: "badge-approved", rejected: "badge-rejected", completed: "badge-completed" };
    return map[s] || "badge-pending";
  };

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title">📋 Patient Appointments</h1>
          <p className="page-subtitle">Review and manage all appointment requests.</p>
        </div>
      </div>

      {loading ? (
        <div className="empty-state"><span className="empty-icon">⏳</span><h3>Loading...</h3></div>
      ) : appointments.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📭</span>
          <h3>No appointments yet</h3>
          <p>Appointment requests will appear here once patients book with you.</p>
        </div>
      ) : (
        <div className="card-glass" style={{ overflowX: "auto" }}>
          <table className="table-custom">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Date</th>
                <th>Time</th>
                <th>Document</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt._id}>
                  <td>
                    <strong style={{ color: "var(--text-primary)" }}>{appt.userInfo?.name}</strong>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{appt.userInfo?.email}</div>
                  </td>
                  <td>{appt.date}</td>
                  <td>{appt.time}</td>
                  <td>
                    {appt.document ? (
                      <a href={`/uploads/${appt.document.split("\\").pop().split("/").pop()}`} target="_blank" rel="noreferrer" style={{ color: "var(--primary)", fontSize: "0.85rem" }}>📄 View</a>
                    ) : <span style={{ color: "var(--text-muted)" }}>—</span>}
                  </td>
                  <td><span className={`badge-status ${statusClass(appt.status)}`}>{appt.status}</span></td>
                  <td>
                    {appt.status === "pending" && (
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button id={`approve-${appt._id}`} className="btn-primary-custom" style={{ padding: "6px 14px", fontSize: "0.8rem" }} onClick={() => updateStatus(appt._id, "approved")}>✅ Approve</button>
                        <button id={`reject-${appt._id}`} className="btn-danger-custom" style={{ padding: "6px 14px" }} onClick={() => updateStatus(appt._id, "rejected")}>❌ Reject</button>
                      </div>
                    )}
                    {appt.status === "approved" && (
                      <button id={`complete-${appt._id}`} className="btn-outline-custom" style={{ padding: "6px 14px", fontSize: "0.8rem" }} onClick={() => updateStatus(appt._id, "completed")}>🏁 Complete</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
};

export default DoctorAppointments;
