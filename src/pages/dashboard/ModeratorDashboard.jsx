import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import secureAxios from "../../utils/secureAxios";
import DashboardLayout from "./DashboardLayout";
import Navbar from "../../components/Navbar";
import ProfileSection from "./sections/ProfileSection";
import ComplaintDashboard from "../admin/complaint/ComplaintDashboard"; // <-- Use the TABS dashboard!
import ComplaintDetail from "../admin/complaint/ComplaintDetail";

const ModeratorDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get("tab") || "profile";
  const complaintId = searchParams.get("complaintId");

  // Helper for tab changes (preserves extra params if needed)
  const setActiveTab = (tab, extraParams = {}) => {
    setSearchParams({ tab, ...extraParams });
  };

  // Load moderator info
  useEffect(() => {
    (async () => {
      try {
        const res = await secureAxios.get("/users/me");
        setUserData(res.data);
      } catch (err) {
        setUserData(null);
      }
    })();
  }, []);

  // Main content switch
  const renderSection = () => {
    if (!userData) return <p>Loading profile...</p>;

    switch (activeTab) {
      case "profile":
        return (
          <ProfileSection user={userData} refreshUser={() => fetchUser()} />
        );
      // Complaint dashboard with all tabs (All, Assigned, Responses)
      case "complaints":
        return <ComplaintDashboard user={userData} role="moderator" />;
      // Complaint detail modal/route
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
