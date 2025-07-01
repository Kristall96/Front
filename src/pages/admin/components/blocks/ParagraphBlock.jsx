export default function ParagraphBlock({
  block,
  onChange,
  onKeyDown,
  readOnly = false,
}) {
  if (readOnly) {
    // ✅ Render proper <p> tag in preview mode
    return (
      <p className="text-base my-4">
        {block.content || "Your paragraph goes here..."}
      </p>
    );
  }

  // 📝 Editable textarea for paragraph
  return (
    <div className="relative group my-4">
      <textarea
        rows={3}
        value={block.content}
        onChange={(e) => onChange({ ...block, content: e.target.value })}
        onKeyDown={onKeyDown}
        placeholder="Type your paragraph..."
        className="w-full text-base px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
    </div>
  );
}
