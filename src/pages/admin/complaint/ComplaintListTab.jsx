import { motion } from "framer-motion";

export default function ComplaintListTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "all", label: "All Complaints" },
    { id: "assigned", label: "My Assigned Complaints" },
    { id: "responses", label: "My Responses" },
  ];

  return (
    <nav
      className="flex items-center justify-start w-full mb-7"
      aria-label="Complaint tabs"
    >
      <ul className="flex gap-1.5 bg-[#22283b]/80 p-1 rounded-full shadow-md border border-blue-900/50 backdrop-blur-[2px] relative">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <li key={tab.id} className="relative">
              <button
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`
                  relative px-4 py-1.5 rounded-full font-semibold text-[15px]
                  transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)]
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/80
                  ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-[0_1px_10px_0_rgba(0,175,255,0.20)]"
                      : "text-blue-100/80 hover:text-white hover:bg-blue-900/30 hover:shadow-[0_2px_6px_0_rgba(40,80,220,0.10)]"
                  }
                `}
                aria-current={isActive ? "page" : undefined}
              >
                {tab.label}
                {isActive && (
                  <motion.span
                    layoutId="underline"
                    className="
                      absolute left-1/2 -bottom-1 -translate-x-1/2
                      h-0.5 w-4/5 rounded-full
                      bg-gradient-to-r from-cyan-400/80 via-blue-400 to-blue-600/70
                      shadow-[0_1px_8px_0_rgba(40,175,255,0.14)]
                    "
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
    </nav>
  );
}
