// src/pages/admin/calendar/CalendarDashboard.jsx
import { useState } from "react";
import CalendarGrid from "./CalendarGrid";
import { useCalendarQuery, useSaveCalendar } from "./useCalendar";
import { countries } from "./countryList";
import CalendarHistory from "./CalendarHistory"; // <-- Add this import

const CalendarDashboard = () => {
  const [country, setCountry] = useState("BG");
  const year = 2025;
  const [tab, setTab] = useState("calendar");
  const { data, isLoading } = useCalendarQuery(country, year);
  const { mutate: saveCalendar, isPending } = useSaveCalendar(country, year);

  const [editableCalendar, setEditableCalendar] = useState(null);

  // --- Only enable Save if there are unsaved changes ---
  const hasUnsavedChanges =
    !!editableCalendar &&
    JSON.stringify(editableCalendar.calendar) !== JSON.stringify(data.calendar);

  const handleSave = () => {
    if (editableCalendar?.calendar) {
      saveCalendar(editableCalendar);
    }
  };

  if (isLoading || !data?.calendar)
    return <p className="text-white">Loading...</p>;

  return (
    <div className="space-y-4 text-white p-4">
      {/* Top Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        {/* Country Selector */}
        <select
          className="p-2 bg-slate-800 border border-slate-600 rounded text-sm"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        >
          {countries.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
        {/* --- Tabs --- */}
        <button
          type="button"
          className={`px-4 py-2 rounded-t-md font-semibold transition ${
            tab === "calendar"
              ? "bg-slate-800 border-b-2 border-teal-400 text-teal-300"
              : "bg-slate-700 text-slate-300"
          }`}
          onClick={() => setTab("calendar")}
        >
          Calendar
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded-t-md font-semibold transition ${
            tab === "history"
              ? "bg-slate-800 border-b-2 border-pink-400 text-pink-300"
              : "bg-slate-700 text-slate-300"
          }`}
          onClick={() => setTab("history")}
        >
          History
        </button>
        {/* Hover Info */}
        <div className="relative group text-sm cursor-pointer">
          <button
            type="button"
            className="
    flex items-center gap-1 px-3 py-1.5 rounded-full
    bg-slate-800 hover:bg-blue-900 text-blue-200 font-semibold
    text-xs shadow-sm border border-blue-700/40
    transition focus:outline-none focus:ring-2 focus:ring-blue-700/30
  "
          >
            <span className="bg-blue-700/20 rounded-full p-1 mr-1 flex items-center justify-center">
              {/* Option 1: Info SVG */}
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" stroke="currentColor" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 16v-4m0-4h.01"
                />
              </svg>
            </span>
            <span>Show Guide</span>
          </button>

          <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 hidden group-hover:flex flex-col gap-2 bg-slate-800 text-white text-xs p-3 rounded shadow-lg w-72">
            <div className="font-semibold text-slate-100 mb-1">
              How to use the calendar
            </div>
            <div>
              <span className="font-medium text-slate-300">Left Side:</span>
              <span className="ml-1">
                This is the{" "}
                <span className="text-yellow-300 font-semibold">
                  public calendar
                </span>{" "}
                all users see. You can only view it.
              </span>
            </div>
            <div>
              <span className="font-medium text-slate-300">Right Side:</span>
              <span className="ml-1">
                This is your{" "}
                <span className="text-pink-400 font-semibold">
                  editable calendar
                </span>
                . You can add, edit, or remove events here before publishing.
              </span>
            </div>
            <div className="border-t border-slate-600 my-2"></div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-600 rounded-sm inline-block"></span>
              <span>Regular day with event</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-slate-600 rounded-sm inline-block"></span>
              <span>Regular day without event</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-pink-900 rounded-sm inline-block border border-pink-700"></span>
              <span>Weekend without event</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-teal-600 rounded-sm inline-block"></span>
              <span>Today (no event)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-orange-600 rounded-sm inline-block"></span>
              <span>Today (with event)</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 inline-block rounded-sm border-2 border-teal-400 bg-transparent"
                style={{ boxSizing: "border-box" }}
              ></span>
              <span>Current month</span>
            </div>
            <div className="border-t border-slate-600 my-2"></div>
            <div className="text-slate-300 leading-snug">
              <ul className="list-disc pl-4 space-y-1 text-[10px]">
                <li>
                  <span className="font-medium text-white">
                    To add an event:
                  </span>{" "}
                  Click on a day in the right calendar and enter a title.
                </li>
                <li>
                  <span className="font-medium text-white">
                    To edit or remove an event:
                  </span>{" "}
                  Click on a day that already has an event and update or clear
                  the details.
                </li>
                <li>
                  <span className="font-medium text-white">
                    To save your changes:
                  </span>{" "}
                  Click{" "}
                  <span className="text-teal-300 font-semibold">
                    "Publish Calendar"
                  </span>
                  . This will update the public calendar everyone sees.
                </li>
                <li>
                  You can switch between countries using the dropdown at the
                  top.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={!hasUnsavedChanges || isPending}
          className={`
            flex items-center gap-2 px-4 py-1.5 rounded-md font-medium text-sm transition
            ${
              !hasUnsavedChanges || isPending
                ? "bg-teal-900 text-teal-300 opacity-60 cursor-not-allowed"
                : "bg-teal-600 hover:bg-teal-500 text-white shadow"
            }
          `}
          style={{ minWidth: 142 }}
          title="Publish this calendar for all users"
        >
          {isPending ? (
            <>
              <svg
                className="animate-spin h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Publish Calendar</span>
            </>
          )}
        </button>
      </div>

      {/* Grid Layout */}
      {/* Main Content: Show calendar or history */}
      {tab === "calendar" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {/* Left: Read-Only Calendar */}
          <div className="border border-slate-700 rounded-xl ">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🔒</span>
              <h3 className="text-lg font-semibold text-slate-100">
                Public Calendar{" "}
                <span className="ml-2 px-2 py-0.5 rounded bg-slate-800 text-xs font-medium text-slate-300">
                  {year}
                </span>
              </h3>
            </div>
            <div className="text-slate-400 text-xs mb-2 pl-7">
              This is what all users see for{" "}
              <span className="font-medium">
                {countries.find((c) => c.code === country)?.name}
              </span>
              . Update the calendar on the right, then save to update this view.
            </div>
            <CalendarGrid data={data.calendar} year={year} editable={false} />
          </div>

          {/* Right: Editable Calendar */}
          <div className="border border-slate-700 rounded-xl ">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">✏️</span>
              <h3 className="text-lg font-semibold text-slate-100">
                Edit Calendar{" "}
                <span className="ml-2 px-2 py-0.5 rounded bg-slate-800 text-xs font-medium text-slate-300">
                  {year}
                </span>
              </h3>
            </div>
            <div className="text-slate-400 text-xs mb-2 pl-7">
              You can add, edit, or remove events here. Don’t forget to save
              when done!
            </div>
            <CalendarGrid
              data={editableCalendar?.calendar || data.calendar}
              year={year}
              editable={true}
              setData={(calendar) => setEditableCalendar({ ...data, calendar })}
              country={country} // <<== add this line!
            />
          </div>
        </div>
      ) : (
        <CalendarHistory country={country} year={year} />
      )}
    </div>
  );
};

export default CalendarDashboard;
