import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import API from "../../api/axiosInstance";
import Layout from "../../components/Layout";

const DoctorDashboard = () => {
  const { user } = useSelector((state) => state.user);
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    try {
      const [docRes, apptRes] = await Promise.all([
        API.get(`/doctor/getDoctorInfo/${user._id}`),
        API.get("/doctor/getDoctorAppointments"),
      ]);
      if (docRes.data.success) setDoctor(docRes.data.data);
      if (apptRes.data.success) setAppointments(apptRes.data.data);
    } catch {
      toast.error("Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  const pending   = appointments.filter((a) => a.status === "pending").length;
  const approved  = appointments.filter((a) => a.status === "approved").length;
  const completed = appointments.filter((a) => a.status === "completed").length;

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title">🩺 Doctor Dashboard</h1>
          <p className="page-subtitle">Welcome back, Dr. {doctor?.fullname}</p>
        </div>
        <span className={`badge-status ${doctor?.status === "approved" ? "badge-approved" : "badge-pending"}`}>
          {doctor?.status || "pending"}
        </span>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: "2rem" }}>
        <div className="stat-card">
          <div className="stat-icon cyan">📅</div>
          <div className="stat-info">
            <h3>{appointments.length}</h3>
            <p>Total Appointments</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon gold">⏳</div>
          <div className="stat-info">
            <h3>{pending}</h3>
            <p>Pending</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">✅</div>
          <div className="stat-info">
            <h3>{approved}</h3>
            <p>Approved</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon cyan">🏁</div>
          <div className="stat-info">
            <h3>{completed}</h3>
            <p>Completed</p>
          </div>
        </div>
      </div>

      {/* Doctor Info Card */}
      {doctor && (
        <div className="card-glass" style={{ maxWidth: 600 }}>
          <h3 style={{ marginBottom: "1.25rem" }}>Your Profile</h3>
          <div className="grid-2">
            {[
              { label: "Specialisation", value: doctor.specialisation },
              { label: "Experience", value: `${doctor.experience} years` },
              { label: "Consultation Fee", value: `₹${doctor.fees}` },
              { label: "Phone", value: doctor.phone },
              { label: "Address", value: doctor.address },
              { label: "Availability", value: `${doctor.timings?.[0]} – ${doctor.timings?.[1]}` },
            ].map((item) => (
              <div key={item.label}>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0, textTransform: "uppercase" }}>{item.label}</p>
                <p style={{ color: "var(--text-primary)", fontWeight: 600, margin: "4px 0 0" }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default DoctorDashboard;
