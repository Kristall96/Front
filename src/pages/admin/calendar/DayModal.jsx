import { useState, useEffect } from "react";

const MODAL_BG = "#101729";

// --- Helper Functions ---
function displayUser(u) {
  if (!u) return "Unknown";
  if (u.firstName || u.lastName)
    return `${u.firstName || ""} ${u.lastName || ""}`.trim();
  if (u.username) return u.username;
  if (u.email) return u.email;
  return "Unknown";
}

function formatDateTime(dt) {
  if (!dt) return "-";
  const d = new Date(dt);
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// --- Event Form ---
function EventForm({ initial, onSave, onCancel }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [type, setType] = useState(initial?.type || "custom");
  const [color, setColor] = useState(initial?.color || "#f43f5e");
  const [description, setDescription] = useState(initial?.description || "");

  // Reset on initial change (for edit vs add)
  useEffect(() => {
    setTitle(initial?.title || "");
    setType(initial?.type || "custom");
    setColor(initial?.color || "#f43f5e");
    setDescription(initial?.description || "");
  }, [initial]);

  return (
    <form
      className="flex flex-col gap-2 mb-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ title, type, color, description });
        // Optionally, reset fields here if you want to clear on add
      }}
    >
      <input
        autoFocus
        required
        className="rounded-lg bg-slate-800 border border-slate-700 text-slate-100 p-2 text-sm"
        placeholder="Event Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        rows={2}
        className="rounded-lg bg-slate-800 border border-slate-700 text-slate-100 p-2 resize-none text-xs"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        maxLength={500}
      />
      <div className="flex gap-2 items-center">
        <select
          value={type}
          className="rounded bg-slate-800 text-slate-100 px-2 py-1 text-xs"
          onChange={(e) => setType(e.target.value)}
        >
          <option value="custom">Custom</option>
          <option value="holiday">Holiday</option>
          <option value="national">National</option>
        </select>
        <label className="flex items-center gap-1 ml-1 text-slate-200 text-xs">
          <span>Color</span>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-6 h-6 border-none bg-transparent"
            title="Pick color"
          />
        </label>
      </div>
      <div className="flex gap-2 mt-2 justify-end">
        <button
          type="button"
          className="rounded bg-slate-700 text-slate-200 px-3 py-1.5 font-medium text-xs"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded bg-pink-800 hover:bg-pink-600 text-white font-bold px-3 py-1.5 shadow-md text-xs"
        >
          Save
        </button>
      </div>
    </form>
  );
}

// --- Main Modal ---
export default function DayModal({
  open,
  onClose,
  dateLabel = "",
  events = [],
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
}) {
  const [editingIdx, setEditingIdx] = useState(-1);
  const [adding, setAdding] = useState(false);

  // Custom scrollbar for this modal only
  useEffect(() => {
    if (!open) return;
    const style = document.createElement("style");
    style.innerHTML = `
      .daymodal-scroll::-webkit-scrollbar {
        width: 10px;
        background: #131a2a;
        border-radius: 8px;
      }
      .daymodal-scroll::-webkit-scrollbar-thumb {
        background: #22304b;
        border-radius: 8px;
        border: 2px solid #101729;
      }
      .daymodal-scroll::-webkit-scrollbar-thumb:hover {
        background: #36518a;
      }
      .daymodal-scroll {
        scrollbar-width: thin;
        scrollbar-color: #22304b #101729;
      }
    `;
    style.setAttribute("data-daymodal-scroll", "true");
    document.head.appendChild(style);
    return () => {
      if (style.parentNode) style.parentNode.removeChild(style);
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setEditingIdx(-1);
      setAdding(false);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-black/60 backdrop-blur-sm">
      <div
        className="
          border border-slate-800 rounded-2xl px-8 py-7
          min-w-[800px] max-w-xl min-h-[620px] max-h-[90vh]
          shadow-2xl flex flex-col animate-fade-in relative
        "
        style={{ background: MODAL_BG }}
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-slate-500 hover:text-red-400 text-3xl leading-none"
          title="Close"
          aria-label="Close"
        >
          ×
        </button>
        <div className="mb-3">
          <span className="font-bold text-2xl text-slate-100">
            Events on <span className="font-semibold">{dateLabel}</span>
          </span>
        </div>
        {/* Event List Area */}
        <div className="daymodal-scroll flex flex-col gap-2 max-h-[630px] overflow-y-auto mb-3 border-2 border-slate-600 rounded-xl p-2">
          {events.length === 0 && !adding && (
            <span className="text-slate-400 text-sm pl-1">No events yet.</span>
          )}
          {events.map((ev, i) =>
            editingIdx === i ? (
              <EventForm
                key={ev._id || i}
                initial={ev}
                onSave={(data) => {
                  onEditEvent(i, data);
                  setEditingIdx(-1);
                }}
                onCancel={() => setEditingIdx(-1)}
              />
            ) : (
              <div
                key={ev._id || i}
                className="rounded-lg bg-slate-800 border border-slate-600 px-3 py-2 flex flex-col gap-0.5 relative"
                style={{
                  borderLeft: `4px solid ${ev.color || "#f43f5e"}`,
                }}
              >
                <div className="flex gap-2 items-center mb-0.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-slate-700"
                    style={{ background: ev.color || "#f43f5e" }}
                  />
                  <span className="font-bold text-sm text-slate-100">
                    {ev.title}
                  </span>
                  <span className="ml-2 text-[11px] text-slate-400 uppercase">
                    {ev.type}
                  </span>
                </div>
                {ev.description && (
                  <div className="text-xs text-slate-300 pl-6 break-words whitespace-pre-line leading-snug">
                    {ev.description}
                  </div>
                )}

                {/* --- Audit Info --- */}
                <div className="mt-2 text-[11px] text-slate-400 flex flex-row gap-2 pl-6">
                  <span>
                    Created by{" "}
                    <span className="font-semibold text-slate-300">
                      {displayUser(ev.createdBy)}
                    </span>
                    {" • "}
                    <span>{formatDateTime(ev.createdAt)}</span>
                    {ev.editedBy && (
                      <>
                        {" • Last edited by "}
                        <span className="font-semibold text-slate-300">
                          {displayUser(ev.editedBy)}
                        </span>
                        {" • "}
                        <span>{formatDateTime(ev.updatedAt)}</span>
                      </>
                    )}
                  </span>
                </div>

                <div className="flex gap-2 absolute top-2 right-3">
                  <button
                    className="
                      flex items-center gap-1
                      px-3 py-1 rounded-md
                      text-xs font-semibold
                      bg-teal-900 text-teal-200
                      hover:bg-teal-600 hover:text-white
                      focus:outline-none focus:ring-2 focus:ring-teal-400
                      transition
                      shadow-sm
                    "
                    onClick={() => setEditingIdx(i)}
                    title="Edit"
                    type="button"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 20 20"
                    >
                      <path d="M15.232 5.232l-8.464 8.464m2.121-2.121l8.485-8.485a2.121 2.121 0 013 3l-8.485 8.485a2.121 2.121 0 01-3-3z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    className="
                      flex items-center gap-1
                      px-3 py-1 rounded-md
                      text-xs font-semibold
                      bg-red-900 text-red-200
                      hover:bg-red-600 hover:text-white
                      focus:outline-none focus:ring-2 focus:ring-red-400
                      transition
                      shadow-sm
                    "
                    onClick={() => onDeleteEvent(i)}
                    title="Delete"
                    type="button"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 20 20"
                    >
                      <path d="M6 6l8 8M6 14L14 6" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            )
          )}
        </div>
        {adding && (
          <EventForm
            onSave={(data) => {
              onAddEvent(data);
              setAdding(false);
            }}
            onCancel={() => setAdding(false)}
          />
        )}
        {!adding && (
          <button
            className="mt-2 px-3 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-sm font-bold shadow-md self-end"
            onClick={() => setAdding(true)}
          >
            + Add Event
          </button>
        )}
      </div>
    </div>
  );
}
