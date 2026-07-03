import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../../api/axiosInstance";
import Layout from "../../components/Layout";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await API.get("/admin/getAllUsers");
      if (data.success) setUsers(data.data);
    } catch { toast.error("Failed to load users."); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user? This action cannot be undone.")) return;
    try {
      const { data } = await API.delete(`/admin/deleteUser/${id}`);
      if (data.success) {
        toast.success("User deleted.");
        setUsers(users.filter((u) => u._id !== id));
      }
    } catch { toast.error("Deletion failed."); }
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title">👥 All Users</h1>
          <p className="page-subtitle">Manage registered patients and doctors on the platform.</p>
        </div>
        <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{users.length} users total</span>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <input id="user-search" type="text" className="form-control-custom" placeholder="🔍 Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ maxWidth: 360 }} />
      </div>

      {loading ? (
        <div className="empty-state"><span className="empty-icon">⏳</span><h3>Loading...</h3></div>
      ) : (
        <div className="card-glass" style={{ overflowX: "auto" }}>
          <table className="table-custom">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={u._id}>
                  <td style={{ color: "var(--text-muted)" }}>{i + 1}</td>
                  <td><strong style={{ color: "var(--text-primary)" }}>{u.name}</strong></td>
                  <td>{u.email}</td>
                  <td>{u.phone || "—"}</td>
                  <td>
                    <span className={`badge-status ${u.isDoctor ? "badge-approved" : "badge-pending"}`}>
                      {u.isDoctor ? "Doctor" : "Patient"}
                    </span>
                  </td>
                  <td style={{ fontSize: "0.85rem" }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button id={`delete-user-${u._id}`} className="btn-danger-custom" style={{ padding: "6px 14px", fontSize: "0.8rem" }} onClick={() => handleDelete(u._id)}>
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="empty-state" style={{ padding: "2rem" }}>
              <p>No users found.</p>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default AdminUsers;
