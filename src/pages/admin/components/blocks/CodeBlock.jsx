export default function CodeBlock({
  block,
  onChange,
  onKeyDown,
  readOnly = false,
}) {
  if (readOnly) {
    // ✅ Preview mode: real code block
    return (
      <pre className="my-6 p-4 bg-slate-900 text-white text-sm rounded overflow-x-auto">
        <code className="whitespace-pre-wrap">
          {block.content || "// Your code here..."}
        </code>
      </pre>
    );
  }

  // 📝 Edit mode
  return (
    <div className="relative group my-4">
      <textarea
        rows={5}
        value={block.content}
        onChange={(e) => onChange({ ...block, content: e.target.value })}
        onKeyDown={onKeyDown}
        placeholder="Write your code..."
        className="w-full font-mono text-sm px-3 py-2 bg-slate-900 text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
      />
    </div>
  );
}
