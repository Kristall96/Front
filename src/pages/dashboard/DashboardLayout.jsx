import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import {
  User,
  ShoppingCart,
  Heart,
  BarChart,
  Package,
  Users,
  ShieldCheck,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const DashboardLayout = ({ children, activeTab, setActiveTab }) => {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  // Define role-based links with unique icons
  const navItems = {
    admin: [
      { key: "profile", label: "My Profile", icon: <User size={18} /> },
      { key: "orders", label: "My Orders", icon: <ShoppingCart size={18} /> },
      { key: "wishlist", label: "Wishlist", icon: <Heart size={18} /> },
      { key: "overview", label: "Overview", icon: <BarChart size={18} /> },
      { key: "products", label: "Products", icon: <Package size={18} /> },
      { key: "users", label: "Manage Users", icon: <Users size={18} /> },
    ],
    moderator: [
      { key: "profile", label: "My Profile", icon: <User size={18} /> },
      { key: "orders", label: "My Orders", icon: <ShoppingCart size={18} /> },
      { key: "wishlist", label: "Wishlist", icon: <Heart size={18} /> },
      {
        key: "panel",
        label: "Moderation Panel",
        icon: <ShieldCheck size={18} />,
      },
      {
        key: "complaints",
        label: "Complaints",
        icon: <AlertCircle size={18} />,
      },
    ],
    user: [
      { key: "profile", label: "My Profile", icon: <User size={18} /> },
      { key: "orders", label: "My Orders", icon: <ShoppingCart size={18} /> },
      { key: "wishlist", label: "Wishlist", icon: <Heart size={18} /> },
    ],
  };

  const links = navItems[user?.role] || [];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-white to-slate-100 text-slate-700">
      {/* Sidebar */}
      <aside
        className={`${
          collapsed ? "w-20" : "w-64"
        } relative transition-all duration-300 bg-white shadow-lg border-r border-gray-200`}
      >
        {/* Top bar with toggle */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h2
            className={`text-xl font-bold transition-opacity duration-200 ${
              collapsed ? "opacity-0 hidden" : "opacity-100"
            }`}
          >
            Dashboard
          </h2>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded hover:bg-gray-100 transition"
            aria-label="Toggle Sidebar"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="mt-4 space-y-1 px-2">
          {links.map((link) => (
            <button
              key={link.key}
              onClick={() => setActiveTab(link.key)}
              className={`flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${
                  activeTab === link.key
                    ? "bg-blue-100 text-blue-600 font-semibold"
                    : "text-slate-600 hover:bg-gray-100"
                }`}
            >
              <span className="mr-3">{link.icon}</span>
              <span className={`${collapsed ? "hidden" : "block"}`}>
                {link.label}
              </span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto">{children}</main>
    </div>
  );
};

export default DashboardLayout;
