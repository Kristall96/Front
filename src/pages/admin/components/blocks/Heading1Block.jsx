export default function HeadingBlockH1({
  block,
  onChange,
  onKeyDown,
  readOnly,
}) {
  if (readOnly) {
    return (
      <h1 className="text-4xl font-bold my-4">
        {block.content || "Heading 1"}
      </h1>
    );
  }

  return (
    <div className="relative group my-4">
      <input
        type="text"
        value={block.content}
        onChange={(e) => onChange({ ...block, content: e.target.value })}
        onKeyDown={onKeyDown}
        placeholder="Heading 1..."
        className="w-full text-4xl font-bold px-3 py-2 border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
    </div>
  );
}
