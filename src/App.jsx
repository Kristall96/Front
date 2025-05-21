// ✅ Updated App.jsx with HomePage Component

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import RequestPasswordResetPage from "./pages/RequestPasswordResetPage";
import HomePage from "./pages/HomePage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
function App() {
  return (
    <Router>
      <div className="p-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/reset-password"
            element={<RequestPasswordResetPage />}
          />
          <Route
            path="/reset-password/confirm"
            element={<ResetPasswordPage />}
          />
          <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
