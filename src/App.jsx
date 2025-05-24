// src/App.jsx
import { useAuth } from "./context/AuthContext";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import BlogPage from "./pages/BlogPage";
import ContactPage from "./pages/ContactPage";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";

function App() {
  const { loading, isAuthenticated } = useAuth();

  // Wait until refresh check completes to prevent flicker or false redirects
  if (loading)
    return <div className="p-10 text-center">Loading session...</div>;

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Route Example */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />
          }
        />

        {/* Catch-all 404 */}
        <Route
          path="*"
          element={<div className="p-10 text-center">404 - Page Not Found</div>}
        />
      </Routes>
    </>
  );
}

export default App;
