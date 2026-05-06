import { useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function DriverRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    licenseNumber: "",
    vehicleType: "Sedan",
    vehiclePlate: "",
    userType: "DRIVER",
  });

  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    setLoading(true);
    try {
      await API.post("/drivers/register", form);
      setSuccess("Driver registered successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Driver Registration</h2>
        <p className="auth-subtitle">Join as a driver on our platform</p>

        {error   && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="fullName" value={form.fullName}
              onChange={handleChange} placeholder="John Silva" required />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={form.email}
              onChange={handleChange} placeholder="john@email.com" required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={form.password}
              onChange={handleChange} placeholder="Min. 6 characters" required />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" name="phone" value={form.phone}
              onChange={handleChange} placeholder="07X XXX XXXX" required />
          </div>

          <div className="form-group">
            <label>License Number</label>
            <input type="text" name="licenseNumber" value={form.licenseNumber}
              onChange={handleChange} placeholder="B1234567" required />
          </div>

          <div className="form-group">
            <label>Vehicle Type</label>
            <select name="vehicleType" value={form.vehicleType} onChange={handleChange}>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Van">Van</option>
              <option value="Tuk">Tuk</option>
            </select>
          </div>

          <div className="form-group">
            <label>Vehicle Plate Number</label>
            <input type="text" name="vehiclePlate" value={form.vehiclePlate}
              onChange={handleChange} placeholder="CAB-1234" required />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Registering..." : "Register as Driver"}
          </button>

        </form>

        <p className="auth-link">
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
}