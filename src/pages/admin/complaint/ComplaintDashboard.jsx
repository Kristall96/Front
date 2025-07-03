import { useState } from "react";
import ComplaintListTabs from "./ComplaintListTab";
import AllComplaints from "./AllComplaints";
import MyAssignedComplaints from "./MyAssignedComplaints";
import ComplaintResponses from "./ComplaintResponses";

export default function ComplaintDashboard() {
  const [activeTab, setActiveTab] = useState("all"); // "all", "assigned", "responses"

  return (
    <div>
      <ComplaintListTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "all" && <AllComplaints />}
      {activeTab === "assigned" && <MyAssignedComplaints />}
      {activeTab === "responses" && <ComplaintResponses />}
    </div>
  );
}
