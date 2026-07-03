import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import API from "../../api/axiosInstance";
import Layout from "../../components/Layout";

const DoctorProfile = () => {
  const { user } = useSelector((state) => state.user);
  const [form, setForm] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const specialisations = [
    "General Physician","Cardiologist","Dermatologist","Neurologist","Orthopedic",
    "Pediatrician","Psychiatrist","Radiologist","Surgeon","Urologist",
    "ENT Specialist","Gynecologist","Ophthalmologist",
  ];

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data } = await API.get(`/doctor/getDoctorInfo/${user._id}`);
      if (data.success) {
        const d = data.data;
        setForm({ ...d, timingFrom: d.timings?.[0] || "09:00", timingTo: d.timings?.[1] || "17:00" });
      }
    } catch {
      toast.error("Failed to load profile.");
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = { ...form, timings: [form.timingFrom, form.timingTo], fees: Number(form.fees) };
      const { data } = await API.post("/doctor/updateProfile", payload);
      if (data.success) toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!form) return <Layout><div className="empty-state"><span className="empty-icon">⏳</span><h3>Loading profile...</h3></div></Layout>;

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title">👤 My Profile</h1>
          <p className="page-subtitle">Update your professional information and availability.</p>
        </div>
      </div>

      <div style={{ maxWidth: 700 }}>
        <div className="card-glass">
          <form onSubmit={handleSubmit}>
            <h3 style={{ marginBottom: "1.5rem", color: "var(--primary)" }}>Personal Info</h3>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input name="fullname" id="profile-fullname" type="text" className="form-control-custom" value={form.fullname} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input name="phone" id="profile-phone" type="tel" className="form-control-custom" value={form.phone} onChange={handleChange} />
              </div>
              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label className="form-label">Address</label>
                <input name="address" id="profile-address" type="text" className="form-control-custom" value={form.address} onChange={handleChange} />
              </div>
            </div>

            <h3 style={{ margin: "1.5rem 0 1rem", color: "var(--primary)" }}>Professional Details</h3>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Specialisation</label>
                <select name="specialisation" id="profile-specialisation" className="form-control-custom" value={form.specialisation} onChange={handleChange}>
                  {specialisations.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Experience (years)</label>
                <input name="experience" id="profile-experience" type="number" className="form-control-custom" value={form.experience} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Consultation Fees (₹)</label>
                <input name="fees" id="profile-fees" type="number" className="form-control-custom" value={form.fees} onChange={handleChange} />
              </div>
            </div>

            <h3 style={{ margin: "1.5rem 0 1rem", color: "var(--primary)" }}>Availability</h3>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">From</label>
                <input name="timingFrom" id="profile-timing-from" type="time" className="form-control-custom" value={form.timingFrom} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">To</label>
                <input name="timingTo" id="profile-timing-to" type="time" className="form-control-custom" value={form.timingTo} onChange={handleChange} />
              </div>
            </div>

            <button id="profile-submit" type="submit" className="btn-primary-custom" style={{ marginTop: "1rem", padding: "13px 36px" }} disabled={submitting}>
              {submitting ? "Saving..." : "💾 Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default DoctorProfile;
