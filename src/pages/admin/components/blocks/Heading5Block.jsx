export default function HeadingBlockH5({
  block,
  onChange,
  onKeyDown,
  readOnly = false,
}) {
  if (readOnly) {
    // ✅ Render as real <h5> in preview mode for semantic SEO
    return (
      <h5 className="text-lg font-semibold my-4">
        {block.content || "Heading 5"}
      </h5>
    );
  }

  // 📝 Editable input for heading
  return (
    <div className="relative group my-4">
      <input
        type="text"
        value={block.content}
        onChange={(e) => onChange({ ...block, content: e.target.value })}
        onKeyDown={onKeyDown}
        placeholder="Heading 5..."
        className="w-full text-lg font-semibold px-3 py-2 border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
    </div>
  );
}
