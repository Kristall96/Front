// pages/VerifyEmailPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/secureAxios";

const VerifyEmailPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Verifying email...");
  const [error, setError] = useState(null);

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get(`/auth/verify-email/${token}`);
        setStatus(res.data.message || "Email verified successfully.");

        // Redirect to login after short delay
        setTimeout(() => navigate("/login"), 2500);
      } catch (err) {
        const msg =
          err.response?.data?.message || err.message || "Verification failed.";
        setError(msg);
        setStatus("Email verification failed.");
      }
    };

    verify();
  }, [token, navigate]);

  return (
    <div style={{ padding: "1rem" }}>
      <h2>{status}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!error && <p>You will be redirected to the login page shortly...</p>}
    </div>
  );
};

export default VerifyEmailPage;
