import { useRef, useEffect, useState } from "react";

export default function ParagraphBlock({
  block,
  onChange,
  onKeyDown,
  onDelete,
}) {
  const ref = useRef(null);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPos, setToolbarPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (typeof block.content !== "string") {
      onChange("");
    }
  }, []);

  const handleInput = () => {
    onChange(ref.current?.innerHTML || "");
  };

  const handleSelection = () => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !ref.current.contains(sel.anchorNode)) {
      setShowToolbar(false);
      return;
    }

    const rect = sel.getRangeAt(0).getBoundingClientRect();
    setToolbarPos({
      top: rect.top + window.scrollY - 42,
      left: rect.left + window.scrollX,
    });
    setShowToolbar(true);
  };

  const format = (command) => {
    document.execCommand(command);
    onChange(ref.current?.innerHTML || "");
    ref.current?.focus();
  };

  return (
    <div className="relative group">
      {/* 🧰 Floating toolbar */}
      {showToolbar && (
        <div
          className="absolute z-50 bg-white shadow border rounded px-2 py-1 flex gap-2"
          style={{ top: toolbarPos.top, left: toolbarPos.left }}
        >
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => format("bold")}
          >
            <b>B</b>
          </button>
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => format("italic")}
          >
            <i>I</i>
          </button>
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => format("underline")}
          >
            <u>U</u>
          </button>
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => format("insertUnorderedList")}
          >
            • List
          </button>
        </div>
      )}

      {/* 📝 Rich text input */}
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        dangerouslySetInnerHTML={{ __html: block.content }}
        onInput={handleInput}
        onKeyDown={(e) => onKeyDown?.(e, block)}
        onMouseUp={handleSelection}
        onBlur={() => setTimeout(() => setShowToolbar(false), 100)} // Allow time to click toolbar
        className="w-full min-h-[100px] p-3 border rounded focus:outline-none whitespace-pre-wrap"
        placeholder="Start typing..."
        spellCheck
      />

      {/* ❌ Delete button */}
      <button
        onClick={onDelete}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700 hidden group-hover:block"
        title="Delete Block"
      >
        ✕
      </button>
    </div>
  );
}
