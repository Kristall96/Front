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
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 via-slate-100 to-gray-50 text-slate-800">
      {/* Sidebar */}
      <aside
        className={`relative transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        } bg-gray-900 text-slate-100 shadow-xl`}
      >
        {/* Toggle Button */}
        <div className="absolute top-4 right-[-14px] z-10">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="bg-slate-700 hover:bg-slate-600 text-white p-1.5 rounded-full shadow-lg ring-1 ring-slate-500 hover:ring-blue-500 transition-all duration-300"
            aria-label="Toggle Sidebar"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Header */}
        <div className="px-4 py-5 border-b border-slate-600">
          <h2
            className={`text-xl font-bold transition-opacity duration-200 ${
              collapsed ? "opacity-0 hidden" : "opacity-100"
            }`}
          >
            Dashboard
          </h2>
        </div>

        {/* Nav Links */}
        <nav className="mt-4 space-y-1 px-2">
          {links.map((link) => (
            <button
              key={link.key}
              onClick={() => setActiveTab(link.key)}
              className={`flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${
                  activeTab === link.key
                    ? "bg-slate-800 text-white font-semibold"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
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
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto bg-gradient-to-br from-white to-slate-50">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
