import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { LayoutDashboard, ChevronLeft, ChevronRight } from "lucide-react";

const DashboardLayout = ({ children, activeTab, setActiveTab }) => {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = {
    admin: [
      {
        key: "profile",
        label: "My Profile",
        icon: <LayoutDashboard size={18} />,
      },
      {
        key: "orders",
        label: "My Orders",
        icon: <LayoutDashboard size={18} />,
      },
      {
        key: "wishlist",
        label: "Wishlist",
        icon: <LayoutDashboard size={18} />,
      },
      {
        key: "overview",
        label: "Overview",
        icon: <LayoutDashboard size={18} />,
      },
      {
        key: "products",
        label: "Products",
        icon: <LayoutDashboard size={18} />,
      },
      {
        key: "users",
        label: "Manage Users",
        icon: <LayoutDashboard size={18} />,
      },
    ],
    moderator: [
      {
        key: "profile",
        label: "My Profile",
        icon: <LayoutDashboard size={18} />,
      },
      {
        key: "orders",
        label: "My Orders",
        icon: <LayoutDashboard size={18} />,
      },
      {
        key: "wishlist",
        label: "Wishlist",
        icon: <LayoutDashboard size={18} />,
      },
      {
        key: "panel",
        label: "Moderation Panel",
        icon: <LayoutDashboard size={18} />,
      },
      {
        key: "complaints",
        label: "Complaints",
        icon: <LayoutDashboard size={18} />,
      },
    ],
    user: [
      {
        key: "profile",
        label: "My Profile",
        icon: <LayoutDashboard size={18} />,
      },
      {
        key: "orders",
        label: "My Orders",
        icon: <LayoutDashboard size={18} />,
      },
      {
        key: "wishlist",
        label: "Wishlist",
        icon: <LayoutDashboard size={18} />,
      },
    ],
  };

  const links = navItems[user?.role] || [];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 text-gray-800">
      {/* Sidebar */}
      <aside
        className={`${
          collapsed ? "w-20" : "w-64"
        } relative transition-all duration-300 bg-white shadow-xl border-r border-gray-200`}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h2
            className={`text-xl font-bold text-gray-800 transition-all duration-200 ${
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

        {/* Navigation */}
        <nav className="mt-4 space-y-1 px-2">
          {links.map((link) => (
            <button
              key={link.key}
              onClick={() => setActiveTab(link.key)}
              className={`flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${
                  activeTab === link.key
                    ? "bg-blue-100 text-blue-600 font-semibold"
                    : "text-gray-600 hover:bg-gray-100"
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
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  );
};

export default DashboardLayout;
