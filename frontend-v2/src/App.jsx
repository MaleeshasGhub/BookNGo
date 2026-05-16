import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './index.css';
import Layout from "./components/Layout";
import PremiumButton from "./components/PremiumButton";
import InputField from "./components/InputField";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import DriverRegister from "./pages/auth/DriverRegister";
import PassengerProfile from "./pages/dashboard/PassengerProfile";
import DriverDashboard from "./pages/dashboard/DriverDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import BookRide from "./pages/ride/BookRide";
import TrackRide from "./pages/ride/TrackRide";
import Payment from "./pages/payment/Payment";
import SubmitReview from "./pages/feedback/SubmitReview";
import ViewReviews from "./pages/feedback/ViewReviews";
import Moderation from "./pages/feedback/Moderation";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageDrivers from "./pages/admin/ManageDrivers";
import MonitorRides from "./pages/admin/MonitorRides";
import PaymentHistory from "./pages/payment/PaymentHistory";
import Invoice from "./pages/payment/Invoice";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Toaster position="top-center" toastOptions={{ 
            style: { background: 'var(--bg-panel-light)', color: 'var(--text-main)', border: '1px solid rgba(255,255,255,0.1)' } 
          }} />
          <Routes>
            <Route path="/" element={
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                textAlign: 'center',
                marginTop: '4rem'
              }}>
                <h1 style={{ 
                  fontSize: '3.5rem', 
                  background: 'var(--gradient-primary)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '1rem'
                }}>
                  BookNGo UI Kit
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '3rem', maxWidth: '600px' }}>
                  Phase 2 is complete! Here is a preview of our new, highly reusable, and beautiful UI components that will power the rest of the application.
                </p>

                <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '500px' }}>
                  <h3 style={{ marginBottom: '1.5rem', textAlign: 'left' }}>Component Preview</h3>
                  
                  <InputField 
                    label="Email Address" 
                    placeholder="name@example.com"
                    type="email"
                  />
                  
                  <InputField 
                    label="Password" 
                    placeholder="Enter your password"
                    type="password"
                  />

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                    <PremiumButton variant="primary" style={{ flex: 1 }}>
                      Primary Action
                    </PremiumButton>
                    <PremiumButton variant="secondary" style={{ flex: 1 }}>
                      Secondary Action
                    </PremiumButton>
                  </div>
                </div>
              </div>
            } />
            
            {/* Public Routes (Only for non-logged in users) */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/driver-register" element={<DriverRegister />} />
            </Route>

            {/* Protected Passenger Routes */}
            <Route element={<PrivateRoute allowedRoles={['PASSENGER', 'ADMIN']} />}>
              <Route path="/profile" element={<PassengerProfile />} />
              <Route path="/book" element={<BookRide />} />
              <Route path="/track" element={<TrackRide />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/submit-review" element={<SubmitReview />} />
              <Route path="/payment-history" element={<PaymentHistory />} />
              <Route path="/invoice" element={<Invoice />} />
            </Route>

            {/* Protected Driver Routes */}
            <Route element={<PrivateRoute allowedRoles={['DRIVER', 'ADMIN']} />}>
              <Route path="/driver" element={<DriverDashboard />} />
            </Route>

            {/* Protected Admin Routes */}
            <Route element={<PrivateRoute allowedRoles={['ADMIN']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/moderation" element={<Moderation />} />
              <Route path="/manage-users" element={<ManageUsers />} />
              <Route path="/manage-drivers" element={<ManageDrivers />} />
              <Route path="/monitor-rides" element={<MonitorRides />} />
            </Route>

            {/* Public or shared routes */}
            <Route path="/view-reviews" element={<ViewReviews />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
