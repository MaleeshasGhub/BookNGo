import { useState, useEffect } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const user     = JSON.parse(localStorage.getItem("user"));

  const [form, setForm]       = useState({ fullName: "", email: "", phone: "" });
  const [message, setMessage] = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  // Load user data when page opens
  useEffect(() => {
    if (!user) { navigate("/login"); return; }

    API.get(`/users/${user.userId}`)
      .then((res) => {
        const u = res.data;
        setForm({ fullName: u.fullName, email: u.email, phone: u.phone || "" });
      })
      .catch(() => setError("Failed to load profile."));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // UPDATE
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(""); setError("");

    try {
      await API.put(`/users/${user.userId}`, form);
      setMessage("Profile updated successfully!");
      setEditing(false);
      // Update localStorage
      localStorage.setItem("user", JSON.stringify({ ...user, ...form }));
    } catch (err) {
      setError(err.response?.data?.error || "Update failed.");
    } finally {
      setLoading(false);
    }
  };

  // DELETE
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;

    try {
      await API.delete(`/users/${user.userId}`);
      localStorage.removeItem("user");
      navigate("/register");
    } catch (err) {
      setError("Failed to delete account.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="page-container">
      <div className="profile-card">

        <div className="profile-header">
          <div className="avatar">{form.fullName?.charAt(0)?.toUpperCase()}</div>
          <div>
            <h2>{form.fullName}</h2>
            <span className="badge">{user?.userType}</span>
          </div>
        </div>

        {message && <div className="alert alert-success">{message}</div>}
        {error   && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>

          <div className="btn-row">
            {editing ? (
              <>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button type="button" className="btn-secondary" onClick={() => setEditing(false)}>
                  Cancel
                </button>
              </>
            ) : (
              <button type="button" className="btn-primary" onClick={() => setEditing(true)}>
                Edit Profile
              </button>
            )}
          </div>
        </form>

        <div className="danger-zone">
          <button className="btn-danger" onClick={handleDelete}>Delete Account</button>
          <button className="btn-secondary" onClick={handleLogout}>Logout</button>
        </div>

      </div>
    </div>
  );
}