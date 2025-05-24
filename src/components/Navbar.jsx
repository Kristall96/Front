import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginModal from "./LoginModal";
import LogoutButton from "./LogoutButton";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { user, loading } = useAuth(); // 👈 include loading
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Shop", path: "/shop" },
    { label: "Blog", path: "/blog" },
    { label: "Contact", path: "/contact" },
  ];

  if (loading) return null; // ✅ avoid flicker or false UI while checking session

  return (
    <header className="bg-black text-white shadow-md border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold tracking-tight">
          MyApp
        </Link>

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

        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <LogoutButton />
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white transition-colors"
            >
              Sign In
            </button>
          )}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-black border-t border-gray-700 px-4 pb-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="block py-2 text-white hover:text-blue-400"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {user ? (
            <LogoutButton />
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

      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </header>
  );
};

export default Navbar;
