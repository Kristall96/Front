// admin/components/blocks/DividerBlock.jsx
export default function DividerBlock({ onDelete }) {
  return (
    <div className="relative group py-6 flex items-center justify-center">
      {/* Left line */}
      <hr className="flex-grow border-t-2 border-gray-300" />

      {/* Label */}
      <span className="mx-4 text-xs text-gray-400 uppercase tracking-widest select-none">
        Divider
      </span>

      {/* Right line */}
      <hr className="flex-grow border-t-2 border-gray-300" />

      {/* Delete button */}
      <button
        type="button"
        onClick={onDelete}
        className="absolute right-2 -top-3 text-red-500 hover:text-red-700 hidden group-hover:block"
        title="Remove divider"
      >
        ✕
      </button>
    </div>
  );
}
