import { motion } from "framer-motion";

export default function ComplaintStatusTabs({
  statusTab,
  setStatusTab,
  counts,
  statusTabs = ["Open", "Under Review", "Resolved", "Closed"], // default if not provided
}) {
  return (
    <ul className="flex gap-1.5 bg-[#202a40]/70 p-1 rounded-full shadow border border-blue-900/30 mb-4">
      {statusTabs.map((tab) => {
        const isActive = statusTab === tab;
        return (
          <li key={tab} className="relative">
            <button
              type="button"
              onClick={() => setStatusTab(tab)}
              className={`relative px-4 py-1 rounded-full font-semibold text-[14px]
                transition-all
                ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow"
                    : "text-blue-100/80 hover:text-white hover:bg-blue-900/30"
                }
              `}
              aria-current={isActive ? "page" : undefined}
            >
              {tab}
              <span className="ml-2 font-mono text-xs px-2 py-0.5 rounded-full bg-slate-900 text-cyan-200">
                {counts[tab] ?? 0}
              </span>
              {/* Underline animation */}
              {isActive && (
                <motion.span
                  layoutId="complaint-status-underline"
                  className="absolute left-1/2 -bottom-1 -translate-x-1/2 h-0.5 w-4/5 rounded-full bg-gradient-to-r from-cyan-400/80 via-blue-400 to-blue-600/70 shadow-[0_1px_8px_0_rgba(40,175,255,0.14)]"
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                />
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
