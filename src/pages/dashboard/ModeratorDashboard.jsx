import { useEffect, useState } from "react";
import secureAxios from "../../utils/secureAxios";
import DashboardLayout from "./DashboardLayout";
import ProfileSection from "./sections/ProfileSection";
import Navbar from "../../components/Navbar";

const ModeratorDashboard = () => {
  const [activeTab, setActiveTab] = useState("panel");
  const [userData, setUserData] = useState(null);

  const fetchUser = async () => {
    try {
      const res = await secureAxios.get("/users/me");
      setUserData(res.data);
    } catch (err) {
      console.error(
        "Failed to load moderator profile:",
        err.response?.data?.message
      );
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const renderSection = () => {
    if (!userData) return <p>Loading profile...</p>;

    switch (activeTab) {
      case "panel":
        return <ProfileSection user={userData} refreshUser={fetchUser} />;
      case "complaints":
        return (
          <p className="text-sm text-gray-600">📋 Complaints coming soon...</p>
        );
      default:
        return <p className="text-sm text-red-500">⚠ Unknown section</p>;
    }
  };

  return (
    <>
      <Navbar />
      <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
        <div>
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            Moderator Dashboard
          </h1>
          {renderSection()}
        </div>
      </DashboardLayout>
    </>
  );
};

export default ModeratorDashboard;
