import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import API from "../../api/axiosInstance";
import Layout from "../../components/Layout";

const Dashboard = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const [bookingForm, setBookingForm] = useState({ date: "", time: "", document: null });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const { data } = await API.get("/user/getAllDoctors");
      if (data.success) setDoctors(data.data);
    } catch {
      toast.error("Failed to load doctors.");
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter(
    (d) =>
      d.fullname.toLowerCase().includes(search.toLowerCase()) ||
      d.specialisation.toLowerCase().includes(search.toLowerCase())
  );

  const handleBook = async (e) => {
    e.preventDefault();
    if (!bookingForm.date || !bookingForm.time) return toast.error("Date and time are required.");
    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("doctorId", bookingDoctor._id);
      formData.append("date", bookingForm.date);
      formData.append("time", bookingForm.time);
      formData.append("doctorInfo", JSON.stringify(bookingDoctor));
      formData.append("userInfo", JSON.stringify(user));
      if (bookingForm.document) formData.append("document", bookingForm.document);

      const { data } = await API.post("/appointment/bookAppointment", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (data.success) {
        toast.success(data.message);
        setBookingDoctor(null);
        setBookingForm({ date: "", time: "", document: null });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title">👋 Welcome, {user?.name}</h1>
          <p className="page-subtitle">Browse and book appointments with top specialists.</p>
        </div>

      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: "2rem" }}>
        <input
          type="text"
          id="doctor-search"
          className="form-control-custom"
          placeholder="🔍 Search by name or specialty..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 400 }}
        />
      </div>

      {loading ? (
        <div className="empty-state">
          <span className="empty-icon">⏳</span>
          <h3>Loading doctors...</h3>
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🔍</span>
          <h3>No doctors found</h3>
          <p>Try a different search term.</p>
        </div>
      ) : (
        <div className="grid-auto">
          {filteredDoctors.map((doc) => (
            <div key={doc._id} className="doctor-card">
              <div className="doctor-avatar">👨‍⚕️</div>
              <div className="doctor-name">{doc.fullname}</div>
              <div className="doctor-speciality">{doc.specialisation}</div>
              <div className="doctor-meta">
                <div className="doctor-meta-item">📍 {doc.address}</div>
                <div className="doctor-meta-item">⏱️ {doc.experience} yrs experience</div>
                <div className="doctor-meta-item">💰 ₹{doc.fees} / session</div>
                <div className="doctor-meta-item">
                  🕐 {doc.timings?.[0]} – {doc.timings?.[1]}
                </div>
              </div>
              <button
                id={`book-${doc._id}`}
                className="btn-primary-custom"
                style={{ width: "100%", justifyContent: "center" }}
                onClick={() => setBookingDoctor(doc)}
              >
                📅 Book Appointment
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {bookingDoctor && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
            padding: "1rem",
          }}
        >
          <div className="card-glass" style={{ width: "100%", maxWidth: 480 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ margin: 0 }}>Book Appointment</h3>
              <button
                onClick={() => setBookingDoctor(null)}
                style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "1.5rem" }}
              >
                ×
              </button>
            </div>
            <p style={{ marginBottom: "1.5rem", color: "var(--text-secondary)" }}>
              Booking with <strong style={{ color: "var(--primary)" }}>Dr. {bookingDoctor.fullname}</strong> —{" "}
              {bookingDoctor.specialisation}
            </p>
            <form onSubmit={handleBook}>
              <div className="form-group">
                <label className="form-label">Appointment Date</label>
                <input
                  type="date"
                  id="booking-date"
                  className="form-control-custom"
                  value={bookingForm.date}
                  onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Appointment Time</label>
                <input
                  type="time"
                  id="booking-time"
                  className="form-control-custom"
                  value={bookingForm.time}
                  onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Upload Medical Document (optional)</label>
                <input
                  type="file"
                  id="booking-document"
                  className="form-control-custom"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={(e) => setBookingForm({ ...bookingForm, document: e.target.files[0] })}
                />
              </div>
              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button type="submit" id="booking-submit" className="btn-primary-custom" disabled={submitting} style={{ flex: 1, justifyContent: "center" }}>
                  {submitting ? "Booking..." : "✅ Confirm Booking"}
                </button>
                <button type="button" className="btn-outline-custom" onClick={() => setBookingDoctor(null)} style={{ flex: 1, justifyContent: "center" }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;
