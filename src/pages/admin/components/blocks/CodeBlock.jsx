import { useRef } from "react";

export default function CodeBlock({ block, onChange, onDelete }) {
  const textareaRef = useRef(null);

  // Handle tab indentation inside textarea
  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const newValue =
        block.content.substring(0, start) + "  " + block.content.substring(end);

      onChange(newValue);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <div className="relative group border rounded bg-gray-900 text-white font-mono p-4 shadow-sm">
      {/* Optional: block label */}
      <label className="text-sm text-gray-400 mb-2 block">Code Block</label>

      <textarea
        ref={textareaRef}
        className="w-full bg-transparent p-2 resize-y rounded outline-none ring-1 ring-gray-700 focus:ring-2 focus:ring-blue-500"
        value={block.content}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="// Start typing your code..."
        rows={8}
      />

      {/* Delete button */}
      <button
        type="button"
        onClick={onDelete}
        className="absolute top-2 right-2 text-red-400 hover:text-red-600 hidden group-hover:block"
        title="Delete block"
      >
        ✕
      </button>
    </div>
  );
}
