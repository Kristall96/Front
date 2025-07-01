// src/App.jsx
import { Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Public Pages
import HomePage from "./pages/HomePage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import SingleProductPage from "./pages/SingleProductPage";
import Unauthorized from "./pages/Unauthorized";

// Dashboard Pages
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import ModeratorDashboard from "./pages/dashboard/ModeratorDashboard";
import UserDashboard from "./pages/dashboard/UserDashboard";

// Complaint Pages
import ComplaintList from "./pages/admin/complaint/ComplaintList";
import ComplaintDetail from "./pages/admin/complaint/ComplaintDetail";

// Invoice Routes
import InvoiceRoutes from "./pages/admin/invoice/index";

// Role-Based Route Wrapper
import RoleRoute from "./components/RoleRoute";

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <div className="p-10 text-center">Checking session...</div>;
  }

  return (
    <div>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/reset-password/confirm" element={<ResetPasswordPage />} />
        <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/product/:slug" element={<SingleProductPage />} />

        {/* Complaint Routes for Admin/Moderator */}
        <Route
          path="/dashboard/admin/complaints"
          element={
            <RoleRoute allowedRoles={["moderator", "admin"]}>
              <ComplaintList />
            </RoleRoute>
          }
        />
        <Route
          path="/dashboard/admin/complaints/:id"
          element={
            <RoleRoute allowedRoles={["moderator", "admin"]}>
              <ComplaintDetail />
            </RoleRoute>
          }
        />

        {/* Invoice Routes (admin only) */}
        <Route
          path="/dashboard/admin/invoice/*"
          element={
            <RoleRoute allowedRoles={["admin"]}>
              <InvoiceRoutes />
            </RoleRoute>
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/dashboard/admin/*"
          element={
            <RoleRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </RoleRoute>
          }
        />

        {/* Moderator Dashboard */}
        <Route
          path="/dashboard/moderator/*"
          element={
            <RoleRoute allowedRoles={["moderator", "admin"]}>
              <ModeratorDashboard />
            </RoleRoute>
          }
        />

        {/* User Dashboard */}
        <Route
          path="/dashboard/user/*"
          element={
            <RoleRoute allowedRoles={["user", "moderator", "admin"]}>
              <UserDashboard />
            </RoleRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
