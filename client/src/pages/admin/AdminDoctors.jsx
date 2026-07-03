import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../../api/axiosInstance";
import Layout from "../../components/Layout";

const SPECIALISATIONS = [
  "General Physician", "Cardiologist", "Dermatologist", "Neurologist",
  "Orthopedic", "Pediatrician", "Psychiatrist", "Radiologist",
  "Surgeon", "Urologist", "ENT Specialist", "Gynecologist", "Ophthalmologist",
];

const EMPTY_FORM = {
  name: "", email: "", password: "", phone: "",
  address: "", specialisation: "", experience: "", fees: "",
  timingFrom: "09:00", timingTo: "17:00",
};

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => { fetchDoctors(); }, []);

  const fetchDoctors = async () => {
    try {
      const { data } = await API.get("/admin/getAllDoctors");
      if (data.success) setDoctors(data.data);
    } catch { toast.error("Failed to load doctors."); }
    finally { setLoading(false); }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  /* ── Create Doctor ── */
  const handleCreate = async (e) => {
    e.preventDefault();
    const required = ["name", "email", "password", "specialisation", "fees"];
    for (const f of required) {
      if (!form[f]) return toast.error(`Please fill in the "${f}" field.`);
    }
    if (form.password.length < 6) return toast.error("Password must be at least 6 characters.");

    try {
      setSubmitting(true);
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        address: form.address,
        specialisation: form.specialisation,
        experience: form.experience || "0",
        fees: Number(form.fees),
        timings: [form.timingFrom, form.timingTo],
      };
      const { data } = await API.post("/admin/createDoctor", payload);
      if (data.success) {
        toast.success(`✅ Doctor account created! ${form.email} can now login.`);
        setShowModal(false);
        setForm(EMPTY_FORM);
        fetchDoctors();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create doctor.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Change Status (approve/reject for self-applied doctors) ── */
  const changeStatus = async (doctorId, status) => {
    try {
      const { data } = await API.put("/admin/changeDoctorStatus", { doctorId, status });
      if (data.success) {
        toast.success(`Doctor ${status}.`);
        setDoctors(doctors.map((d) => d._id === doctorId ? { ...d, status } : d));
      }
    } catch { toast.error("Action failed."); }
  };

  /* ── Delete Doctor ── */
  const handleDelete = async (doctorId) => {
    if (!window.confirm("Delete this doctor and their login account? This cannot be undone.")) return;
    try {
      const { data } = await API.delete(`/admin/deleteDoctor/${doctorId}`);
      if (data.success) {
        toast.success("Doctor deleted.");
        setDoctors(doctors.filter((d) => d._id !== doctorId));
      }
    } catch { toast.error("Deletion failed."); }
  };

  const statusClass = (s) => {
    const map = { pending: "badge-pending", approved: "badge-approved", rejected: "badge-rejected" };
    return map[s] || "badge-pending";
  };

  const pending  = doctors.filter((d) => d.status === "pending").length;
  const approved = doctors.filter((d) => d.status === "approved").length;

  return (
    <Layout>
      {/* ── Page Header ── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">🩺 Doctors</h1>
          <p className="page-subtitle">Create and manage doctor accounts on the platform.</p>
        </div>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <span className="badge-status badge-pending">⏳ {pending} Pending</span>
          <span className="badge-status badge-approved">✅ {approved} Approved</span>
          <button
            id="open-create-doctor-modal"
            className="btn-primary-custom"
            onClick={() => { setShowModal(true); setForm(EMPTY_FORM); }}
          >
            ➕ Create Doctor
          </button>
        </div>
      </div>

      {/* ── Doctors Table ── */}
      {loading ? (
        <div className="empty-state"><span className="empty-icon">⏳</span><h3>Loading...</h3></div>
      ) : doctors.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🩺</span>
          <h3>No doctors yet</h3>
          <p>Click "Create Doctor" to add the first doctor to the platform.</p>
        </div>
      ) : (
        <div className="card-glass" style={{ overflowX: "auto" }}>
          <table className="table-custom">
            <thead>
              <tr>
                <th>#</th>
                <th>Doctor</th>
                <th>Specialisation</th>
                <th>Experience</th>
                <th>Fees</th>
                <th>Phone</th>
                <th>Availability</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doc, i) => (
                <tr key={doc._id}>
                  <td style={{ color: "var(--text-muted)" }}>{i + 1}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: "50%",
                        background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "1rem", flexShrink: 0,
                      }}>👨‍⚕️</div>
                      <div>
                        <strong style={{ color: "var(--text-primary)", display: "block" }}>{doc.fullname}</strong>
                        <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{doc.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ color: "var(--primary)", fontWeight: 600, fontSize: "0.88rem" }}>
                      {doc.specialisation}
                    </span>
                  </td>
                  <td>{doc.experience} yrs</td>
                  <td>₹{doc.fees}</td>
                  <td>{doc.phone || "—"}</td>
                  <td style={{ fontSize: "0.82rem" }}>
                    {doc.timings?.[0]} – {doc.timings?.[1]}
                  </td>
                  <td>
                    <span className={`badge-status ${statusClass(doc.status)}`}>{doc.status}</span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                      {doc.status === "pending" && (
                        <button
                          id={`approve-doc-${doc._id}`}
                          className="btn-primary-custom"
                          style={{ padding: "5px 10px", fontSize: "0.76rem" }}
                          onClick={() => changeStatus(doc._id, "approved")}
                        >✅ Approve</button>
                      )}
                      {doc.status === "pending" && (
                        <button
                          id={`reject-doc-${doc._id}`}
                          className="btn-danger-custom"
                          style={{ padding: "5px 10px" }}
                          onClick={() => changeStatus(doc._id, "rejected")}
                        >❌ Reject</button>
                      )}
                      <button
                        id={`delete-doc-${doc._id}`}
                        className="btn-danger-custom"
                        style={{ padding: "5px 10px" }}
                        onClick={() => handleDelete(doc._id)}
                      >🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Create Doctor Modal ── */}
      {showModal && (
        <div style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.75)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 300, padding: "1rem", overflowY: "auto",
        }}>
          <div className="card-glass" style={{
            width: "100%", maxWidth: 580,
            margin: "auto",
            animation: "fadeInUp 0.3s ease",
          }}>
            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "1.4rem" }}>➕ Create Doctor Account</h2>
                <p style={{ margin: "4px 0 0", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  The doctor will use these credentials to login.
                </p>
              </div>
              <button
                id="close-create-doctor-modal"
                onClick={() => setShowModal(false)}
                style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "1.6rem", lineHeight: 1 }}
              >×</button>
            </div>

            <form onSubmit={handleCreate}>
              {/* Login Credentials Section */}
              <div style={{
                background: "rgba(0,198,167,0.06)",
                border: "1px solid rgba(0,198,167,0.2)",
                borderRadius: "var(--radius-sm)",
                padding: "1rem 1.25rem",
                marginBottom: "1.25rem",
              }}>
                <p style={{ fontSize: "0.78rem", color: "var(--primary)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 1rem" }}>
                  🔑 Login Credentials
                </p>
                <div className="grid-2">
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Full Name *</label>
                    <input
                      name="name" id="create-doc-name" type="text"
                      className="form-control-custom"
                      placeholder="Dr. Jane Smith"
                      value={form.name} onChange={handleChange}
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Email Address *</label>
                    <input
                      name="email" id="create-doc-email" type="email"
                      className="form-control-custom"
                      placeholder="doctor@example.com"
                      value={form.email} onChange={handleChange}
                    />
                  </div>
                  <div className="form-group" style={{ margin: "1rem 0 0", gridColumn: "1 / -1" }}>
                    <label className="form-label">Password *</label>
                    <div style={{ position: "relative" }}>
                      <input
                        name="password" id="create-doc-password"
                        type={showPassword ? "text" : "password"}
                        className="form-control-custom"
                        placeholder="Min. 6 characters"
                        value={form.password} onChange={handleChange}
                        style={{ paddingRight: "48px" }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                          background: "none", border: "none", cursor: "pointer",
                          color: "var(--text-muted)", fontSize: "1rem",
                        }}
                      >{showPassword ? "🙈" : "👁️"}</button>
                    </div>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "6px 0 0" }}>
                      Share these credentials with the doctor so they can login.
                    </p>
                  </div>
                </div>
              </div>

              {/* Professional Details Section */}
              <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 1rem" }}>
                🩺 Professional Details
              </p>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Specialisation *</label>
                  <select name="specialisation" id="create-doc-specialisation" className="form-control-custom" value={form.specialisation} onChange={handleChange}>
                    <option value="">Select specialisation</option>
                    {SPECIALISATIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input name="phone" id="create-doc-phone" type="tel" className="form-control-custom" placeholder="+1 234 567 8900" value={form.phone} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Experience (years)</label>
                  <input name="experience" id="create-doc-experience" type="number" min="0" className="form-control-custom" placeholder="e.g. 5" value={form.experience} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Consultation Fees (₹) *</label>
                  <input name="fees" id="create-doc-fees" type="number" min="0" className="form-control-custom" placeholder="e.g. 500" value={form.fees} onChange={handleChange} />
                </div>
                <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                  <label className="form-label">Clinic / Address</label>
                  <input name="address" id="create-doc-address" type="text" className="form-control-custom" placeholder="123 Medical Ave, City" value={form.address} onChange={handleChange} />
                </div>
              </div>

              {/* Timings */}
              <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", margin: "0.5rem 0 1rem" }}>
                🕐 Availability Timings
              </p>
              <div className="grid-2" style={{ marginBottom: "1.5rem" }}>
                <div className="form-group">
                  <label className="form-label">From</label>
                  <input name="timingFrom" id="create-doc-timing-from" type="time" className="form-control-custom" value={form.timingFrom} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">To</label>
                  <input name="timingTo" id="create-doc-timing-to" type="time" className="form-control-custom" value={form.timingTo} onChange={handleChange} />
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  type="submit"
                  id="create-doc-submit"
                  className="btn-primary-custom"
                  style={{ flex: 1, justifyContent: "center", padding: "13px" }}
                  disabled={submitting}
                >
                  {submitting ? "Creating..." : "✅ Create Doctor Account"}
                </button>
                <button
                  type="button"
                  className="btn-outline-custom"
                  style={{ flex: 1, justifyContent: "center", padding: "13px" }}
                  onClick={() => setShowModal(false)}
                >
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

export default AdminDoctors;
