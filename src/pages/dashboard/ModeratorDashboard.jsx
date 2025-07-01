// ModeratorDashboard.jsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import secureAxios from "../../utils/secureAxios";
import DashboardLayout from "./DashboardLayout";
import ProfileSection from "./sections/ProfileSection";
import Navbar from "../../components/Navbar";
import ComplaintList from "../admin/complaint/ComplaintList"; // <--- Import!

const ModeratorDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get("tab") || "profile";
  const setActiveTab = (tab) => setSearchParams({ tab });

  const fetchUser = async () => {
    try {
      const res = await secureAxios.get("/users/me");
      setUserData(res.data);
    } catch (err) {
      console.error("Failed to load profile:", err.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const renderSection = () => {
    if (!userData) return <p>Loading profile...</p>;

    switch (activeTab) {
      case "profile":
        return <ProfileSection user={userData} refreshUser={fetchUser} />;
      // ... other tabs ...
      case "complaints":
        return (
          <ComplaintList filterAssignedTo={userData._id} role="moderator" />
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
          <h1 className="text-3xl font-bold mb-6">Moderator Dashboard</h1>
          {renderSection()}
        </div>
      </DashboardLayout>
    </>
  );
};

export default ModeratorDashboard;
