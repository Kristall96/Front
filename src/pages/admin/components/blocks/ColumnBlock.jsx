import BlockRenderer from "../BlockRenderer";
import { createBlock } from "../../../../utils/createBlock";

const WIDTH_OPTIONS = ["100%", "66.66%", "50%", "33.33%"];

export default function ColumnBlock({ block, onChange, readOnly }) {
  const handleChildChange = (childId, changes) => {
    const updatedChildren = block.children.map((child) =>
      child.id === childId ? { ...child, ...changes } : child
    );
    onChange({ ...block, children: updatedChildren });
  };

  const handleAddBlock = () => {
    const newBlock = createBlock("paragraph");
    const updated = [...(block.children || []), newBlock];
    onChange({ ...block, children: updated });
  };

  const handleWidthChange = (e) => {
    onChange({ ...block, width: e.target.value });
  };

  return (
    <div
      className="p-3 border border-slate-500 rounded-md bg-black text-white space-y-3"
      style={{ width: block.width || "100%" }}
    >
      {!readOnly && (
        <div className="mb-2 text-xs text-gray-300 flex items-center justify-between">
          <span className="font-semibold">🧱 Column</span>
          <select
            value={block.width || "100%"}
            onChange={handleWidthChange}
            className="bg-slate-700 text-white text-xs rounded px-2 py-1 border border-slate-600"
          >
            {WIDTH_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                Width: {opt}
              </option>
            ))}
          </select>
        </div>
      )}

      {(block.children || []).map((child) => (
        <BlockRenderer
          key={child.id}
          block={child}
          readOnly={readOnly}
          onDelete={() => {
            const filtered = block.children.filter((b) => b.id !== child.id);
            onChange({ ...block, children: filtered });
          }}
          onChange={(changes) => handleChildChange(child.id, changes)}
        />
      ))}

      {!readOnly && (
        <button
          onClick={handleAddBlock}
          className="text-sm text-blue-400 hover:underline"
        >
          ➕ Add Block to Column
        </button>
      )}
    </div>
  );
}
