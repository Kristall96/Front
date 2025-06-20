// admin/components/BlockSidebar.jsx
import { createBlock } from "../../../utils/createBlock.js";

const BLOCK_TYPES = [
  { type: "paragraph", label: "Paragraph" },
  { type: "heading", label: "Heading (H1-H6)" },
  { type: "richtext", label: "Rich Text" },
  { type: "image", label: "Image" },
  { type: "video", label: "Video" },
  { type: "quote", label: "Quote" },
  { type: "code", label: "Code Block" },
  { type: "divider", label: "Divider" },
];

const LAYOUT_TYPES = [
  { type: "group", label: "Group (Section)" },
  { type: "columns", label: "Columns Layout" },
  { type: "column", label: "Column (Child only)", disabled: true },
];

export default function BlockSidebar({ onInsertPreset }) {
  return (
    <div className="w-60 min-h-screen bg-[#1e293b] text-white border-r border-gray-700 p-6 shadow-xl overflow-y-auto">
      {/* BLOCKS */}
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 border-b border-slate-600 pb-2">
        🧱 Blocks
      </h2>
      <div className="space-y-3 mb-8">
        {BLOCK_TYPES.map((b) => (
          <div
            key={b.type}
            draggable
            onDragStart={(e) => e.dataTransfer.setData("block-type", b.type)}
            className="flex items-center gap-2 p-3 bg-[#0f172a] border border-gray-600 rounded-lg cursor-grab active:cursor-grabbing hover:bg-gray-800 transition"
          >
            <span className="text-lg">➕</span>
            <span className="text-sm font-medium">{b.label}</span>
          </div>
        ))}
      </div>

      {/* LAYOUT TYPES */}
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 border-b border-slate-600 pb-2">
        📐 Layouts
      </h2>
      <div className="space-y-3 mb-8">
        {LAYOUT_TYPES.map((l) => (
          <div
            key={l.type}
            draggable={!l.disabled}
            onDragStart={
              l.disabled
                ? undefined
                : (e) => e.dataTransfer.setData("blockType", l.type)
            }
            className={`flex items-center gap-2 p-3 rounded-lg border border-slate-600 transition shadow-sm ${
              l.disabled
                ? "bg-gray-700 cursor-not-allowed opacity-50"
                : "bg-[#0f172a] cursor-grab hover:bg-gray-800"
            }`}
          >
            <span className="text-lg">📦</span>
            <span className="text-sm font-medium">{l.label}</span>
          </div>
        ))}
      </div>

      {/* LAYOUT PRESETS */}
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 border-b border-slate-600 pb-2">
        🧩 Preset Sections
      </h2>
      <div className="space-y-3">
        {[1, 2, 3].map((count) => (
          <button
            key={count}
            onClick={() =>
              onInsertPreset?.([createBlock("columns", "", { count })])
            }
            className="block w-full text-left p-3 rounded bg-slate-800 hover:bg-slate-700 border border-slate-600 shadow-sm transition"
          >
            <div className="font-medium">🧩 {count} Column Layout</div>
            <div className="text-sm text-gray-400">
              {count === 1
                ? "Single column"
                : count === 2
                ? "Two equal-width columns"
                : "Three equal-width columns"}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
