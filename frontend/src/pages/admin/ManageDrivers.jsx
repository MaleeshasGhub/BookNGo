import { useState, useEffect } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function ManageDrivers() {
  const navigate = useNavigate();
  const user     = JSON.parse(localStorage.getItem("user"));

  const [drivers, setDrivers] = useState([]);
  const [error, setError]     = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");

  const availabilityColor = {
    AVAILABLE: { bg: "#dcfce7", text: "#16a34a" },
    BUSY:      { bg: "#fef9c3", text: "#854d0e" },
    OFFLINE:   { bg: "#f3f4f6", text: "#6b7280" },
  };

  useEffect(() => {
    if (!user || user.userType !== "ADMIN") { navigate("/login"); return; }

    API.get("/admin/drivers")
      .then((res) => setDrivers(res.data))
      .catch(() => setError("Failed to load drivers."))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently remove this driver?")) return;
    try {
      await API.delete(`/admin/drivers/${id}`);
      setDrivers(drivers.filter(d => d.userId !== id));
      setMessage("Driver removed.");
    } catch { setError("Failed to delete driver."); }
  };

  const filtered = drivers.filter(d =>
    d.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    d.vehiclePlate?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <div style={{ width: "100%", maxWidth: "800px" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: 700 }}>Manage Drivers</h2>
            <p style={{ color: "#888", fontSize: "13px" }}>{drivers.length} registered drivers</p>
          </div>
          <button className="btn-secondary" onClick={() => navigate("/admin/dashboard")}>
            ← Dashboard
          </button>
        </div>

        {message && <div className="alert alert-success">{message}</div>}
        {error   && <div className="alert alert-error">{error}</div>}

        <div className="form-group">
          <input type="text" placeholder="Search by name or plate..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {loading && <p style={{ color: "#888" }}>Loading drivers...</p>}

        {filtered.map((d) => (
          <div key={d.userId} style={{
            background: "#fff", borderRadius: "12px", padding: "16px",
            marginBottom: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            display: "flex", justifyContent: "space-between", alignItems: "center"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                width: "40px", height: "40px", borderRadius: "50%",
                background: "#cffafe", color: "#0891b2",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, fontSize: "16px", flexShrink: 0
              }}>
                {d.fullName?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: "14px" }}>{d.fullName}</p>
                <p style={{ color: "#888", fontSize: "12px" }}>
                  {d.vehicleType} · {d.vehiclePlate}
                </p>
                <p style={{ color: "#888", fontSize: "12px" }}>
                  License: {d.licenseNumber}
                </p>
                <span style={{
                  fontSize: "11px", padding: "2px 8px", borderRadius: "20px",
                  background: availabilityColor[d.availability]?.bg,
                  color: availabilityColor[d.availability]?.text,
                  fontWeight: 600, display: "inline-block", marginTop: "4px"
                }}>{d.availability}</span>
              </div>
            </div>

            <button className="btn-danger" style={{ fontSize: "12px", padding: "6px 12px" }}
              onClick={() => handleDelete(d.userId)}>
              Remove
            </button>
          </div>
        ))}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#aaa" }}>
            <p style={{ fontSize: "36px" }}>🚕</p>
            <p style={{ marginTop: "10px" }}>No drivers found.</p>
          </div>
        )}

      </div>
    </div>
  );
}