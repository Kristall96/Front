// admin/components/blocks/HeadingBlock.jsx
export default function HeadingBlock({ block, onChange, onKeyDown }) {
  return (
    <div className="relative group my-4">
      <input
        type="text"
        value={block.content}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Write a heading..."
        className="w-full text-3xl font-bold px-3 py-2 border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
    </div>
  );
}
