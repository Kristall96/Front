import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 import navigate
import CheckEmailStep from "./CheckEmailStep";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const LoginModal = ({ onClose }) => {
  const [step, setStep] = useState("check-email");
  const [email, setEmail] = useState("");
  const navigate = useNavigate(); // 👈 hook to programmatically redirect

  const handleSuccess = () => {
    onClose(); // ✅ close modal
    navigate("/"); // ✅ redirect to homepage (or dashboard)
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <button className="float-right" onClick={onClose}>
          ✕
        </button>
        {step === "check-email" && (
          <CheckEmailStep setStep={setStep} email={email} setEmail={setEmail} />
        )}
        {step === "login" && (
          <LoginForm
            email={email}
            onSuccess={handleSuccess} // ✅ pass redirect+close
            onSwitchToRegister={() => setStep("register")}
          />
        )}
        {step === "register" && (
          <RegisterForm
            email={email}
            onSuccess={handleSuccess} // ✅ optional: auto-close after register
            onSwitchToLogin={() => setStep("login")}
          />
        )}
      </div>
    </div>
  );
};

export default LoginModal;
