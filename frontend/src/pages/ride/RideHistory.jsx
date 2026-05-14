import { useState, useEffect } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function RideHistory() {
  const navigate = useNavigate();
  const user     = JSON.parse(localStorage.getItem("user"));

  const [rides, setRides]   = useState([]);
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(true);

  const statusColor = {
    PENDING:   "#f59e0b",
    ACCEPTED:  "#3b82f6",
    ONGOING:   "#10b981",
    COMPLETED: "#6366f1",
    CANCELLED: "#ef4444",
  };

  useEffect(() => {
    if (!user) { navigate("/login"); return; }

    const endpoint = user.userType === "DRIVER"
      ? `/rides/driver/${user.userId}`
      : `/rides/passenger/${user.userId}`;

    API.get(endpoint)
      .then((res) => setRides(res.data))
      .catch(() => setError("Failed to load ride history."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container">
      <div className="profile-card" style={{ maxWidth: "640px" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2>Ride History</h2>
          {user?.userType === "PASSENGER" && (
            <button className="btn-primary" style={{ width: "auto", padding: "8px 18px" }}
              onClick={() => navigate("/ride/book")}>
              + Book Ride
            </button>
          )}
        </div>

        {error   && <div className="alert alert-error">{error}</div>}
        {loading && <p style={{ color: "#888" }}>Loading...</p>}

        {!loading && rides.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#aaa" }}>
            <p style={{ fontSize: "40px" }}>🚕</p>
            <p style={{ marginTop: "12px" }}>No rides yet.</p>
          </div>
        )}

        {rides.map((ride) => (
          <div key={ride.rideId} style={{
            border: "1px solid #eee", borderRadius: "12px",
            padding: "16px", marginBottom: "14px",
            cursor: "pointer", transition: "box-shadow 0.15s"
          }}
            onClick={() => navigate(`/ride/track/${ride.rideId}`)}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <span style={{ fontWeight: 700, fontSize: "15px" }}>Ride #{ride.rideId}</span>
              <span style={{
                background: statusColor[ride.status] + "22",
                color: statusColor[ride.status],
                padding: "3px 10px", borderRadius: "20px",
                fontSize: "12px", fontWeight: 600
              }}>
                {ride.status}
              </span>
            </div>

            <p style={{ color: "#555", fontSize: "13px", marginBottom: "6px" }}>
              📍 {ride.pickupLocation} → 🏁 {ride.dropoffLocation}
            </p>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
              <span style={{ fontSize: "12px", color: "#888" }}>{ride.rideType}</span>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#4f46e5" }}>
                Rs. {ride.fare?.toFixed(2)}
              </span>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}