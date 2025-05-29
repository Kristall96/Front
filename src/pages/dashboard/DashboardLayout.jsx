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
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-slate-100 to-blue-100 text-slate-800">
      {/* Sidebar */}
      <aside
        className={`relative transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        } bg-white/90 backdrop-blur-md shadow-xl border-r border-slate-200`}
      >
        {/* Toggle Button */}
        <div className="absolute top-4 right-[-14px] z-10">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-full shadow-md transition-all duration-300"
            aria-label="Toggle Sidebar"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Header */}
        <div className="px-4 py-5 border-b border-slate-200">
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
                    ? "bg-blue-100 text-blue-600 font-semibold"
                    : "text-slate-600 hover:bg-slate-100"
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
