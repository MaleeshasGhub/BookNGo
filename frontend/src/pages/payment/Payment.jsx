import { useState, useEffect } from "react";
import API from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";

export default function Payment() {
  const { rideId } = useParams();
  const navigate   = useNavigate();
  const user       = JSON.parse(localStorage.getItem("user"));

  const [ride, setRide]       = useState(null);
  const [method, setMethod]   = useState("CASH");
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    API.get(`/rides/${rideId}`)
      .then((res) => setRide(res.data))
      .catch(() => setError("Failed to load ride details."));
  }, []);

  const handlePay = async () => {
    setError(""); setSuccess(""); setLoading(true);
    try {
      const res = await API.post("/payments", {
        rideId:      rideId,
        passengerId: String(user.userId),
        method:      method,
      });
      setSuccess("Payment successful!");
      setTimeout(() => navigate(`/payment/invoice/${res.data.paymentId}`), 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Payment failed.");
    } finally {
      setLoading(false);
    }
  };

  const methodIcons = { CASH: "💵", CARD: "💳", WALLET: "👛" };

  return (
    <div className="page-container">
      <div className="profile-card">

        <h2 style={{ marginBottom: "6px" }}>Complete Payment</h2>
        <p style={{ color: "#888", marginBottom: "24px", fontSize: "14px" }}>
          Ride #{rideId} — Select your payment method
        </p>

        {error   && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {/* Fare summary */}
        {ride && (
          <div style={{
            background: "#f0f4ff", borderRadius: "12px",
            padding: "16px", marginBottom: "24px"
          }}>
            <p style={{ fontSize: "13px", color: "#555", marginBottom: "6px" }}>
              📍 {ride.pickupLocation} → 🏁 {ride.dropoffLocation}
            </p>
            <p style={{ fontSize: "22px", fontWeight: 700, color: "#4f46e5" }}>
              Rs. {ride.fare?.toFixed(2)}
            </p>
            <p style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}>
              {ride.rideType} ride
            </p>
          </div>
        )}

        {/* Payment method selector */}
        <p style={{ fontWeight: 600, marginBottom: "12px", fontSize: "14px" }}>
          Choose Payment Method
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
          {["CASH", "CARD", "WALLET"].map((m) => (
            <div
              key={m}
              onClick={() => setMethod(m)}
              style={{
                display: "flex", alignItems: "center", gap: "14px",
                padding: "14px 16px", borderRadius: "10px", cursor: "pointer",
                border: method === m ? "2px solid #4f46e5" : "1.5px solid #e5e7eb",
                background: method === m ? "#ede9fe" : "#fff",
                transition: "all 0.15s"
              }}
            >
              <span style={{ fontSize: "22px" }}>{methodIcons[m]}</span>
              <div>
                <p style={{ fontWeight: 600, color: method === m ? "#4f46e5" : "#333" }}>{m}</p>
                <p style={{ fontSize: "12px", color: "#888" }}>
                  {m === "CASH"   && "Pay with cash to driver"}
                  {m === "CARD"   && "Pay via credit/debit card"}
                  {m === "WALLET" && "Pay from your wallet balance"}
                </p>
              </div>
              <div style={{ marginLeft: "auto" }}>
                <div style={{
                  width: "18px", height: "18px", borderRadius: "50%",
                  border: method === m ? "5px solid #4f46e5" : "2px solid #d1d5db",
                  background: "#fff"
                }} />
              </div>
            </div>
          ))}
        </div>

        <button className="btn-primary" onClick={handlePay} disabled={loading || !ride}>
          {loading ? "Processing..." : `Pay Rs. ${ride?.fare?.toFixed(2) ?? "..."}`}
        </button>

        <div style={{ marginTop: "12px" }}>
          <button className="btn-secondary" onClick={() => navigate(`/ride/track/${rideId}`)}>
            ← Back to Ride
          </button>
        </div>

      </div>
    </div>
  );
}