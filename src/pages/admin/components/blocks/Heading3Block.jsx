export default function HeadingBlockH3({
  block,
  onChange,
  onKeyDown,
  readOnly = false,
}) {
  if (readOnly) {
    // ✅ Preview mode: render real h3 element for proper semantic structure
    return (
      <h3 className="text-2xl font-semibold my-4">
        {block.content || "Heading 3"}
      </h3>
    );
  }

  // 📝 Edit mode
  return (
    <div className="relative group my-4">
      <input
        type="text"
        value={block.content}
        onChange={(e) => onChange({ ...block, content: e.target.value })}
        onKeyDown={onKeyDown}
        placeholder="Heading 3..."
        className="w-full text-2xl font-semibold px-3 py-2 border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
    </div>
  );
}
