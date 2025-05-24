import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CheckEmailStep from "./CheckEmailStep";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ResetPasswordForm from "./ResetPasswordForm"; // ✅ import this
import { X } from "lucide-react";

const LoginModal = ({ onClose }) => {
  const [step, setStep] = useState("check-email");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSuccess = () => {
    onClose();
    navigate("/");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative bg-neutral-900 text-white rounded-xl shadow-2xl w-full max-w-md px-6 py-8 animate-fade-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Step Forms */}
        {step === "check-email" && (
          <CheckEmailStep setStep={setStep} email={email} setEmail={setEmail} />
        )}

        {step === "login" && (
          <LoginForm
            email={email}
            onSuccess={handleSuccess}
            onSwitchToRegister={() => setStep("register")}
            onForgotPassword={() => setStep("reset-password")} // ✅ trigger reset step
          />
        )}

        {step === "register" && (
          <RegisterForm
            email={email}
            onSuccess={handleSuccess}
            onSwitchToLogin={() => setStep("login")}
          />
        )}

        {step === "reset-password" && (
          <ResetPasswordForm
            onClose={onClose} // ✅ allows auto-close after reset
          />
        )}
      </div>
    </div>
  );
};

export default LoginModal;
