import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register    from "./pages/user/Register";
import Login       from "./pages/user/Login";
import Profile     from "./pages/user/Profile";

// Other components will be added here as we build each component
// import BookRide from "./pages/ride/BookRide";
// import Dashboard from "./pages/admin/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route → Login */}
        <Route path="/"          element={<Navigate to="/login" />} />

        {/* C01: User Management */}
        <Route path="/register"  element={<Register />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/profile"   element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;