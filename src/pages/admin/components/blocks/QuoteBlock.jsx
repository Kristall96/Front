export default function QuoteBlock({
  block,
  onChange,
  onKeyDown,
  readOnly = false,
}) {
  if (readOnly) {
    // ✅ Preview mode with real <blockquote>
    return (
      <blockquote className="my-6 px-4 py-3 border-l-4 border-blue-500 bg-slate-100 dark:bg-slate-800/30 rounded text-lg italic">
        {block.content || "Inspirational quote goes here..."}
      </blockquote>
    );
  }

  // 📝 Edit mode with textarea
  return (
    <blockquote className="relative group my-4 px-4 py-3 border-l-4 border-blue-500 bg-slate-800/30 rounded">
      <textarea
        rows={2}
        value={block.content}
        onChange={(e) => onChange({ ...block, content: e.target.value })}
        onKeyDown={onKeyDown}
        placeholder="Write a quote..."
        className="w-full text-lg italic px-2 py-1 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </blockquote>
  );
}
