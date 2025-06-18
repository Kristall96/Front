// admin/components/blocks/QuoteBlock.jsx
export default function QuoteBlock({ block, onChange, onKeyDown }) {
  return (
    <div className="relative group border-l-4 border-gray-400 pl-4 bg-gray-50 rounded py-3 px-2">
      <textarea
        value={block.content}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Quote text..."
        className="w-full italic p-2 bg-transparent border-none resize-none focus:outline-none text-gray-700"
        rows={3}
      />
    </div>
  );
}
