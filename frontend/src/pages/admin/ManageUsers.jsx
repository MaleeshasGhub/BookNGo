import { useState, useEffect } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function ManageUsers() {
  const navigate = useNavigate();
  const user     = JSON.parse(localStorage.getItem("user"));

  const [users, setUsers]   = useState([]);
  const [error, setError]   = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user || user.userType !== "ADMIN") { navigate("/login"); return; }

    API.get("/admin/users")
      .then((res) => setUsers(res.data))
      .catch(() => setError("Failed to load users."))
      .finally(() => setLoading(false));
  }, []);

  const handleDeactivate = async (id) => {
    try {
      await API.put(`/admin/users/${id}/deactivate`);
      setUsers(users.map(u => u.userId === id ? { ...u, status: "INACTIVE" } : u));
      setMessage("User deactivated.");
    } catch { setError("Failed to deactivate user."); }
  };

  const handleReactivate = async (id) => {
    try {
      await API.put(`/admin/users/${id}/reactivate`);
      setUsers(users.map(u => u.userId === id ? { ...u, status: "ACTIVE" } : u));
      setMessage("User reactivated.");
    } catch { setError("Failed to reactivate user."); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this user?")) return;
    try {
      await API.delete(`/admin/users/${id}`);
      setUsers(users.filter(u => u.userId !== id));
      setMessage("User deleted.");
    } catch { setError("Failed to delete user."); }
  };

  const filtered = users.filter(u =>
    u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <div style={{ width: "100%", maxWidth: "800px" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: 700 }}>Manage Users</h2>
            <p style={{ color: "#888", fontSize: "13px" }}>{users.length} total users</p>
          </div>
          <button className="btn-secondary" onClick={() => navigate("/admin/dashboard")}>
            ← Dashboard
          </button>
        </div>

        {message && <div className="alert alert-success">{message}</div>}
        {error   && <div className="alert alert-error">{error}</div>}

        {/* Search */}
        <div className="form-group">
          <input
            type="text" placeholder="Search by name or email..."
            value={search} onChange={e => setSearch(e.target.value)}
          />
        </div>

        {loading && <p style={{ color: "#888" }}>Loading users...</p>}

        {filtered.map((u) => (
          <div key={u.userId} style={{
            background: "#fff", borderRadius: "12px", padding: "16px",
            marginBottom: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            display: "flex", justifyContent: "space-between", alignItems: "center"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                width: "40px", height: "40px", borderRadius: "50%",
                background: "#ede9fe", color: "#4f46e5",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, fontSize: "16px", flexShrink: 0
              }}>
                {u.fullName?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: "14px" }}>{u.fullName}</p>
                <p style={{ color: "#888", fontSize: "12px" }}>{u.email}</p>
                <div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
                  <span style={{
                    fontSize: "11px", padding: "2px 8px", borderRadius: "20px",
                    background: "#ede9fe", color: "#4f46e5", fontWeight: 600
                  }}>{u.userType}</span>
                  <span style={{
                    fontSize: "11px", padding: "2px 8px", borderRadius: "20px",
                    background: u.status === "ACTIVE" ? "#dcfce7" : "#fee2e2",
                    color: u.status === "ACTIVE" ? "#16a34a" : "#dc2626",
                    fontWeight: 600
                  }}>{u.status}</span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              {u.status === "ACTIVE" ? (
                <button className="btn-secondary" style={{ fontSize: "12px", padding: "6px 12px" }}
                  onClick={() => handleDeactivate(u.userId)}>
                  Deactivate
                </button>
              ) : (
                <button className="btn-secondary" style={{ fontSize: "12px", padding: "6px 12px" }}
                  onClick={() => handleReactivate(u.userId)}>
                  Reactivate
                </button>
              )}
              <button className="btn-danger" style={{ fontSize: "12px", padding: "6px 12px" }}
                onClick={() => handleDelete(u.userId)}>
                Delete
              </button>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}