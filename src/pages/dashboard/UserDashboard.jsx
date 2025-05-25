import { useEffect, useState } from "react";
import secureAxios from "../../utils/secureAxios";
import DashboardLayout from "../dashboard/DashboardLayout";
import Navbar from "../../components/Navbar";
const UserDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    secureAxios.get("/dashboard/user").then((res) => setData(res.data));
  }, []);

  return (
    <>
      <Navbar />
      <DashboardLayout>
        <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
        {data ? (
          <div className="bg-white p-4 rounded shadow">
            <p>{data.message}</p>
            <pre className="mt-4 text-sm bg-gray-100 p-4 rounded">
              {JSON.stringify(data.recentOrders, null, 2)}
            </pre>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </DashboardLayout>
    </>
  );
};

export default UserDashboard;
