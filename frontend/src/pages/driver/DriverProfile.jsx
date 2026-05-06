import { useState, useEffect } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function DriverProfile() {
  const navigate = useNavigate();
  const driver   = JSON.parse(localStorage.getItem("user"));

  const [form, setForm]       = useState({ fullName: "", phone: "", vehicleType: "", vehiclePlate: "" });
  const [message, setMessage] = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!driver) { navigate("/login"); return; }

    API.get(`/drivers/${driver.userId}`)
      .then((res) => {
        const d = res.data;
        setForm({
          fullName:     d.fullName     || "",
          phone:        d.phone        || "",
          vehicleType:  d.vehicleType  || "",
          vehiclePlate: d.vehiclePlate || "",
        });
      })
      .catch(() => setError("Failed to load driver profile."));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true); setMessage(""); setError("");
    try {
      await API.put(`/drivers/${driver.userId}`, form);
      setMessage("Profile updated successfully!");
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.error || "Update failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your driver account?")) return;
    try {
      await API.delete(`/drivers/${driver.userId}`);
      localStorage.removeItem("user");
      navigate("/register");
    } catch {
      setError("Failed to delete account.");
    }
  };

  return (
    <div className="page-container">
      <div className="profile-card">

        <div className="profile-header">
          <div className="avatar">{form.fullName?.charAt(0)?.toUpperCase()}</div>
          <div>
            <h2>{form.fullName}</h2>
            <span className="badge">DRIVER</span>
          </div>
        </div>

        {message && <div className="alert alert-success">{message}</div>}
        {error   && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleUpdate}>

          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="fullName" value={form.fullName}
              onChange={handleChange} disabled={!editing} />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input type="tel" name="phone" value={form.phone}
              onChange={handleChange} disabled={!editing} />
          </div>

          <div className="form-group">
            <label>Vehicle Type</label>
            {editing ? (
              <select name="vehicleType" value={form.vehicleType} onChange={handleChange}>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Van">Van</option>
                <option value="Tuk">Tuk</option>
              </select>
            ) : (
              <input type="text" value={form.vehicleType} disabled />
            )}
          </div>

          <div className="form-group">
            <label>Vehicle Plate</label>
            <input type="text" name="vehiclePlate" value={form.vehiclePlate}
              onChange={handleChange} disabled={!editing} />
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
              <>
                <button type="button" className="btn-primary" onClick={() => setEditing(true)}>
                  Edit Profile
                </button>
                <button type="button" className="btn-secondary"
                  onClick={() => navigate("/driver/availability")}>
                  Availability
                </button>
              </>
            )}
          </div>

        </form>

        <div className="danger-zone">
          <button className="btn-danger" onClick={handleDelete}>Delete Account</button>
          <button className="btn-secondary" onClick={() => {
            localStorage.removeItem("user"); navigate("/login");
          }}>Logout</button>
        </div>

      </div>
    </div>
  );
}