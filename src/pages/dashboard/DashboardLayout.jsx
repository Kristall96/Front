import { useAuth } from "../../context/AuthContext";

const DashboardLayout = ({ children, activeTab, setActiveTab }) => {
  const { user } = useAuth();

  const links = {
    admin: [
      { key: "profile", label: "My Profile" },
      { key: "orders", label: "My Orders" },
      { key: "wishlist", label: "Wishlist" },
      { key: "overview", label: "Overview" },
      { key: "products", label: "Products" },
      { key: "users", label: "Manage Users" },
      { key: "orders", label: "Orders" },
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
      { key: "profile", label: "My Profile" },
      { key: "orders", label: "My Orders" },
      { key: "wishlist", label: "Wishlist" },
    ],
  };

  const roleLinks = links[user?.role] || [];

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      <aside className="w-64 bg-white shadow-md p-4">
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>
        <nav className="flex flex-col space-y-3">
          {roleLinks.map((link) => (
            <button
              key={link.key}
              onClick={() => setActiveTab(link.key)}
              className={`text-left font-medium hover:text-blue-600 ${
                activeTab === link.key ? "text-blue-600 font-semibold" : ""
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
};

export default DashboardLayout;
