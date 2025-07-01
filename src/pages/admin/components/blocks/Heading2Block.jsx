export default function HeadingBlockH2({
  block,
  onChange,
  onKeyDown,
  readOnly = false,
}) {
  if (readOnly) {
    // ✅ Preview mode: render real h2 for SEO
    return (
      <h2 className="text-3xl font-semibold my-4">
        {block.content || "Heading 2"}
      </h2>
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
        placeholder="Heading 2..."
        className="w-full text-3xl font-semibold px-3 py-2 border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
    </div>
  );
}
