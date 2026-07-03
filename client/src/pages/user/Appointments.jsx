import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../../api/axiosInstance";
import Layout from "../../components/Layout";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data } = await API.get("/appointment/getUserAppointments");
      if (data.success) setAppointments(data.data);
    } catch {
      toast.error("Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this appointment?")) return;
    try {
      const { data } = await API.delete(`/appointment/cancelAppointment/${id}`);
      if (data.success) {
        toast.success(data.message);
        setAppointments(appointments.filter((a) => a._id !== id));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Cancellation failed.");
    }
  };

  const statusClass = (s) => {
    const map = { pending: "badge-pending", approved: "badge-approved", rejected: "badge-rejected", completed: "badge-completed" };
    return map[s] || "badge-pending";
  };

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title">📅 My Appointments</h1>
          <p className="page-subtitle">View and manage all your medical appointments.</p>
        </div>
      </div>

      {loading ? (
        <div className="empty-state"><span className="empty-icon">⏳</span><h3>Loading...</h3></div>
      ) : appointments.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📋</span>
          <h3>No appointments yet</h3>
          <p>Go to the dashboard to book your first appointment.</p>
        </div>
      ) : (
        <div className="card-glass" style={{ overflowX: "auto" }}>
          <table className="table-custom">
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Specialisation</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Document</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt._id}>
                  <td>
                    <strong style={{ color: "var(--text-primary)" }}>
                      Dr. {appt.doctorInfo?.fullname}
                    </strong>
                  </td>
                  <td>{appt.doctorInfo?.specialisation}</td>
                  <td>{appt.date}</td>
                  <td>{appt.time}</td>
                  <td>
                    <span className={`badge-status ${statusClass(appt.status)}`}>
                      {appt.status}
                    </span>
                  </td>
                  <td>
                    {appt.document ? (
                      <a
                        href={`/uploads/${appt.document.split("\\").pop().split("/").pop()}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: "var(--primary)", fontSize: "0.85rem" }}
                      >
                        📄 View
                      </a>
                    ) : (
                      <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>—</span>
                    )}
                  </td>
                  <td>
                    {appt.status === "pending" && (
                      <button
                        id={`cancel-${appt._id}`}
                        className="btn-danger-custom"
                        style={{ fontSize: "0.8rem", padding: "6px 14px" }}
                        onClick={() => handleCancel(appt._id)}
                      >
                        Cancel
                      </button>
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

export default Appointments;
