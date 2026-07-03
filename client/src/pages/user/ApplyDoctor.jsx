import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../../api/axiosInstance";
import Layout from "../../components/Layout";

const ApplyDoctor = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    phone: "",
    address: "",
    specialisation: "",
    experience: "",
    fees: "",
    timingFrom: "09:00",
    timingTo: "17:00",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const specialisations = [
    "General Physician", "Cardiologist", "Dermatologist", "Neurologist",
    "Orthopedic", "Pediatrician", "Psychiatrist", "Radiologist",
    "Surgeon", "Urologist", "ENT Specialist", "Gynecologist", "Ophthalmologist",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const required = ["fullname", "email", "phone", "address", "specialisation", "experience", "fees"];
    for (const f of required) {
      if (!form[f]) return toast.error(`Please fill in the ${f} field.`);
    }
    try {
      setSubmitting(true);
      const payload = {
        ...form,
        fees: Number(form.fees),
        timings: [form.timingFrom, form.timingTo],
      };
      const { data } = await API.post("/user/applyDoctor", payload);
      if (data.success) {
        toast.success(data.message);
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title">🩺 Apply as Doctor</h1>
          <p className="page-subtitle">Submit your application. An admin will review and approve it.</p>
        </div>
      </div>

      <div style={{ maxWidth: 700 }}>
        <div className="card-glass">
          <form onSubmit={handleSubmit}>
            <h3 style={{ marginBottom: "1.5rem", color: "var(--primary)" }}>Personal Information</h3>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input name="fullname" id="apply-fullname" type="text" className="form-control-custom" placeholder="Dr. John Smith" value={form.fullname} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input name="email" id="apply-email" type="email" className="form-control-custom" placeholder="doctor@example.com" value={form.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input name="phone" id="apply-phone" type="tel" className="form-control-custom" placeholder="+1 234 567 8900" value={form.phone} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Address / Clinic Location</label>
                <input name="address" id="apply-address" type="text" className="form-control-custom" placeholder="123 Medical Ave, City" value={form.address} onChange={handleChange} />
              </div>
            </div>

            <h3 style={{ margin: "1.5rem 0 1rem", color: "var(--primary)" }}>Professional Details</h3>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Specialisation</label>
                <select name="specialisation" id="apply-specialisation" className="form-control-custom" value={form.specialisation} onChange={handleChange}>
                  <option value="">Select specialisation</option>
                  {specialisations.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Experience (years)</label>
                <input name="experience" id="apply-experience" type="number" min="0" className="form-control-custom" placeholder="e.g. 5" value={form.experience} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Consultation Fees (₹)</label>
                <input name="fees" id="apply-fees" type="number" min="0" className="form-control-custom" placeholder="e.g. 500" value={form.fees} onChange={handleChange} />
              </div>
            </div>

            <h3 style={{ margin: "1.5rem 0 1rem", color: "var(--primary)" }}>Availability Timings</h3>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">From</label>
                <input name="timingFrom" id="apply-timing-from" type="time" className="form-control-custom" value={form.timingFrom} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">To</label>
                <input name="timingTo" id="apply-timing-to" type="time" className="form-control-custom" value={form.timingTo} onChange={handleChange} />
              </div>
            </div>

            <button id="apply-submit" type="submit" className="btn-primary-custom" style={{ marginTop: "1rem", padding: "13px 36px" }} disabled={submitting}>
              {submitting ? "Submitting..." : "📤 Submit Application"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ApplyDoctor;
