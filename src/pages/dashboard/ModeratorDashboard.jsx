import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import secureAxios from "../../utils/secureAxios";
import DashboardLayout from "./DashboardLayout";
import Navbar from "../../components/Navbar";
import ProfileSection from "./sections/ProfileSection";
import ComplaintDashboard from "../admin/complaint/ComplaintDashboard";
import ComplaintDetail from "../admin/complaint/ComplaintDetail";
import ToDoDashboard from "../admin/todo/ToDoDashboard"; // <-- Add this import

const ModeratorDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get("tab") || "profile";
  const complaintId = searchParams.get("complaintId");

  // Profile fetch (also for ProfileSection refresh)
  const fetchUser = useCallback(async () => {
    try {
      const res = await secureAxios.get("/users/me");
      setUserData(res.data);
    } catch {
      setUserData(null);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Tab change helper
  const setActiveTab = (tab, extraParams = {}) => {
    setSearchParams({ tab, ...extraParams });
  };

  // Main content switch
  const renderSection = () => {
    if (!userData) return <p>Loading profile...</p>;

    switch (activeTab) {
      case "profile":
        return <ProfileSection user={userData} refreshUser={fetchUser} />;
      case "complaints":
        return <ComplaintDashboard user={userData} role="moderator" />;
      case "complaints-detail":
        return (
          <ComplaintDetail
            id={complaintId}
            goBack={() => setActiveTab("complaints")}
          />
        );
      case "todos":
        return <ToDoDashboard />;
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
          setActiveTab={setActiveTab}
        >
          <div className="flex-1 flex flex-col bg-[#0f172a] text-white p-6 overflow-hidden">
            <h1 className="text-3xl font-bold mb-6">Moderator Dashboard</h1>
            <div className="flex-1 min-h-0 overflow-hidden">
              {renderSection()}
            </div>
          </div>
        </DashboardLayout>
      </div>
    </div>
  );
};

export default ModeratorDashboard;
