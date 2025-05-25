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
        setTimeout(() => navigate("/"), 2500);
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
    <div className="min-h-screen flex items-center justify-center bg-black text-white font-sans px-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-teal-400">
          {status}
        </h2>
        {error ? (
          <p className="text-red-400">{error}</p>
        ) : (
          <p className="text-zinc-300">
            You will be redirected to the login page shortly...
          </p>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
