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
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r p-6">
          <h2 className="text-lg font-semibold mb-6">Dashboard</h2>
          <ul className="space-y-3">
            <li>
              <button
                onClick={() => setActiveTab("profile")}
                className={`block w-full text-left hover:text-blue-500 ${
                  activeTab === "profile" ? "font-semibold text-blue-600" : ""
                }`}
              >
                My Profile
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("orders")}
                className="block w-full text-left hover:text-blue-500"
              >
                My Orders
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("wishlist")}
                className="block w-full text-left hover:text-blue-500"
              >
                Wishlist
              </button>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-10">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            User Dashboard
          </h1>
          {userData ? renderSection() : <p>Loading profile...</p>}
        </main>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
