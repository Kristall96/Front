import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import secureAxios from "../../utils/secureAxios";
import DashboardLayout from "./DashboardLayout";
import ProfileSection from "./sections/ProfileSection";
import Navbar from "../../components/Navbar";
import UserComplaintsSection from "../admin/complaint/UserComplaintSection"; // <--- NEW IMPORT

const UserDashboard = () => {
  const [userData, setUserData] = useState(null);
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

  useEffect(() => {
    fetchUser();
  }, []);

  const renderSection = () => {
    if (!userData) return <p>Loading profile...</p>;

    switch (activeTab) {
      case "profile":
        return <ProfileSection user={userData} refreshUser={fetchUser} />;
      case "orders":
        return (
          <p className="text-sm text-gray-600">🧾 Orders coming soon...</p>
        );
      case "wishlist":
        return (
          <p className="text-sm text-gray-600">💖 Wishlist coming soon...</p>
        );
      case "raise-complaint":
        return <UserComplaintsSection />; // <-- Tabs UI for complaints
      default:
        return <p className="text-sm text-red-500">⚠ Unknown section</p>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a]">
      {" "}
      {/* <-- add min-h-screen here */}
      <Navbar />
      <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
        <div className="p-6 flex-1 flex flex-col">
          {" "}
          {/* <-- add flex-1 here */}
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            User Dashboard
          </h1>
          {renderSection()}
        </div>
      </DashboardLayout>
    </div>
  );
};

export default UserDashboard;
