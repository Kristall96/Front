export default function HeadingBlockH4({
  block,
  onChange,
  onKeyDown,
  readOnly = false,
}) {
  if (readOnly) {
    // ✅ Preview mode using <h4>
    return (
      <h4 className="text-xl font-semibold my-4">
        {block.content || "Heading 4"}
      </h4>
    );
  }

  // 📝 Edit mode with input
  return (
    <div className="relative group my-4">
      <input
        type="text"
        value={block.content}
        onChange={(e) => onChange({ ...block, content: e.target.value })}
        onKeyDown={onKeyDown}
        placeholder="Heading 4..."
        className="w-full text-xl font-semibold px-3 py-2 border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
    </div>
  );
}
