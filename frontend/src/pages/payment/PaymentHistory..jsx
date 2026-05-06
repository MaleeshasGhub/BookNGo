import { useState, useEffect } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function PaymentHistory() {
  const navigate = useNavigate();
  const user     = JSON.parse(localStorage.getItem("user"));

  const [payments, setPayments] = useState([]);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(true);

  const methodIcon = { CASH: "💵", CARD: "💳", WALLET: "👛" };
  const statusColor = {
    COMPLETED: { bg: "#dcfce7", text: "#16a34a" },
    PENDING:   { bg: "#fef9c3", text: "#854d0e" },
    FAILED:    { bg: "#fee2e2", text: "#dc2626" },
  };

  useEffect(() => {
    if (!user) { navigate("/login"); return; }

    API.get(`/payments/passenger/${user.userId}`)
      .then((res) => setPayments(res.data))
      .catch(() => setError("Failed to load payment history."))
      .finally(() => setLoading(false));
  }, []);

  const totalSpent = payments
    .filter((p) => p.status === "COMPLETED")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="page-container">
      <div className="profile-card" style={{ maxWidth: "640px" }}>

        <h2 style={{ marginBottom: "6px" }}>Payment History</h2>
        <p style={{ color: "#888", marginBottom: "20px", fontSize: "14px" }}>
          All your transactions
        </p>

        {/* Total spent summary */}
        {payments.length > 0 && (
          <div style={{
            background: "#f0f4ff", borderRadius: "12px",
            padding: "16px", marginBottom: "24px",
            display: "flex", justifyContent: "space-between", alignItems: "center"
          }}>
            <div>
              <p style={{ fontSize: "12px", color: "#888" }}>Total Spent</p>
              <p style={{ fontSize: "24px", fontWeight: 700, color: "#4f46e5" }}>
                Rs. {totalSpent.toFixed(2)}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "12px", color: "#888" }}>Transactions</p>
              <p style={{ fontSize: "24px", fontWeight: 700, color: "#333" }}>
                {payments.length}
              </p>
            </div>
          </div>
        )}

        {error   && <div className="alert alert-error">{error}</div>}
        {loading && <p style={{ color: "#888" }}>Loading...</p>}

        {!loading && payments.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#aaa" }}>
            <p style={{ fontSize: "40px" }}>💳</p>
            <p style={{ marginTop: "12px" }}>No payments yet.</p>
          </div>
        )}

        {payments.map((payment) => (
          <div
            key={payment.paymentId}
            onClick={() => navigate(`/payment/invoice/${payment.paymentId}`)}
            style={{
              border: "1px solid #eee", borderRadius: "12px",
              padding: "16px", marginBottom: "12px", cursor: "pointer",
              transition: "box-shadow 0.15s"
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "20px" }}>{methodIcon[payment.method]}</span>
                <span style={{ fontWeight: 700 }}>Payment #{payment.paymentId}</span>
              </div>
              <span style={{
                background: statusColor[payment.status]?.bg,
                color: statusColor[payment.status]?.text,
                padding: "3px 10px", borderRadius: "20px",
                fontSize: "12px", fontWeight: 600
              }}>
                {payment.status}
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontSize: "13px", color: "#888" }}>
                Ride #{payment.ride?.rideId} · {payment.method}
              </p>
              <p style={{ fontWeight: 700, fontSize: "16px", color: "#4f46e5" }}>
                Rs. {payment.amount?.toFixed(2)}
              </p>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}