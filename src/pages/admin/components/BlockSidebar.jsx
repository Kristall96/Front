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

export default function BlockSidebar() {
  return (
    <div className="w-60 min-h-screen bg-[#1e293b] text-white border-r border-gray-700 p-6 shadow-xl">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 border-b border-slate-600 pb-2">
        🧱 Blocks
      </h2>
      <div className="space-y-3">
        {BLOCK_TYPES.map((b) => (
          <div
            key={b.type}
            draggable
            onDragStart={(e) => e.dataTransfer.setData("blockType", b.type)}
            className="flex items-center gap-2 p-3 bg-[#0f172a] border border-gray-600 rounded-lg cursor-grab hover:bg-gray-800 transition duration-200 ease-in-out shadow-sm"
          >
            <span className="text-lg">➕</span>
            <span className="text-sm font-medium">{b.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
