// src/App.jsx
import { Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Pages
import HomePage from "./pages/HomePage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <div className="p-10 text-center">Checking session...</div>; // prevents early render
  }

  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/reset-password/confirm" element={<ResetPasswordPage />} />
        <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
      </Routes>
    </div>
  );
}

export default App;
