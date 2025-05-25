// src/components/Navbar.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginModal from "./LoginModal";
import LogoutButton from "./LogoutButton";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { user, loading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Shop", path: "/shop" },
    { label: "Blog", path: "/blog" },
    { label: "Contact", path: "/contact" },
  ];

  // 🔁 Resolve user dashboard route based on role
  const getDashboardPath = () => {
    if (!user) return "/";
    switch (user.role) {
      case "admin":
        return "/dashboard/admin";
      case "moderator":
        return "/dashboard/moderator";
      default:
        return "/dashboard/user";
    }
  };

  if (loading) return null;

  return (
    <header className="bg-black text-white shadow-md border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-tight">
          MyApp
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex justify-center flex-1 relative">
          <nav className="absolute left-1/2 -translate-x-1/2 flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="hover:text-blue-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Auth Buttons (Desktop) */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <Link
                to={getDashboardPath()}
                className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded transition-colors"
              >
                Dashboard
              </Link>
              <LogoutButton />
            </>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white transition-colors"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-black border-t border-gray-700 px-4 pb-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className="block py-2 text-white hover:text-blue-400"
            >
              {link.label}
            </Link>
          ))}

          {user ? (
            <>
              <Link
                to={getDashboardPath()}
                onClick={() => setMenuOpen(false)}
                className="block py-2 text-white hover:text-blue-400"
              >
                Dashboard
              </Link>
              <LogoutButton />
            </>
          ) : (
            <button
              onClick={() => {
                setShowLoginModal(true);
                setMenuOpen(false);
              }}
              className="mt-2 w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </header>
  );
};

export default Navbar;
