import { useSearchParams } from "react-router-dom";
import ComplaintListTabs from "./ComplaintListTab";
import ComplaintList from "./ComplaintList";
import ComplaintResponses from "./ComplaintResponses";

export default function ComplaintsPage({
  view: controlledView,
  setView: controlledSetView,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlView = searchParams.get("view") || "all";
  const view = controlledView || urlView;
  const setView =
    controlledSetView || ((tab) => setSearchParams({ view: tab }));

  return (
    <div className="">
      {" "}
      {/* Add padding for fixed navbar */}
      <ComplaintListTabs activeTab={view} setActiveTab={setView} />
      {view === "responses" ? (
        <ComplaintResponses />
      ) : (
        <ComplaintList tab={view} />
      )}
    </div>
  );
}
