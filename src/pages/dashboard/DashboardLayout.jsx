import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react"; // or any icon library

const DashboardLayout = ({ children, activeTab, setActiveTab }) => {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const uniqueLinks = {
    admin: [
      { key: "profile", label: "My Profile" },
      { key: "orders", label: "My Orders" },
      { key: "wishlist", label: "Wishlist" },
      { key: "overview", label: "Overview" },
      { key: "products", label: "Products" },
      { key: "users", label: "Manage Users" },
    ],
    moderator: [
      { key: "profile", label: "My Profile" },
      { key: "orders", label: "My Orders" },
      { key: "wishlist", label: "Wishlist" },
      { key: "panel", label: "Moderation Panel" },
      { key: "complaints", label: "Complaints" },
    ],
    user: [
      { key: "profile", label: "My Profile" },
      { key: "orders", label: "My Orders" },
      { key: "wishlist", label: "Wishlist" },
    ],
  };

  const roleLinks = uniqueLinks[user?.role] || [];

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <aside
        className={`${
          collapsed ? "w-20" : "w-64"
        } bg-white shadow-md p-4 transition-all duration-300 flex flex-col justify-between`}
      >
        <div>
          <h2
            className={`text-xl font-bold mb-6 transition-opacity duration-200 ${
              collapsed ? "opacity-0 hidden" : "opacity-100"
            }`}
          >
            Dashboard
          </h2>
          <nav className="flex flex-col space-y-3">
            {roleLinks.map((link) => (
              <button
                key={link.key}
                onClick={() => setActiveTab(link.key)}
                className={`text-left font-medium transition-colors ${
                  activeTab === link.key
                    ? "text-blue-600 font-semibold"
                    : "hover:text-blue-600"
                }`}
              >
                {collapsed ? (
                  <div className="w-full h-6 rounded bg-gray-200 animate-pulse"></div>
                ) : (
                  link.label
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Collapse/Expand Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mt-6 text-gray-500 hover:text-blue-600 transition"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 sm:p-8">{children}</main>
    </div>
  );
};

export default DashboardLayout;
