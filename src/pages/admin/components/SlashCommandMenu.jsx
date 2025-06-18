import { useEffect, useRef, useState } from "react";

const BLOCK_OPTIONS = [
  { type: "paragraph", label: "Text", desc: "Simple paragraph block" },
  { type: "richtext", label: "Rich Text", desc: "Advanced formatting block" },
  { type: "heading", label: "Heading", desc: "H1–H6 titles" },
  { type: "quote", label: "Quote", desc: "Stylized text block" },
  { type: "image", label: "Image", desc: "Upload or embed an image" },
  { type: "video", label: "Video", desc: "Embed a video (YouTube, etc.)" },
  { type: "code", label: "Code Block", desc: "Format preformatted code" },
  { type: "divider", label: "Divider", desc: "Horizontal line break" },
];

export default function SlashCommandMenu({ onSelect, position }) {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [query, setQuery] = useState("");
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const [dragPos, setDragPos] = useState(position);
  const [isDragging, setIsDragging] = useState(false);
  const [isReadyToDrag, setIsReadyToDrag] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const dragStart = useRef({ x: 0, y: 0 });

  const filteredOptions = BLOCK_OPTIONS.filter((opt) =>
    opt.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleDragStart = (e) => {
    // Calculate the offset relative to current dragPos
    dragOffset.current = {
      x: e.clientX - dragPos.left,
      y: e.clientY - dragPos.top,
    };

    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
    };

    setIsReadyToDrag(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isReadyToDrag && !isDragging) {
        const dx = Math.abs(e.clientX - dragStart.current.x);
        const dy = Math.abs(e.clientY - dragStart.current.y);
        if (dx > 4 || dy > 4) {
          setIsDragging(true);
        }
      }

      if (isDragging) {
        setDragPos({
          top: e.clientY - dragOffset.current.y,
          left: e.clientX - dragOffset.current.x,
        });
      }
    };

    const handleMouseUp = () => {
      setIsReadyToDrag(false);
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isReadyToDrag]);

  // Close on outside click
  useEffect(() => {
    inputRef.current?.focus();
    const handleClickOutside = (e) => {
      if (!containerRef.current?.contains(e.target)) {
        onSelect(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev + 1) % filteredOptions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex(
        (prev) => (prev - 1 + filteredOptions.length) % filteredOptions.length
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredOptions[focusedIndex]) {
        onSelect(filteredOptions[focusedIndex].type);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      onSelect(null);
    }
  };

  return (
    <div
      ref={containerRef}
      className="absolute z-50 w-72 max-w-[90vw] bg-white border border-gray-200 shadow-xl rounded-lg p-3 text-sm animate-fade-in"
      style={{
        top: dragPos.top,
        left: dragPos.left,
        cursor: isDragging ? "grabbing" : "default",
      }}
    >
      {/* Drag handle */}
      <div
        className="cursor-move text-gray-500 text-xs mb-2 select-none"
        onMouseDown={handleDragStart}
      >
        ⠿ Drag Menu
      </div>

      {/* Search input */}
      <input
        ref={inputRef}
        type="text"
        placeholder="Search blocks..."
        className="w-full px-3 py-2 mb-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring focus:border-blue-400"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setFocusedIndex(0);
        }}
        onKeyDown={handleKeyDown}
      />

      {/* Options */}
      {filteredOptions.length === 0 ? (
        <div className="px-3 py-2 text-gray-400 italic">No results</div>
      ) : (
        <ul className="space-y-1 max-h-64 overflow-y-auto">
          {filteredOptions.map((opt, index) => (
            <li
              key={opt.type}
              onClick={() => onSelect(opt.type)}
              className={`cursor-pointer px-3 py-2 rounded-md transition-colors ${
                index === focusedIndex
                  ? "bg-blue-100 text-blue-900"
                  : "hover:bg-gray-100"
              }`}
            >
              <div className="font-semibold text-sm">{opt.label}</div>
              <div className="text-xs text-gray-500">{opt.desc}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
