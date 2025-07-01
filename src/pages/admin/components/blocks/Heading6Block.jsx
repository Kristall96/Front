export default function HeadingBlockH6({
  block,
  onChange,
  onKeyDown,
  readOnly = false,
}) {
  if (readOnly) {
    // ✅ Render real <h6> in preview mode
    return (
      <h6 className="text-base font-semibold my-4">
        {block.content || "Heading 6"}
      </h6>
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
        placeholder="Heading 6..."
        className="w-full text-base font-semibold px-3 py-2 border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
    </div>
  );
}
