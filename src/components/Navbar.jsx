// src/components/Navbar.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import LoginModal from "./LoginModal";
import LogoutButton from "./LogoutButton";

const Navbar = () => {
  const { user } = useAuth(); // 👈 get logged-in user from context
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <header className="bg-white border-b shadow-sm p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-800">My App</h1>

      <div>
        {user ? (
          <LogoutButton />
        ) : (
          <button
            onClick={() => setShowLoginModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Sign In
          </button>
        )}
      </div>

      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </header>
  );
};

export default Navbar;
