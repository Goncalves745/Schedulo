import Login from "./pages/login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/register";
import Services from "./pages/Services";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Appointments from "./pages/Booking";
import AppointmentConfirmation from "./pages/AppointmentConfirmation";
import "./index.css";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/business/services"
          element={
            <ProtectedRoute>
              <Services />
            </ProtectedRoute>
          }
        />
        <Route path="/booking/:slug" element={<Appointments />} />
        <Route path="/appointments/:id" element={<AppointmentConfirmation />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
