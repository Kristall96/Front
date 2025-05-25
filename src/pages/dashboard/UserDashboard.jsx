// src/pages/dashboard/UserDashboard.jsx
import { useEffect, useState } from "react";
import secureAxios from "../../utils/secureAxios";
import DashboardLayout from "./DashboardLayout";
import ProfileSection from "./sections/ProfileSection";

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
    if (activeTab === "profile") {
      return <ProfileSection user={userData} refreshUser={fetchUser} />;
    }
    return <p className="text-sm text-gray-500">Coming soon...</p>;
  };

  return (
    <DashboardLayout>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r p-4">
          <h2 className="text-lg font-semibold mb-6">Dashboard</h2>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveTab("profile")}
                className={`block w-full text-left hover:text-blue-500 ${
                  activeTab === "profile" ? "font-bold text-blue-600" : ""
                }`}
              >
                My Profile
              </button>
            </li>
            {/* You can add more tabs here */}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-50">
          <h1 className="text-2xl font-bold mb-6">User Dashboard</h1>
          {userData ? renderSection() : <p>Loading profile...</p>}
        </main>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
