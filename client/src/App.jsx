import Login from "./pages/login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Services from "./pages/Services";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
