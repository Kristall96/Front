import { useEffect, useState } from "react";
import secureAxios from "../../../utils/secureAxios";
import UserComplaintChat from "../../admin/complaint/UserComplaintChat";

export default function UserComplaintList() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [statusTab, setStatusTab] = useState("Open");

  const statusTabs = ["Open", "Under Review", "Resolved", "Closed"];
  const statusCounts = statusTabs.reduce((acc, tab) => {
    acc[tab] = complaints.filter((c) => c.status === tab).length;
    return acc;
  }, {});

  const filteredComplaints = complaints.filter((c) => c.status === statusTab);

  useEffect(() => {
    let mounted = true;
    let intervalId;

    const fetchComplaints = async () => {
      try {
        const { data } = await secureAxios.get("/complaint");
        if (mounted) setComplaints(data);
      } catch (err) {
        if (mounted) setComplaints([]);
      }
      if (mounted) setLoading(false);
    };

    fetchComplaints();
    intervalId = setInterval(fetchComplaints, 5000);

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (filteredComplaints.length) {
      setSelectedId(filteredComplaints[0]._id);
    } else {
      setSelectedId(null);
    }
  }, [statusTab, complaints.length]);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Centered tabs, inside the box, smaller and closer */}
      <div
        className="w-full max-w-[98vw] flex flex-col mx-auto"
        style={{ height: "74vh", maxHeight: "74vh", minHeight: 520 }}
      >
        <div className="flex justify-center py-2">
          <ul className="flex gap-1 bg-[#202a40]/70 px-1.5 py-0.5 rounded-full shadow border border-blue-900/30">
            {statusTabs.map((tab) => (
              <li key={tab}>
                <button
                  type="button"
                  onClick={() => setStatusTab(tab)}
                  className={`px-3 py-1 rounded-full font-medium text-[14px] transition-all duration-300
                    ${
                      statusTab === tab
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow"
                        : "text-blue-100/80 hover:text-white hover:bg-blue-900/30"
                    }
                  `}
                  style={{ minWidth: 70 }}
                >
                  {tab}
                  <span className="ml-1 font-mono text-xs px-1.5 py-0.5 rounded-full bg-slate-900 text-cyan-200">
                    {statusCounts[tab] ?? 0}
                  </span>
                  {statusTab === tab && (
                    <span className="block h-0.5 w-4/5 rounded-full bg-gradient-to-r from-cyan-400/80 via-blue-400 to-blue-600/70 mx-auto mt-1" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
        {/* Content below the tabs */}
        <div className="flex flex-1 min-h-0 w-full gap-0">
          {/* Sidebar */}
          <div className="relative w-1/4 min-w-[260px] max-w-[340px] flex-shrink-0 h-full">
            <div className="flex flex-col bg-[#151b29] rounded-l-2xl shadow-2xl h-full border border-slate-800">
              <div className="px-4 py-3 border-b border-slate-800">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Your Complaints
                </h3>
              </div>
              <ul
                className="flex-1 min-h-0 overflow-y-auto custom-scrollbar"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "#4b5563 #151b29",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                {loading ? (
                  <div className="px-4 py-6 text-slate-400 text-center text-sm">
                    Loading your complaints...
                  </div>
                ) : filteredComplaints.length === 0 ? (
                  <div className="px-4 py-6 text-slate-400 text-center text-sm">
                    No complaints in this status.
                  </div>
                ) : (
                  filteredComplaints.map((c) => (
                    <li
                      key={c._id}
                      className={`group cursor-pointer px-4 py-3 border-b border-slate-800 transition-all duration-150 ${
                        selectedId === c._id
                          ? "bg-gradient-to-r from-sky-950/70 to-slate-900 border-sky-500 shadow-inner"
                          : "hover:bg-slate-800/60"
                      }`}
                      onClick={() => setSelectedId(c._id)}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-blue-200 text-xs">
                          {c.subject}
                        </span>
                        <span
                          className={`text-xs rounded px-2 py-0.5 ${
                            c.status === "Resolved"
                              ? "bg-green-700/50 text-green-300"
                              : c.status === "Open"
                              ? "bg-yellow-700/40 text-yellow-200"
                              : c.status === "Closed"
                              ? "bg-slate-700 text-slate-200"
                              : "bg-blue-800/40 text-sky-200"
                          }`}
                        >
                          {c.status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 mb-1">
                        Category: {c.category} •{" "}
                        {new Date(c.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-gray-300 text-xs line-clamp-2">
                        {c.description}
                      </div>
                      <div className="mt-2">
                        <span
                          className={`text-xs font-medium transition ${
                            selectedId === c._id
                              ? "text-sky-400"
                              : "text-blue-400 group-hover:text-sky-300"
                          }`}
                        >
                          {selectedId === c._id ? "Chat Open" : "View Chat"}
                        </span>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
          {/* Chat Panel */}
          <div
            className="flex-1 flex flex-col rounded-r-2xl bg-[#161d2b] shadow-2xl ml-0 border-t border-b border-r border-slate-800"
            style={{ height: "100%" }}
          >
            {selectedId ? (
              <UserComplaintChat complaintId={selectedId} />
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500 text-lg">
                Select a complaint to view chat.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
