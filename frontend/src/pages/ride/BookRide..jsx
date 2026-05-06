import { useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function BookRide() {
  const navigate  = useNavigate();
  const user      = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    pickupLocation:  "",
    dropoffLocation: "",
    rideType:        "STANDARD",
  });

  const [fare, setFare]       = useState(null);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const updated = { ...form, [e.target.name]: e.target.value };
    setForm(updated);
    // Estimate fare preview
    setFare(updated.rideType === "PREMIUM" ? "Rs. 1000" : "Rs. 500");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { navigate("/login"); return; }
    setError(""); setSuccess(""); setLoading(true);

    try {
      const res = await API.post(`/rides/book/${user.userId}`, form);
      setSuccess(`Ride booked! Your ride ID is #${res.data.rideId}. Finding a driver...`);
      setTimeout(() => navigate(`/ride/track/${res.data.rideId}`), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Booking failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="profile-card">
        <h2 style={{ marginBottom: "6px" }}>Book a Ride</h2>
        <p style={{ color: "#888", marginBottom: "28px", fontSize: "14px" }}>
          Enter your pickup and drop-off locations
        </p>

        {error   && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>📍 Pickup Location</label>
            <input
              type="text"
              name="pickupLocation"
              value={form.pickupLocation}
              onChange={handleChange}
              placeholder="e.g. Colombo Fort"
              required
            />
          </div>

          <div className="form-group">
            <label>🏁 Drop-off Location</label>
            <input
              type="text"
              name="dropoffLocation"
              value={form.dropoffLocation}
              onChange={handleChange}
              placeholder="e.g. Nugegoda"
              required
            />
          </div>

          <div className="form-group">
            <label>Ride Type</label>
            <select name="rideType" value={form.rideType} onChange={handleChange}>
              <option value="STANDARD">🚗 Standard — Rs. 50/km</option>
              <option value="PREMIUM">🚙 Premium — Rs. 100/km</option>
            </select>
          </div>

          {/* Fare estimate */}
          {fare && (
            <div style={{
              background: "#f0fdf4", border: "1px solid #86efac",
              borderRadius: "10px", padding: "14px", marginBottom: "20px"
            }}>
              <p style={{ color: "#16a34a", fontWeight: 600, fontSize: "15px" }}>
                Estimated Fare: {fare}
              </p>
              <p style={{ color: "#888", fontSize: "12px", marginTop: "4px" }}>
                Based on approx. 10 km distance
              </p>
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Booking..." : "Book Ride"}
          </button>

        </form>

        <div style={{ marginTop: "16px" }}>
          <button className="btn-secondary" onClick={() => navigate("/ride/history")}>
            View Ride History
          </button>
        </div>

      </div>
    </div>
  );
}