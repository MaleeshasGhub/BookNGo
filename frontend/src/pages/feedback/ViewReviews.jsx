import { useState, useEffect } from "react";
import API from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";

export default function ViewReviews() {
  const { driverId } = useParams();
  const navigate     = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/reviews/driver/${driverId}`)
      .then((res) => setReviews(res.data))
      .catch(() => setError("Failed to load reviews."))
      .finally(() => setLoading(false));
  }, [driverId]);

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const renderStars = (rating) =>
    [1, 2, 3, 4, 5].map((s) => (
      <span key={s} style={{ color: s <= rating ? "#f59e0b" : "#e5e7eb", fontSize: "16px" }}>★</span>
    ));

  return (
    <div className="page-container">
      <div className="profile-card" style={{ maxWidth: "640px" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 700 }}>Driver Reviews</h2>
          <button className="btn-secondary" onClick={() => navigate(-1)}>← Back</button>
        </div>

        {error   && <div className="alert alert-error">{error}</div>}
        {loading && <p style={{ color: "#888" }}>Loading reviews...</p>}

        {/* Average rating summary */}
        {avgRating && (
          <div style={{
            background: "#fffbeb", border: "1px solid #fde68a",
            borderRadius: "12px", padding: "20px", marginBottom: "24px",
            display: "flex", alignItems: "center", gap: "16px"
          }}>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "42px", fontWeight: 800, color: "#f59e0b", lineHeight: 1 }}>
                {avgRating}
              </p>
              <div style={{ marginTop: "4px" }}>{renderStars(Math.round(avgRating))}</div>
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: "15px" }}>Average Rating</p>
              <p style={{ color: "#888", fontSize: "13px" }}>
                Based on {reviews.length} review{reviews.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        )}

        {!loading && reviews.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#aaa" }}>
            <p style={{ fontSize: "36px" }}>⭐</p>
            <p style={{ marginTop: "10px" }}>No reviews yet for this driver.</p>
          </div>
        )}

        {reviews.map((review) => (
          <div key={review.reviewId} style={{
            background: "#fff", border: "1px solid #eee",
            borderRadius: "12px", padding: "16px", marginBottom: "12px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{
                  width: "34px", height: "34px", borderRadius: "50%",
                  background: "#ede9fe", color: "#4f46e5",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, fontSize: "14px"
                }}>
                  {review.passenger?.fullName?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: "14px" }}>
                    {review.passenger?.fullName}
                  </p>
                  <p style={{ fontSize: "11px", color: "#888" }}>
                    Ride #{review.ride?.rideId}
                  </p>
                </div>
              </div>
              <div style={{ display: "flex" }}>{renderStars(review.rating)}</div>
            </div>

            {review.comment && (
              <p style={{ fontSize: "13px", color: "#555", marginTop: "8px", lineHeight: 1.6 }}>
                "{review.comment}"
              </p>
            )}

            <p style={{ fontSize: "11px", color: "#bbb", marginTop: "10px" }}>
              {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}

      </div>
    </div>
  );
}
