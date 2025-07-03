import { useState } from "react";
import { useAssignComplaint, useComplaints } from "./hooks/useComplaint";
import ComplaintStatusTabs from "./ComplaintStatusTabs";
import ComplaintList from "./ComplaintList";

const STATUS_TABS = ["Open", "Under Review", "Resolved", "Closed"];

export default function AllComplaints({ currentUserId = "moderator-id-123" }) {
  const { data: complaints = [], isLoading } = useComplaints();
  const assignMutation = useAssignComplaint();
  const [statusTab, setStatusTab] = useState("Open");

  // Counts by status for tabs
  const counts = STATUS_TABS.reduce(
    (acc, key) => ({
      ...acc,
      [key]: complaints.filter((c) => c.status === key).length,
    }),
    {}
  );

  // Only complaints of current tab
  const filteredComplaints = complaints.filter((c) => c.status === statusTab);

  // Assigning state per row (by complaint ID)
  const assigning = {};
  const assignError = {};
  if (assignMutation.variables) {
    assigning[assignMutation.variables] = assignMutation.isLoading;
    assignError[assignMutation.variables] = assignMutation.error;
  }

  // Handler for assign
  const handleAssign = (id) => assignMutation.mutate(id);

  return (
    <div>
      <ComplaintStatusTabs
        statusTab={statusTab}
        setStatusTab={setStatusTab}
        counts={counts}
      />
      <ComplaintList
        complaints={filteredComplaints}
        isLoading={isLoading}
        onAssign={handleAssign}
        assigning={assigning}
        assignError={assignError}
        currentUserId={currentUserId}
        emptyText="No complaints for this status."
      />
    </div>
  );
}
