import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const DashboardLayout = ({ children }) => {
  const { user } = useAuth();

  const links = {
    admin: [
      { to: "/dashboard/admin", label: "Overview" },
      { to: "/dashboard/admin/users", label: "Manage Users" },
      { to: "/dashboard/admin/orders", label: "Orders" },
    ],
    moderator: [
      { to: "/dashboard/moderator", label: "Moderation Panel" },
      { to: "/dashboard/moderator/complaints", label: "Complaints" },
    ],
    user: [
      { to: "/dashboard/user", label: "My Profile" },
      { to: "/dashboard/user/orders", label: "My Orders" },
      { to: "/dashboard/user/wishlist", label: "Wishlist" },
    ],
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      <aside className="w-64 bg-white shadow-md p-4">
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>
        <nav className="flex flex-col space-y-3">
          {(links[user.role] || []).map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="hover:text-blue-600 font-medium"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
};

export default DashboardLayout;
