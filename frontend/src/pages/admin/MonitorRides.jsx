import { useState, useEffect } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function MonitorRides() {
  const navigate = useNavigate();
  const user     = JSON.parse(localStorage.getItem("user"));

  const [rides, setRides]     = useState([]);
  const [filter, setFilter]   = useState("ALL");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(true);

  const statusColor = {
    PENDING:   { bg: "#fef9c3", text: "#854d0e" },
    ACCEPTED:  { bg: "#dbeafe", text: "#1e40af" },
    ONGOING:   { bg: "#dcfce7", text: "#166534" },
    COMPLETED: { bg: "#ede9fe", text: "#4f46e5" },
    CANCELLED: { bg: "#fee2e2", text: "#dc2626" },
  };

  useEffect(() => {
    if (!user || user.userType !== "ADMIN") { navigate("/login"); return; }

    API.get("/admin/rides")
      .then((res) => setRides(res.data))
      .catch(() => setError("Failed to load rides."))
      .finally(() => setLoading(false));
  }, []);

  const statuses = ["ALL", "PENDING", "ACCEPTED", "ONGOING", "COMPLETED", "CANCELLED"];

  const filtered = filter === "ALL"
    ? rides
    : rides.filter(r => r.status === filter);

  return (
    <div className="page-container">
      <div style={{ width: "100%", maxWidth: "800px" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: 700 }}>Monitor Rides</h2>
            <p style={{ color: "#888", fontSize: "13px" }}>{rides.length} total rides</p>
          </div>
          <button className="btn-secondary" onClick={() => navigate("/admin/dashboard")}>
            ← Dashboard
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                padding: "6px 14px", borderRadius: "20px", fontSize: "12px",
                fontWeight: 600, cursor: "pointer", border: "none",
                background: filter === s ? "#4f46e5" : "#f1f1f1",
                color: filter === s ? "#fff" : "#555",
                transition: "all 0.15s"
              }}
            >{s}</button>
          ))}
        </div>

        {loading && <p style={{ color: "#888" }}>Loading rides...</p>}

        {filtered.map((ride) => (
          <div key={ride.rideId} style={{
            background: "#fff", borderRadius: "12px", padding: "16px",
            marginBottom: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <span style={{ fontWeight: 700 }}>Ride #{ride.rideId}</span>
              <span style={{
                background: statusColor[ride.status]?.bg,
                color: statusColor[ride.status]?.text,
                padding: "3px 10px", borderRadius: "20px",
                fontSize: "12px", fontWeight: 600
              }}>{ride.status}</span>
            </div>

            <div style={{ fontSize: "13px", color: "#555" }}>
              <p style={{ marginBottom: "4px" }}>
                📍 {ride.pickupLocation} → 🏁 {ride.dropoffLocation}
              </p>
              <p style={{ marginBottom: "4px" }}>
                👤 Passenger: {ride.passenger?.fullName ?? "N/A"}
              </p>
              <p style={{ marginBottom: "4px" }}>
                🚗 Driver: {ride.driver?.fullName ?? "Not assigned"}
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
                <span style={{ color: "#888" }}>{ride.rideType}</span>
                <span style={{ fontWeight: 700, color: "#4f46e5" }}>
                  Rs. {ride.fare?.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#aaa" }}>
            <p style={{ fontSize: "36px" }}>🛣️</p>
            <p style={{ marginTop: "10px" }}>No rides found for this filter.</p>
          </div>
        )}

      </div>
    </div>
  );
}