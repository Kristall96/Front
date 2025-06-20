import BlockRenderer from "../BlockRenderer";
import { createBlock } from "../../../../utils/createBlock"; // make sure this exists

export default function GroupBlock({ block, onDelete, onChange }) {
  const handleChildChange = (childId, changes) => {
    const updatedChildren = block.children.map((child) =>
      child.id === childId ? { ...child, ...changes } : child
    );
    onChange({ ...block, children: updatedChildren });
  };

  const handleAddBlock = () => {
    const newBlock = createBlock("paragraph");
    const updatedChildren = [...(block.children || []), newBlock];
    onChange({ ...block, children: updatedChildren });
  };

  return (
    <div className="border border-blue-400 p-4 rounded bg-slate-800 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-blue-400 font-semibold">🧱 Group Block</h3>
        <button onClick={onDelete} className="text-red-500 text-sm">
          ❌ Delete Group
        </button>
      </div>

      <div className="space-y-3">
        {(block.children || []).map((child) => (
          <BlockRenderer
            key={child.id}
            block={child}
            onDelete={() => {
              const filtered = block.children.filter((b) => b.id !== child.id);
              onChange({ ...block, children: filtered });
            }}
            onChange={(changes) => handleChildChange(child.id, changes)}
          />
        ))}
      </div>

      {/* ✅ THIS BUTTON ADDS A CHILD */}
      <button
        onClick={handleAddBlock}
        className="text-sm text-blue-400 hover:underline"
      >
        ➕ Add Block
      </button>
    </div>
  );
}
