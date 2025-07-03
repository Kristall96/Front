import { useComplaints } from "./hooks/useComplaint";
import { useAuth } from "../../../context/AuthContext";
import { useState } from "react";
import ComplaintStatusTabs from "./ComplaintStatusTabs";
import ComplaintList from "./ComplaintList";

const STATUS_TABS = ["Under Review", "Resolved", "Closed"]; // No "Open"

export default function MyAssignedComplaints() {
  const { data: complaints = [], isLoading } = useComplaints();
  const { user } = useAuth();
  const [statusTab, setStatusTab] = useState("Under Review");

  const assignedComplaints = complaints.filter(
    (c) => c.assignedTo && c.assignedTo._id === user?._id
  );

  const counts = STATUS_TABS.reduce(
    (acc, key) => ({
      ...acc,
      [key]: assignedComplaints.filter((c) => c.status === key).length,
    }),
    {}
  );

  const filteredComplaints = assignedComplaints.filter(
    (c) => c.status === statusTab
  );

  return (
    <div>
      <ComplaintStatusTabs
        statusTab={statusTab}
        setStatusTab={setStatusTab}
        counts={counts}
        statusTabs={STATUS_TABS} // Only these tabs will be shown
      />
      <ComplaintList
        complaints={filteredComplaints}
        isLoading={isLoading}
        emptyText="No complaints for this status."
      />
    </div>
  );
}
