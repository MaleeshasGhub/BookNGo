import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";

// C01: User Management
import Register  from "./pages/user/Register";
import Login     from "./pages/user/Login";
import Profile   from "./pages/user/Profile";

// C02: Driver Management
import DriverRegister from "./pages/driver/DriverRegister";
import DriverProfile  from "./pages/driver/DriverProfile";
import Availability   from "./pages/driver/Availability";

// C03: Ride Booking
import BookRide    from "./pages/ride/BookRide";
import TrackRide   from "./pages/ride/TrackRide";
import RideHistory from "./pages/ride/RideHistory";

// C04: Payment
import Payment            from "./pages/payment/Payment";
import PaymentHistory     from "./pages/payment/PaymentHistory";
import Invoice            from "./pages/payment/Invoice";

// C05: Admin Management
import Dashboard     from "./pages/admin/Dashboard";
import ManageUsers   from "./pages/admin/ManageUsers";
import ManageDrivers from "./pages/admin/ManageDrivers";
import MonitorRides  from "./pages/admin/MonitorRides";

// C06: Feedback & Reviews
import SubmitReview from "./pages/feedback/SubmitReview";
import ViewReviews  from "./pages/feedback/ViewReviews";
import Moderation   from "./pages/feedback/Moderation";

function App() {
  return (
    <Router>
      {/* Temporary Navigation Bar for Development */}
      <nav style={{ 
        padding: "10px", 
        background: "#222", 
        color: "white",
        display: "flex", 
        gap: "15px", 
        flexWrap: "wrap",
        fontSize: "14px",
        fontFamily: "sans-serif"
      }}>
        <Link to="/login" style={{ color: "#4db8ff" }}>Login</Link>
        <Link to="/profile" style={{ color: "#4db8ff" }}>My Profile</Link>
        <Link to="/admin/dashboard" style={{ color: "#4db8ff" }}>Admin Dashboard</Link>
        <Link to="/ride/book" style={{ color: "#4db8ff" }}>Book Ride</Link>
        <Link to="/driver/availability" style={{ color: "#4db8ff" }}>Driver Status</Link>
        <Link to="/ride/history" style={{ color: "#4db8ff" }}>Ride History</Link>
        <Link to="/feedback/moderation" style={{ color: "#4db8ff" }}>Mod Tools</Link>
      </nav>

      <Routes>
        {/* Default */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* C01: User Management */}
        <Route path="/register" element={<Register />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/profile"  element={<Profile />} />

        {/* C02: Driver Management */}
        <Route path="/driver/register"     element={<DriverRegister />} />
        <Route path="/driver/profile"      element={<DriverProfile />} />
        <Route path="/driver/availability" element={<Availability />} />

        {/* C03: Ride Booking */}
        <Route path="/ride/book"      element={<BookRide />} />
        <Route path="/ride/track/:id" element={<TrackRide />} />
        <Route path="/ride/history"   element={<RideHistory />} />

        {/* C04: Payment */}
        <Route path="/payment/:rideId"            element={<Payment />} />
        <Route path="/payment/history"            element={<PaymentHistory />} />
        <Route path="/payment/invoice/:paymentId" element={<Invoice />} />

        {/* C05: Admin Management */}
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/users"     element={<ManageUsers />} />
        <Route path="/admin/drivers"   element={<ManageDrivers />} />
        <Route path="/admin/rides"     element={<MonitorRides />} />

        {/* C06: Feedback & Reviews */}
        <Route path="/feedback/submit/:rideId"    element={<SubmitReview />} />
        <Route path="/feedback/driver/:driverId"  element={<ViewReviews />} />
        <Route path="/feedback/moderation"        element={<Moderation />} />
      </Routes>
    </Router>
  );
}

export default App;