import { useState, useEffect } from "react";
import API from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";

export default function TrackRide() {
  const { id }    = useParams();
  const navigate  = useNavigate();

  const [ride, setRide]   = useState(null);
  const [error, setError] = useState("");

  const statusSteps = ["PENDING", "ACCEPTED", "ONGOING", "COMPLETED"];

  const statusColor = {
    PENDING:   { bg: "#fef9c3", text: "#854d0e", label: "⏳ Waiting for driver..." },
    ACCEPTED:  { bg: "#dbeafe", text: "#1e40af", label: "✅ Driver is on the way!" },
    ONGOING:   { bg: "#dcfce7", text: "#166534", label: "🚗 Ride in progress" },
    COMPLETED: { bg: "#f0fdf4", text: "#15803d", label: "🏁 Ride completed" },
    CANCELLED: { bg: "#fee2e2", text: "#dc2626", label: "❌ Ride cancelled" },
  };

  useEffect(() => {
    const fetchRide = () => {
      API.get(`/rides/${id}`)
        .then((res) => setRide(res.data))
        .catch(() => setError("Failed to load ride details."));
    };

    fetchRide();
    // Poll every 10 seconds to get live status updates
    const interval = setInterval(fetchRide, 10000);
    return () => clearInterval(interval);
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm("Cancel this ride?")) return;
    try {
      await API.delete(`/rides/${id}/cancel`);
      navigate("/ride/book");
    } catch {
      setError("Cannot cancel this ride.");
    }
  };

  if (error) return <div className="page-container"><div className="alert alert-error">{error}</div></div>;
  if (!ride) return <div className="page-container"><p style={{color:"#888"}}>Loading ride details...</p></div>;

  const currentStatus = ride.status;
  const statusInfo    = statusColor[currentStatus] || statusColor["PENDING"];

  return (
    <div className="page-container">
      <div className="profile-card">

        <h2 style={{ marginBottom: "6px" }}>Track Ride #{ride.rideId}</h2>
        <p style={{ color: "#888", marginBottom: "24px", fontSize: "14px" }}>
          Live ride status
        </p>

        {/* Status banner */}
        <div style={{
          background: statusInfo.bg, color: statusInfo.text,
          padding: "14px 18px", borderRadius: "10px",
          fontWeight: 600, fontSize: "15px", marginBottom: "24px"
        }}>
          {statusInfo.label}
        </div>

        {/* Progress steps */}
        {currentStatus !== "CANCELLED" && (
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "28px" }}>
            {statusSteps.map((step, i) => {
              const active = statusSteps.indexOf(currentStatus) >= i;
              return (
                <div key={step} style={{ textAlign: "center", flex: 1 }}>
                  <div style={{
                    width: "28px", height: "28px", borderRadius: "50%",
                    background: active ? "#4f46e5" : "#e5e7eb",
                    color: active ? "#fff" : "#9ca3af",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 6px", fontSize: "13px", fontWeight: 700
                  }}>{i + 1}</div>
                  <p style={{ fontSize: "10px", color: active ? "#4f46e5" : "#9ca3af", fontWeight: 600 }}>
                    {step}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Ride details */}
        <div style={{ background: "#f9f9f9", borderRadius: "12px", padding: "16px", marginBottom: "20px" }}>
          <p style={{ marginBottom: "10px" }}>
            <strong>📍 Pickup:</strong> {ride.pickupLocation}
          </p>
          <p style={{ marginBottom: "10px" }}>
            <strong>🏁 Drop-off:</strong> {ride.dropoffLocation}
          </p>
          <p style={{ marginBottom: "10px" }}>
            <strong>🚗 Ride Type:</strong> {ride.rideType}
          </p>
          <p style={{ marginBottom: "10px" }}>
            <strong>💰 Fare:</strong> Rs. {ride.fare?.toFixed(2)}
          </p>
          {ride.driver && (
            <p>
              <strong>👤 Driver:</strong> {ride.driver.fullName} — {ride.driver.vehiclePlate}
            </p>
          )}
        </div>

        <div className="btn-row">
          {currentStatus === "PENDING" && (
            <button className="btn-danger" onClick={handleCancel}>Cancel Ride</button>
          )}
          {currentStatus === "COMPLETED" && (
            <button className="btn-primary" onClick={() => navigate(`/feedback/submit/${ride.rideId}`)}>
              Leave a Review
            </button>
          )}
          <button className="btn-secondary" onClick={() => navigate("/ride/book")}>
            Book Another
          </button>
        </div>

      </div>
    </div>
  );
}