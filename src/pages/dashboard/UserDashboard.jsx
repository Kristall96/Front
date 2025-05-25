import { useEffect, useState } from "react";
import secureAxios from "../../utils/secureAxios";
import DashboardLayout from "./DashboardLayout";
import ProfileSection from "./sections/ProfileSection";
import Navbar from "../../components/Navbar";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [userData, setUserData] = useState(null);

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
        return <p>🧾 Orders coming soon...</p>;
      case "wishlist":
        return <p>💖 Wishlist coming soon...</p>;
      default:
        return <p>🔧 Unknown section</p>;
    }
  };

  return (
    <>
      <Navbar />
      <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
        <div>
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            User Dashboard
          </h1>
          {renderSection()}
        </div>
      </DashboardLayout>
    </>
  );
};

export default UserDashboard;
