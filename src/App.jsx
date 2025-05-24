// ✅ Updated App.jsx with HomePage Component

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import HomePage from "./pages/HomePage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />

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
