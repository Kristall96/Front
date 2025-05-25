import { useEffect, useState } from "react";
import secureAxios from "../../utils/secureAxios";
import DashboardLayout from "../dashboard/DashboardLayout";

const ModeratorDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    secureAxios.get("/dashboard/moderator").then((res) => setData(res.data));
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Moderator Dashboard</h1>
      {data ? (
        <div className="bg-white p-4 rounded shadow">
          <p>{data.message}</p>
          <pre className="mt-4 text-sm bg-gray-100 p-4 rounded">
            {JSON.stringify(data.tasks, null, 2)}
          </pre>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </DashboardLayout>
  );
};

export default ModeratorDashboard;
