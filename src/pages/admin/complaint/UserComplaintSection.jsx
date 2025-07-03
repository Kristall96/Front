import { useState } from "react";
import NewComplaintForm from "../../admin/complaint/NewComplaintForm";
import UserComplaintList from "../../admin/complaint/UserComplaintList";

export default function UserComplaintsSection() {
  const [active, setActive] = useState("raise");

  return (
    <div>
      <div className="flex gap-2 mb-6">
        <button
          className={`px-4 py-2 rounded-t font-semibold transition ${
            active === "raise"
              ? "bg-blue-600 text-white shadow"
              : "bg-slate-800 text-blue-200"
          }`}
          onClick={() => setActive("raise")}
        >
          Raise Complaint
        </button>
        <button
          className={`px-4 py-2 rounded-t font-semibold transition ${
            active === "list"
              ? "bg-blue-600 text-white shadow"
              : "bg-slate-800 text-blue-200"
          }`}
          onClick={() => setActive("list")}
        >
          My Complaints
        </button>
      </div>
      <div>
        {active === "raise" && <NewComplaintForm />}
        {active === "list" && <UserComplaintList />}
      </div>
    </div>
  );
}
