import { useState, useEffect } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function Moderation() {
  const navigate = useNavigate();
  const user     = JSON.parse(localStorage.getItem("user"));

  const [reviews, setReviews] = useState([]);
  const [error, setError]     = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("ALL");

  useEffect(() => {
    if (!user || user.userType !== "ADMIN") { navigate("/login"); return; }

    API.get("/reviews")
      .then((res) => setReviews(res.data))
      .catch(() => setError("Failed to load reviews."))
      .finally(() => setLoading(false));
  }, []);

  const handleHide = async (id) => {
    try {
      await API.put(`/reviews/${id}/hide`);
      setReviews(reviews.map(r => r.reviewId === id ? { ...r, status: "HIDDEN" } : r));
      setMessage("Review hidden.");
    } catch { setError("Failed to hide review."); }
  };

  const handleShow = async (id) => {
    try {
      await API.put(`/reviews/${id}/show`);
      setReviews(reviews.map(r => r.reviewId === id ? { ...r, status: "VISIBLE" } : r));
      setMessage("Review restored.");
    } catch { setError("Failed to restore review."); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this review?")) return;
    try {
      await API.delete(`/reviews/${id}`);
      setReviews(reviews.filter(r => r.reviewId !== id));
      setMessage("Review deleted.");
    } catch { setError("Failed to delete review."); }
  };

  const renderStars = (rating) =>
    [1, 2, 3, 4, 5].map((s) => (
      <span key={s} style={{ color: s <= rating ? "#f59e0b" : "#e5e7eb", fontSize: "14px" }}>★</span>
    ));

  const filtered = filter === "ALL"
    ? reviews
    : reviews.filter(r => r.status === filter);

  return (
    <div className="page-container">
      <div style={{ width: "100%", maxWidth: "800px" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: 700 }}>Review Moderation</h2>
            <p style={{ color: "#888", fontSize: "13px" }}>{reviews.length} total reviews</p>
          </div>
          <button className="btn-secondary" onClick={() => navigate("/admin/dashboard")}>
            ← Dashboard
          </button>
        </div>

        {message && <div className="alert alert-success">{message}</div>}
        {error   && <div className="alert alert-error">{error}</div>}

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
          {["ALL", "VISIBLE", "HIDDEN"].map((f) => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: "6px 16px", borderRadius: "20px", fontSize: "12px",
              fontWeight: 600, cursor: "pointer", border: "none",
              background: filter === f ? "#4f46e5" : "#f1f1f1",
              color: filter === f ? "#fff" : "#555",
              transition: "all 0.15s"
            }}>{f}</button>
          ))}
        </div>

        {loading && <p style={{ color: "#888" }}>Loading reviews...</p>}

        {filtered.map((review) => (
          <div key={review.reviewId} style={{
            background: "#fff", borderRadius: "12px", padding: "16px",
            marginBottom: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            opacity: review.status === "HIDDEN" ? 0.6 : 1,
            border: review.status === "HIDDEN" ? "1.5px dashed #fca5a5" : "1px solid #eee"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontWeight: 600, fontSize: "14px" }}>
                    {review.passenger?.fullName}
                  </span>
                  <span style={{
                    fontSize: "11px", padding: "2px 8px", borderRadius: "20px",
                    background: review.status === "VISIBLE" ? "#dcfce7" : "#fee2e2",
                    color: review.status === "VISIBLE" ? "#16a34a" : "#dc2626",
                    fontWeight: 600
                  }}>{review.status}</span>
                </div>
                <p style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>
                  Driver: {review.driver?.fullName} · Ride #{review.ride?.rideId}
                </p>
              </div>
              <div>{renderStars(review.rating)}</div>
            </div>

            {review.comment && (
              <p style={{ fontSize: "13px", color: "#555", marginBottom: "12px", lineHeight: 1.6 }}>
                "{review.comment}"
              </p>
            )}

            <div style={{ display: "flex", gap: "8px" }}>
              {review.status === "VISIBLE" ? (
                <button className="btn-secondary" style={{ fontSize: "12px", padding: "6px 12px" }}
                  onClick={() => handleHide(review.reviewId)}>
                  Hide
                </button>
              ) : (
                <button className="btn-secondary" style={{ fontSize: "12px", padding: "6px 12px" }}
                  onClick={() => handleShow(review.reviewId)}>
                  Restore
                </button>
              )}
              <button className="btn-danger" style={{ fontSize: "12px", padding: "6px 12px" }}
                onClick={() => handleDelete(review.reviewId)}>
                Delete
              </button>
            </div>
          </div>
        ))}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#aaa" }}>
            <p style={{ fontSize: "36px" }}>💬</p>
            <p style={{ marginTop: "10px" }}>No reviews found.</p>
          </div>
        )}

      </div>
    </div>
  );
}
