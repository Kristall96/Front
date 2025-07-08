import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import secureAxios from "../../utils/secureAxios";
import DashboardLayout from "./DashboardLayout";
import Navbar from "../../components/Navbar";

// Admin sections (lazy load if needed)
import ProfileSection from "./sections/ProfileSection";
import UserManagement from "./sections/UserManagement";
import ProductManagement from "./sections/ProductManagement1";
import ProductManagementSystem from "./sections/ProductManagementSystem";
import BlogManagement from "./sections/BlogManagement";
import BlogEditor from "../admin/blog/RichTextEditor";
import InvoiceRoutes from "../admin/invoice";
import ComplaintDashboard from "../admin/complaint/ComplaintDashboard";
import ComplaintDetail from "../admin/complaint/ComplaintDetail";
import ToDoDashboard from "../admin/todo/ToDoDashboard"; // <-- Import ToDo
import CalendarDashboard from "../admin/calendar/CalendarDashboard";
import EmailMarketingDashboard from "../admin/emailMarketing/EmailMarketingDashboard"; // <-- Import
import ChatDashboard from "../admin/chat/ChatDashboard";

const AdminDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [adminStats, setAdminStats] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get("tab") || "profile";
  const complaintId = searchParams.get("complaintId");

  // Fetch user profile (for profile tab and ToDos)
  const fetchUser = useCallback(async () => {
    try {
      const res = await secureAxios.get("/users/me");
      setUserData(res.data);
    } catch {
      setUserData(null);
    }
  }, []);

  // Fetch stats (admin overview)
  const fetchAdminStats = useCallback(async () => {
    try {
      const res = await secureAxios.get("/dashboard/admin");
      setAdminStats(res.data);
    } catch {
      setAdminStats(null);
    }
  }, []);

  useEffect(() => {
    fetchUser();
    fetchAdminStats();
  }, [fetchUser, fetchAdminStats]);

  // Tab change helper
  const setActiveTab = (tab, extraParams = {}) => {
    setSearchParams({ tab, ...extraParams });
  };

  // Render main dashboard content
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
        return <ProductManagement />; // Product management
      case "products-management":
        return <ProductManagementSystem />; // Correct component for Products Management
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
        return <ComplaintDashboard />;
      case "complaints-detail":
        return (
          <ComplaintDetail
            id={complaintId}
            goBack={() => setActiveTab("complaints")}
          />
        );
      case "todos":
        return <ToDoDashboard />;
      case "calendar":
        return <CalendarDashboard />;
      case "email-marketing":
        return <EmailMarketingDashboard />;
      case "chat":
        return <ChatDashboard />;
      default:
        return <p className="text-sm text-red-500">⚠ Unknown section</p>;
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 min-h-0">
        <DashboardLayout
          activeTab={activeTab} // Pass the activeTab directly (no need to split)
          setActiveTab={setActiveTab}
        >
          <div className="flex-1 flex flex-col bg-[#0f172a] text-white p-6 ">
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
