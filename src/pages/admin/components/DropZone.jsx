export default function DropZone({
  onDrop,
  onDragEnter,
  onDragLeave,
  isActive,
}) {
  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={(e) => {
        e.preventDefault();
        onDragEnter?.(e);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        onDragLeave?.(e);
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDrop?.(e);
      }}
      className="relative h-6 my-2 select-none"
    >
      <div
        className={`w-full h-full border border-dashed rounded-md flex items-center justify-center text-xs font-medium transition-colors duration-150 ${
          isActive
            ? "border-cyan-400 bg-cyan-900/10 text-cyan-300 custom-pulse"
            : "border-transparent text-transparent"
        } pointer-events-none`}
      >
        📦 Drop block here
      </div>
    </div>
  );
}
