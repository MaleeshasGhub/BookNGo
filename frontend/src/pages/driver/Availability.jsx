import { useState, useEffect } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function Availability() {
  const navigate   = useNavigate();
  const driver     = JSON.parse(localStorage.getItem("user"));

  const [availability, setAvailability] = useState("AVAILABLE");
  const [message, setMessage]           = useState("");
  const [error, setError]               = useState("");
  const [loading, setLoading]           = useState(false);

  useEffect(() => {
    if (!driver) { navigate("/login"); return; }

    API.get(`/drivers/${driver.userId}`)
      .then((res) => setAvailability(res.data.availability))
      .catch(() => setError("Failed to load availability."));
  }, []);

  const handleChange = async (newStatus) => {
    setLoading(true); setMessage(""); setError("");
    try {
      await API.put(`/drivers/${driver.userId}/availability`, {
        availability: newStatus,
      });
      setAvailability(newStatus);
      setMessage(`Status updated to ${newStatus}`);
    } catch {
      setError("Failed to update availability.");
    } finally {
      setLoading(false);
    }
  };

  const statusColor = {
    AVAILABLE: "#16a34a",
    BUSY:      "#d97706",
    OFFLINE:   "#6b7280",
  };

  return (
    <div className="page-container">
      <div className="profile-card">

        <h2 style={{ marginBottom: "8px" }}>Availability Dashboard</h2>
        <p style={{ color: "#888", marginBottom: "28px", fontSize: "14px" }}>
          Set your current driving status
        </p>

        {message && <div className="alert alert-success">{message}</div>}
        {error   && <div className="alert alert-error">{error}</div>}

        {/* Current status display */}
        <div style={{
          display: "flex", alignItems: "center", gap: "12px",
          padding: "16px", background: "#f9f9f9", borderRadius: "12px",
          marginBottom: "28px"
        }}>
          <div style={{
            width: "14px", height: "14px", borderRadius: "50%",
            background: statusColor[availability],
          }} />
          <span style={{ fontWeight: 600, fontSize: "16px" }}>
            Current Status: {availability}
          </span>
        </div>

        {/* Status buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

          <button
            className={availability === "AVAILABLE" ? "btn-primary" : "btn-secondary"}
            onClick={() => handleChange("AVAILABLE")}
            disabled={loading || availability === "AVAILABLE"}
          >
            🟢 Set Available
          </button>

          <button
            className={availability === "BUSY" ? "btn-primary" : "btn-secondary"}
            onClick={() => handleChange("BUSY")}
            disabled={loading || availability === "BUSY"}
            style={availability === "BUSY" ? { background: "#d97706" } : {}}
          >
            🟡 Set Busy
          </button>

          <button
            className={availability === "OFFLINE" ? "btn-primary" : "btn-secondary"}
            onClick={() => handleChange("OFFLINE")}
            disabled={loading || availability === "OFFLINE"}
            style={availability === "OFFLINE" ? { background: "#6b7280" } : {}}
          >
            ⚫ Set Offline
          </button>

        </div>

        <div style={{ marginTop: "24px" }}>
          <button className="btn-secondary" onClick={() => navigate("/driver/profile")}>
            ← Back to Profile
          </button>
        </div>

      </div>
    </div>
  );
}