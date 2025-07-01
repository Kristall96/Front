import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import secureAxios from "../../utils/secureAxios";
import DashboardLayout from "./DashboardLayout";
import Navbar from "../../components/Navbar";

import ProfileSection from "./sections/ProfileSection";
import UserManagement from "./sections/UserManagement";
import ProductManagement from "./sections/ProductManagement1";
import ProductManagementSystem from "./sections/ProductManagementSystem";
import BlogManagement from "./sections/BlogManagement";
import BlogEditor from "../admin/blog/RichTextEditor";
import InvoiceRoutes from "../admin/invoice";
import ComplaintsPage from "../admin/complaint/ComplaintPage"; // <-- updated import (filename case)
import ComplaintDetail from "../admin/complaint/ComplaintDetail";

const AdminDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [adminStats, setAdminStats] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get("tab") || "profile";
  const complaintId = searchParams.get("complaintId");
  const complaintView = searchParams.get("view") || "all"; // NEW

  const setActiveTab = (tab, extraParams = {}) => {
    // Supports additional params (like view, complaintId)
    setSearchParams({ tab, ...extraParams });
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
        return <BlogEditor />;
      case "invoices":
        return <InvoiceRoutes />;
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
      case "complaints":
        return (
          <ComplaintsPage
            view={complaintView}
            setView={(view) => setActiveTab("complaints", { view })}
          />
        );
      case "complaints-detail":
        return (
          <ComplaintDetail
            id={complaintId}
            goBack={() => setActiveTab("complaints")}
          />
        );
      default:
        return <p className="text-sm text-red-500">⚠ Unknown section</p>;
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 min-h-0">
        <DashboardLayout
          activeTab={activeTab.split("-")[0]}
          setActiveTab={(tab) => setActiveTab(tab)}
        >
          <div className="flex-1 flex flex-col bg-[#0f172a] text-white p-6 overflow-hidden">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <div className="flex-1 min-h-0 overflow-hidden">
              {renderSection()}
            </div>
          </div>
        </DashboardLayout>
      </div>
    </div>
  );
};

export default AdminDashboard;
