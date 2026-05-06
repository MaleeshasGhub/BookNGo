import { useState, useEffect } from "react";
import API from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";

export default function Invoice() {
  const { paymentId } = useParams();
  const navigate      = useNavigate();

  const [payment, setPayment] = useState(null);
  const [error, setError]     = useState("");

  useEffect(() => {
    API.get(`/payments/${paymentId}`)
      .then((res) => setPayment(res.data))
      .catch(() => setError("Failed to load invoice."));
  }, []);

  const methodIcon = { CASH: "💵", CARD: "💳", WALLET: "👛" };

  const handlePrint = () => window.print();

  if (error)   return <div className="page-container"><div className="alert alert-error">{error}</div></div>;
  if (!payment) return <div className="page-container"><p style={{ color: "#888" }}>Loading invoice...</p></div>;

  return (
    <div className="page-container">
      <div className="profile-card" style={{ maxWidth: "480px" }}>

        {/* Invoice header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ fontSize: "48px", marginBottom: "8px" }}>🧾</div>
          <h2 style={{ color: "#16a34a" }}>Payment Successful!</h2>
          <p style={{ color: "#888", fontSize: "13px", marginTop: "4px" }}>
            Invoice #{payment.paymentId}
          </p>
        </div>

        {/* Amount */}
        <div style={{
          background: "#f0fdf4", border: "1px solid #86efac",
          borderRadius: "12px", padding: "20px", textAlign: "center", marginBottom: "24px"
        }}>
          <p style={{ fontSize: "13px", color: "#888", marginBottom: "4px" }}>Amount Paid</p>
          <p style={{ fontSize: "36px", fontWeight: 800, color: "#16a34a" }}>
            Rs. {payment.amount?.toFixed(2)}
          </p>
        </div>

        {/* Details */}
        <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "16px" }}>
          {[
            { label: "Payment ID",     value: `#${payment.paymentId}` },
            { label: "Ride ID",        value: `#${payment.ride?.rideId}` },
            { label: "From",           value: payment.ride?.pickupLocation },
            { label: "To",             value: payment.ride?.dropoffLocation },
            { label: "Ride Type",      value: payment.ride?.rideType },
            { label: "Payment Method", value: `${methodIcon[payment.method]} ${payment.method}` },
            { label: "Status",         value: payment.status },
            { label: "Paid At",        value: new Date(payment.paidAt).toLocaleString() },
          ].map(({ label, value }) => (
            <div key={label} style={{
              display: "flex", justifyContent: "space-between",
              padding: "10px 0", borderBottom: "1px solid #f9f9f9"
            }}>
              <span style={{ fontSize: "13px", color: "#888" }}>{label}</span>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#333" }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="btn-row" style={{ marginTop: "24px" }}>
          <button className="btn-primary" onClick={handlePrint}>
            🖨️ Print Receipt
          </button>
          <button className="btn-secondary" onClick={() => navigate("/payment/history")}>
            Payment History
          </button>
        </div>

        <div style={{ marginTop: "12px" }}>
          <button className="btn-secondary" style={{ width: "100%" }}
            onClick={() => navigate("/ride/book")}>
            Book Another Ride
          </button>
        </div>

      </div>
    </div>
  );
}