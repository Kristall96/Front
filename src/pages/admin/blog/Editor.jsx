// ✅ Fully functional rich text Editor with preview mode
// ✅ Supports bold, italic, underline, strikethrough, heading, list, image, link formatting
import { useState, useRef, useEffect } from "react";
import BlockRenderer from "../components/BlockRenderer";
import SlashCommandMenu from "../components/SlashCommandMenu";
import BlockSidebar from "../components/BlockSidebar";

const createId = () => Date.now().toString() + Math.floor(Math.random() * 1000);

export default function Editor({ onSave }) {
  const editorRef = useRef(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState("draft");
  const [previewMode, setPreviewMode] = useState(false);
  const [dropIndex, setDropIndex] = useState(null);

  const [blocks, setBlocks] = useState([
    { id: createId(), type: "richtext", content: "" },
  ]);
  const [slashMenu, setSlashMenu] = useState({
    visible: false,
    index: null,
    position: {},
  });
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    setSlug(
      title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
    );
  }, [title]);

  const pushHistory = (newBlocks) => {
    const updatedHistory = [...history.slice(0, historyIndex + 1), newBlocks];
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex((i) => i - 1);
      setBlocks(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((i) => i + 1);
      setBlocks(history[historyIndex + 1]);
    }
  };

  const updateBlock = (id, changes) => {
    const updated = blocks.map((b) => (b.id === id ? { ...b, ...changes } : b));
    setBlocks(updated);
    pushHistory(updated);
  };

  const insertBlock = (type, index) => {
    const newBlock = {
      id: createId(),
      type,
      content: type === "image" ? {} : "",
    };
    const updated = [...blocks];
    updated.splice(index, 0, newBlock); // ✅ Corrected here
    setBlocks(updated);
    pushHistory(updated);
    setSlashMenu({ visible: false, index: null, position: {} });
  };

  const deleteBlock = (id) => {
    if (blocks.length === 1) return;
    const updated = blocks.filter((b) => b.id !== id);
    setBlocks(updated);
    pushHistory(updated);
  };

  const moveBlock = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= blocks.length) return;
    const updated = [...blocks];
    [updated[index], updated[target]] = [updated[target], updated[index]];
    setBlocks(updated);
    pushHistory(updated);
  };

  const handleKeyDown = (e, block, index) => {
    if (e.key === "/") {
      setTimeout(() => {
        const el = e.target;
        if (el.textContent === "/") {
          const rect = el.getBoundingClientRect();
          setSlashMenu({
            visible: true,
            index,
            position: {
              top: rect.top + window.scrollY + 30,
              left: rect.left + 10,
            },
          });
        }
      }, 0);
    } else if (e.key === "Escape") {
      setSlashMenu({ visible: false, index: null, position: {} });
    }
  };

  useEffect(() => {
    pushHistory(blocks);
  }, []);

  const handleSave = () => {
    const cleanedBlocks = blocks.map((block) => ({
      type: block.type,
      content: block.content,
    }));

    const payload = {
      title: title.trim(),
      slug,
      status,
      blocks: cleanedBlocks,
    };

    console.log("🔍 Final Payload:", payload);
    onSave(payload);
  };

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-white">
      <BlockSidebar />

      <div
        className="flex-1 overflow-y-auto relative p-8 bg-[#1e293b] border border-slate-700 rounded-xl shadow-2xl max-w-[calc(100%-18rem)] mx-auto"
        ref={editorRef}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const type = e.dataTransfer.getData("blockType");

          if (type) {
            const index = dropIndex !== null ? dropIndex : blocks.length;

            insertBlock(type, index);
            setDropIndex(null); // reset
          }
        }}
      >
        <div className="mb-8">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title..."
            className="w-full text-4xl font-bold outline-none bg-transparent border-b border-gray-600 text-white placeholder-gray-400 p-2"
          />
          <p className="text-sm text-gray-400 mt-1">
            Slug:{" "}
            <code className="text-blue-400">{slug || "auto-generated"}</code>
          </p>
        </div>

        <div className="mb-4 flex items-center gap-4">
          <label className="font-medium">Status:</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-gray-600 bg-[#1e293b] text-white px-2 py-1 rounded"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="scheduled">Scheduled</option>
          </select>
          <button
            onClick={() => setPreviewMode((p) => !p)}
            className="ml-auto px-4 py-2 border border-blue-600 rounded hover:bg-blue-800"
          >
            {previewMode ? "🔧 Edit Mode" : "👁️ Preview Mode"}
          </button>
        </div>

        <div className="mb-6 flex gap-2">
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className="px-4 py-2 border border-gray-600 rounded disabled:opacity-40 hover:bg-gray-700"
          >
            ↶ Undo
          </button>
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="px-4 py-2 border border-gray-600 rounded disabled:opacity-40 hover:bg-gray-700"
          >
            ↷ Redo
          </button>
        </div>

        <article className="space-y-8">
          {blocks.map((block, index) => (
            <div key={block.id}>
              {/* Drop zone before each block */}
              {!previewMode && (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDropIndex(index);
                  }}
                  onDragLeave={() => setDropIndex(null)}
                  onDrop={(e) => {
                    const type = e.dataTransfer.getData("blockType");
                    if (type) {
                      insertBlock(type, index); // ✅ Use `index` directly
                      setDropIndex(null);
                    }
                  }}
                  className="h-4 flex items-center justify-center"
                >
                  {dropIndex === index && (
                    <div className="h-1 w-full bg-blue-500 rounded-sm shadow-md animate-pulse" />
                  )}
                </div>
              )}

              {/* The actual block */}
              <div className="relative group">
                <BlockRenderer
                  block={block}
                  readOnly={previewMode}
                  onChange={(val) => updateBlock(block.id, { content: val })}
                  onKeyDown={(e) => handleKeyDown(e, block, index)}
                  onDelete={() => deleteBlock(block.id)}
                />

                {!previewMode && (
                  <div className="absolute -left-8 top-3 flex flex-col gap-1 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => moveBlock(index, -1)}
                      className="text-sm"
                    >
                      ⬆️
                    </button>
                    <button
                      onClick={() => moveBlock(index, 1)}
                      className="text-sm"
                    >
                      ⬇️
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Final drop zone at the end */}
          {!previewMode && (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDropIndex(blocks.length);
              }}
              onDragLeave={() => setDropIndex(null)}
              onDrop={(e) => {
                const type = e.dataTransfer.getData("blockType");
                if (type) {
                  insertBlock(type, blocks.length - 1); // insert at the end
                  setDropIndex(null);
                }
              }}
              className="h-4 flex items-center justify-center"
            >
              {dropIndex === blocks.length && (
                <div className="h-1 w-full bg-blue-500 rounded-sm shadow-md animate-pulse" />
              )}
            </div>
          )}
        </article>

        {/* Final drop zone at end */}

        <button
          onClick={handleSave}
          className="mt-10 px-6 py-3 bg-green-600 text-white rounded text-base hover:bg-green-700 shadow"
        >
          💾 Save Post
        </button>

        {slashMenu.visible && (
          <SlashCommandMenu
            position={slashMenu.position}
            onSelect={(type) => {
              if (type) {
                insertBlock(type, slashMenu.index);
              } else {
                // Optional: remove empty block if it was inserted just to trigger /
                const block = blocks[slashMenu.index];
                if (block && block.content === "") {
                  deleteBlock(block.id);
                }
              }

              setSlashMenu({
                visible: false,
                index: null,
                position: { top: 0, left: 0 },
              });
            }}
          />
        )}
      </div>
    </div>
  );
}
