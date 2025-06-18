// pages/dashboard/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import secureAxios from "../../utils/secureAxios";
import DashboardLayout from "./DashboardLayout";
import Navbar from "../../components/Navbar";

// Sections
import ProfileSection from "./sections/ProfileSection";
import UserManagement from "./sections/UserManagement";
import ProductManagement from "./sections/ProductManagement1";
import ProductManagementSystem from "./sections/ProductManagementSystem";
import BlogManagement from "./sections/BlogManagement";
import BlogEditor from "../admin/blog/Editor"; // ✅ Correct path relative to AdminDashboard.jsx

const AdminDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [adminStats, setAdminStats] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get("tab") || "profile";

  const setActiveTab = (tab) => {
    setSearchParams({ tab });
  };

  const fetchUser = async () => {
    try {
      const res = await secureAxios.get("/users/me");
      setUserData(res.data);
    } catch (err) {
      console.error("Failed to load profile:", err.response?.data?.message);
    }
  };

  const fetchAdminStats = async () => {
    try {
      const res = await secureAxios.get("/dashboard/admin");
      setAdminStats(res.data);
    } catch (err) {
      console.error("Failed to load admin stats:", err.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchAdminStats();
  }, []);

  const renderSection = () => {
    if (!userData) return <p>Loading profile...</p>;

    switch (activeTab) {
      case "profile":
        return <ProfileSection user={userData} refreshUser={fetchUser} />;
      case "orders":
        return (
          <p className="text-sm text-gray-600">📦 Orders coming soon...</p>
        );
      case "wishlist":
        return (
          <p className="text-sm text-gray-600">💖 Wishlist coming soon...</p>
        );
      case "users":
        return <UserManagement />;
      case "products":
        return <ProductManagement />;
      case "products-management":
        return <ProductManagementSystem />;
      case "blog":
        return <BlogManagement />;
      case "blog-editor":
        return <BlogEditor />; // ✅ handle ?tab=blog-editor
      case "overview":
        return adminStats ? (
          <div className="bg-white p-4 rounded shadow">
            <p>{adminStats.message}</p>
            <pre className="mt-4 text-sm bg-gray-100 p-4 rounded">
              {JSON.stringify(adminStats.stats, null, 2)}
            </pre>
          </div>
        ) : (
          <p>Loading admin stats...</p>
        );
      default:
        return <p className="text-sm text-red-500">⚠ Unknown section</p>;
    }
  };

  return (
    <>
      <Navbar />
      <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
        <div className="min-h-screen bg-[#0f172a] text-white p-6">
          <h1 className="text-3xl font-bold mb-6 text-white">
            Admin Dashboard
          </h1>
          {renderSection()}
        </div>
      </DashboardLayout>
    </>
  );
};

export default AdminDashboard;
