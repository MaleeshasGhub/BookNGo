import { useState } from "react";
import API from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";

export default function SubmitReview() {
  const { rideId } = useParams();
  const navigate   = useNavigate();
  const user       = JSON.parse(localStorage.getItem("user"));

  const [rating, setRating]   = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) { setError("Please select a star rating."); return; }
    if (!user) { navigate("/login"); return; }
    setError(""); setSuccess(""); setLoading(true);
    try {
      await API.post("/reviews", {
        rideId:      String(rideId),
        passengerId: String(user.userId),
        rating:      String(rating),
        comment,
      });
      setSuccess("Review submitted successfully! Thank you.");
      setTimeout(() => navigate("/ride/history"), 1800);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };

  const starLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  return (
    <div className="page-container">
      <div className="profile-card">
        <h2 style={{ marginBottom: "6px" }}>Rate Your Ride</h2>
        <p style={{ color: "#888", marginBottom: "28px", fontSize: "14px" }}>
          Ride #{rideId} — Share your experience
        </p>

        {error   && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          {/* Star Rating */}
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "10px" }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  style={{
                    fontSize: "40px", cursor: "pointer",
                    color: star <= (hovered || rating) ? "#f59e0b" : "#e5e7eb",
                    transition: "color 0.15s, transform 0.1s",
                    transform: star <= (hovered || rating) ? "scale(1.15)" : "scale(1)",
                    display: "inline-block"
                  }}
                >★</span>
              ))}
            </div>
            {(hovered || rating) > 0 && (
              <p style={{ color: "#f59e0b", fontWeight: 600, fontSize: "15px" }}>
                {starLabels[hovered || rating]}
              </p>
            )}
          </div>

          <div className="form-group">
            <label>Your Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about your experience with the driver..."
              rows={4}
              style={{
                width: "100%", padding: "11px 14px",
                border: "1.5px solid #ddd", borderRadius: "8px",
                fontSize: "14px", resize: "vertical", fontFamily: "inherit"
              }}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>

        <div style={{ marginTop: "12px" }}>
          <button className="btn-secondary" onClick={() => navigate("/ride/history")}>
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}