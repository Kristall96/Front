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
  LayoutDashboard,
  Pencil,
  FileText,
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
      {
        key: "products-management",
        label: "Products Management",
        icon: <Package size={18} />,
      },
      { key: "users", label: "Manage Users", icon: <Users size={18} /> },
      { key: "blog", label: "Blog Management", icon: <Pencil size={18} /> },
      { key: "invoices", label: "Invoices", icon: <FileText size={18} /> },
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
    <div className="flex min-h-screen bg-[#0f172a] text-white">
      {/* Sidebar */}
      <aside
        className={`relative transition-all duration-300 ease-in-out flex flex-col ${
          collapsed ? "w-[80px]" : "w-64"
        } bg-[#0f172a] border-r border-gray-800`}
      >
        {/* Toggle */}
        <div className="absolute top-5 right-[-12px] z-30">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-full ring-1 ring-slate-600 hover:ring-blue-400 transition-all"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Sidebar Header */}
        <div className="px-4 py-5 border-b border-slate-700 flex items-center space-x-2">
          <LayoutDashboard size={20} className="text-slate-300" />
          <h2
            className={`text-xl font-bold transition-all origin-left ${
              collapsed ? "opacity-0 scale-90 w-0" : "opacity-100 scale-100"
            }`}
          >
            Dashboard
          </h2>
        </div>

        {/* Nav Items */}
        <nav className="mt-4 space-y-1 px-2">
          {links.map((link) => (
            <button
              key={link.key}
              onClick={() => setActiveTab(link.key)}
              className={`flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium ${
                activeTab === link.key
                  ? "bg-slate-800 text-white font-semibold"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span className="mr-3">{link.icon}</span>
              <span
                className={`transition-all duration-300 origin-left ${
                  collapsed ? "opacity-0 scale-90 w-0" : "opacity-100 scale-100"
                }`}
              >
                {link.label}
              </span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto bg-[#0f172a]">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
