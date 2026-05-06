import { useState, useEffect } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const user     = JSON.parse(localStorage.getItem("user"));

  const [stats, setStats]   = useState(null);
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.userType !== "ADMIN") { navigate("/login"); return; }

    API.get("/admin/dashboard")
      .then((res) => setStats(res.data))
      .catch(() => setError("Failed to load dashboard stats."))
      .finally(() => setLoading(false));
  }, []);

  const cards = stats ? [
    { label: "Total Users",     value: stats.totalUsers,     icon: "👤", color: "#4f46e5", bg: "#ede9fe" },
    { label: "Total Drivers",   value: stats.totalDrivers,   icon: "🚗", color: "#0891b2", bg: "#cffafe" },
    { label: "Total Rides",     value: stats.totalRides,     icon: "🛣️",  color: "#16a34a", bg: "#dcfce7" },
    { label: "Pending Rides",   value: stats.pendingRides,   icon: "⏳", color: "#d97706", bg: "#fef9c3" },
    { label: "Completed Rides", value: stats.completedRides, icon: "✅", color: "#15803d", bg: "#f0fdf4" },
    { label: "Total Revenue",   value: `Rs. ${Number(stats.totalRevenue).toFixed(2)}`,
      icon: "💰", color: "#b45309", bg: "#fef3c7" },
  ] : [];

  const navItems = [
    { label: "Manage Users",   icon: "👥", path: "/admin/users" },
    { label: "Manage Drivers", icon: "🚕", path: "/admin/drivers" },
    { label: "Monitor Rides",  icon: "🗺️",  path: "/admin/rides" },
  ];

  return (
    <div className="page-container">
      <div style={{ width: "100%", maxWidth: "800px" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
          <div>
            <h2 style={{ fontSize: "22px", fontWeight: 700 }}>Admin Dashboard</h2>
            <p style={{ color: "#888", fontSize: "13px", marginTop: "2px" }}>
              Welcome, {user?.fullName}
            </p>
          </div>
          <button className="btn-secondary" onClick={() => {
            localStorage.removeItem("user"); navigate("/login");
          }}>Logout</button>
        </div>

        {error   && <div className="alert alert-error">{error}</div>}
        {loading && <p style={{ color: "#888" }}>Loading stats...</p>}

        {/* Stats grid */}
        {stats && (
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px", marginBottom: "32px"
          }}>
            {cards.map(({ label, value, icon, color, bg }) => (
              <div key={label} style={{
                background: "#fff", borderRadius: "14px",
                padding: "20px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)"
              }}>
                <div style={{
                  width: "42px", height: "42px", borderRadius: "10px",
                  background: bg, display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: "20px", marginBottom: "12px"
                }}>{icon}</div>
                <p style={{ fontSize: "22px", fontWeight: 800, color }}>{value}</p>
                <p style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}>{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Navigation panels */}
        <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "14px", color: "#444" }}>
          Management Panels
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {navItems.map(({ label, icon, path }) => (
            <div
              key={path}
              onClick={() => navigate(path)}
              style={{
                background: "#fff", borderRadius: "12px", padding: "18px 20px",
                display: "flex", alignItems: "center", gap: "14px",
                cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                transition: "box-shadow 0.15s"
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)"}
            >
              <span style={{ fontSize: "24px" }}>{icon}</span>
              <span style={{ fontWeight: 600, fontSize: "15px" }}>{label}</span>
              <span style={{ marginLeft: "auto", color: "#aaa" }}>→</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}