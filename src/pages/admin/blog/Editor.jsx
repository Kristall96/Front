// // pages/admin/blog/Editor.jsx

// // ✅ Fully functional rich text Editor with preview mode
// // ✅ Supports bold, italic, underline, strikethrough, heading, list, image, link formatting

// import { useState, useRef, useEffect } from "react";
// import BlockRenderer from "../components/BlockRenderer";
// import SlashCommandMenu from "../components/SlashCommandMenu";
// import BlockSidebar from "../components/BlockSidebar.jsx";
// import { generateId } from "../../../utils/generateId.js";
// import DropZone from "../components/DropZone.jsx";
// import { createBlock } from "../../../utils/createBlock.js";
// import BlogContentRenderer from "../components/BlogContentRenderer"; // update path if needed

// const createId = () => generateId();

// export default function Editor({ onSave }) {
//   const editorRef = useRef(null);
//   const [title, setTitle] = useState("");
//   const [slug, setSlug] = useState("");
//   const [status, setStatus] = useState("draft");
//   const [previewMode, setPreviewMode] = useState(false);
//   const [dropIndex, setDropIndex] = useState(null);
//   const [draggingIndex, setDraggingIndex] = useState(null);

//   const [blocks, setBlocks] = useState([
//     { id: createId(), type: "richtext", content: "" },
//   ]);
//   const [slashMenu, setSlashMenu] = useState({
//     visible: false,
//     index: null,
//     position: {},
//   });
//   const [history, setHistory] = useState([]);
//   const [historyIndex, setHistoryIndex] = useState(-1);

//   useEffect(() => {
//     let scrollAnimation;

//     const handleAutoScroll = (e) => {
//       if (!editorRef.current) return;

//       const container = editorRef.current;
//       const { clientY } = e;
//       const bounds = container.getBoundingClientRect();
//       const edgeOffset = 80; // px from top/bottom
//       const scrollSpeed = 16;

//       const scrollTop = () => {
//         container.scrollBy(0, -scrollSpeed);
//         scrollAnimation = requestAnimationFrame(() => handleAutoScroll(e));
//       };

//       const scrollBottom = () => {
//         container.scrollBy(0, scrollSpeed);
//         scrollAnimation = requestAnimationFrame(() => handleAutoScroll(e));
//       };

//       // Top edge
//       if (clientY < bounds.top + edgeOffset) {
//         cancelAnimationFrame(scrollAnimation);
//         scrollTop();
//       }
//       // Bottom edge
//       else if (clientY > bounds.bottom - edgeOffset) {
//         cancelAnimationFrame(scrollAnimation);
//         scrollBottom();
//       } else {
//         cancelAnimationFrame(scrollAnimation);
//       }
//     };

//     const stopScroll = () => {
//       cancelAnimationFrame(scrollAnimation);
//     };

//     if (draggingIndex !== null) {
//       window.addEventListener("dragover", handleAutoScroll);
//       window.addEventListener("dragend", stopScroll);
//       window.addEventListener("drop", stopScroll);
//     }

//     return () => {
//       window.removeEventListener("dragover", handleAutoScroll);
//       window.removeEventListener("dragend", stopScroll);
//       window.removeEventListener("drop", stopScroll);
//       stopScroll();
//     };
//   }, [draggingIndex]);

//   useEffect(() => {
//     setSlug(
//       title
//         .toLowerCase()
//         .trim()
//         .replace(/[^a-z0-9 -]/g, "")
//         .replace(/\s+/g, "-")
//         .replace(/-+/g, "-")
//     );
//   }, [title]);

//   const pushHistory = (newBlocks) => {
//     const updatedHistory = [...history.slice(0, historyIndex + 1), newBlocks];
//     setHistory(updatedHistory);
//     setHistoryIndex(updatedHistory.length - 1);
//   };

//   const undo = () => {
//     if (historyIndex > 0) {
//       setHistoryIndex((i) => i - 1);
//       setBlocks(history[historyIndex - 1]);
//     }
//   };

//   const redo = () => {
//     if (historyIndex < history.length - 1) {
//       setHistoryIndex((i) => i + 1);
//       setBlocks(history[historyIndex + 1]);
//     }
//   };

//   const updateBlock = (id, updatedBlock) => {
//     const updated = blocks.map((b) => (b.id === id ? updatedBlock : b));
//     setBlocks(updated);
//     pushHistory(updated);
//   };

//   const insertBlock = (type, index) => {
//     const newBlock = createBlock(type);
//     const updated = [...blocks];
//     updated.splice(index, 0, newBlock);
//     setBlocks(updated);
//     pushHistory(updated);
//     setSlashMenu({ visible: false, index: null, position: {} });
//   };

//   const deleteBlock = (id) => {
//     if (blocks.length === 1) return;
//     const updated = blocks.filter((b) => b.id !== id);
//     setBlocks(updated);
//     pushHistory(updated);
//   };

//   const moveBlock = (index, direction) => {
//     const target = index + direction;
//     if (target < 0 || target >= blocks.length) return;
//     const updated = [...blocks];
//     [updated[index], updated[target]] = [updated[target], updated[index]];
//     setBlocks(updated);
//     pushHistory(updated);
//   };
//   const handleReorder = (index) => {
//     if (draggingIndex === null || draggingIndex === index) return;

//     const updated = [...blocks];
//     const [moved] = updated.splice(draggingIndex, 1);

//     // ⬇ Adjust for dragging down
//     const adjustedIndex = draggingIndex < index ? index - 1 : index;

//     updated.splice(adjustedIndex, 0, moved);

//     setBlocks(updated);
//     pushHistory(updated);
//     setDraggingIndex(null);
//     setDropIndex(null);
//   };

//   const handleKeyDown = (e, block, index) => {
//     if (e.key === "/") {
//       setTimeout(() => {
//         const el = e.target;
//         if (el.textContent === "/") {
//           const rect = el.getBoundingClientRect();
//           setSlashMenu({
//             visible: true,
//             index,
//             position: {
//               top: rect.top + window.scrollY + 30,
//               left: rect.left + 10,
//             },
//           });
//         }
//       }, 0);
//     } else if (e.key === "Escape") {
//       setSlashMenu({ visible: false, index: null, position: {} });
//     }
//   };

//   useEffect(() => {
//     pushHistory(blocks);
//   }, []);

//   const handleSave = () => {
//     const cleanedBlocks = blocks.map((block) => ({
//       type: block.type,
//       content: block.content,
//     }));

//     const payload = {
//       title: title.trim(),
//       slug,
//       status,
//       blocks: cleanedBlocks,
//     };

//     console.log("🔍 Final Payload:", payload);
//     onSave(payload);
//   };
//   const insertLayoutPreset = (presetBlocks, index = blocks.length) => {
//     const updated = [...blocks];
//     updated.splice(index, 0, ...presetBlocks);
//     setBlocks(updated);
//     pushHistory(updated);
//   };

//   return (
//     <div
//       className={`flex min-h-screen ${
//         previewMode ? "bg-white text-black" : "bg-[#0f172a] text-white"
//       }`}
//     >
//       {!previewMode && (
//         <BlockSidebar onInsertPreset={(blocks) => insertLayoutPreset(blocks)} />
//       )}

//       {/* 🔁 Toggle button stays in top right */}
//       <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded shadow-lg border border-slate-700">
//         <span className="text-sm font-semibold">
//           {previewMode ? "👁️ Preview Mode" : "✏️ Edit Mode"}
//         </span>
//         <div
//           onClick={() => setPreviewMode((p) => !p)}
//           className={`relative w-14 h-7 rounded-full cursor-pointer transition-all duration-500 ${
//             previewMode ? "bg-green-500" : "bg-pink-500"
//           } shadow-inner`}
//         >
//           <div
//             className={`absolute top-1 left-1 w-5 h-5 rounded-full transition-all duration-500 ease-in-out ${
//               previewMode
//                 ? "translate-x-7 bg-green-200 shadow-[0_0_10px_2px_rgba(34,197,94,0.5)]"
//                 : "translate-x-0 bg-pink-200 shadow-[0_0_10px_2px_rgba(244,114,182,0.4)]"
//             }`}
//           ></div>
//         </div>
//       </div>

//       <div
//         className={`flex-1 overflow-y-auto relative transition-all duration-300 ${
//           previewMode
//             ? "bg-white text-black p-0 border-none shadow-none rounded-none max-w-4xl mx-auto"
//             : "p-8 bg-[#1e293b] text-white border border-slate-700 rounded-xl shadow-2xl max-w-[calc(100%-18rem)] mx-auto"
//         }`}
//         ref={editorRef}
//         onDragOver={(e) => e.preventDefault()}
//         onDrop={(e) => {
//           e.preventDefault();
//           const type = e.dataTransfer.getData("blockType");
//           if (type) {
//             const index = dropIndex !== null ? dropIndex : blocks.length;
//             insertBlock(type, index);
//             setDropIndex(null);
//           }
//         }}
//       >
//         {!previewMode && (
//           <>
//             <div className="mb-8">
//               <input
//                 type="text"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 placeholder="Post title..."
//                 className="w-full text-4xl font-bold outline-none bg-transparent border-b border-gray-600 text-white placeholder-gray-400 p-2"
//               />
//               <p className="text-sm text-gray-400 mt-1">
//                 Slug:{" "}
//                 <code className="text-blue-400">
//                   {slug || "auto-generated"}
//                 </code>
//               </p>
//             </div>

//             <div className="mb-4 flex items-center gap-4">
//               <label className="font-medium">Status:</label>
//               <select
//                 value={status}
//                 onChange={(e) => setStatus(e.target.value)}
//                 className="border border-gray-600 bg-[#1e293b] text-white px-2 py-1 rounded"
//               >
//                 <option value="draft">Draft</option>
//                 <option value="published">Published</option>
//                 <option value="scheduled">Scheduled</option>
//               </select>
//             </div>

//             <div className="mb-6 flex gap-2">
//               <button
//                 onClick={undo}
//                 disabled={historyIndex <= 0}
//                 className="px-4 py-2 border border-gray-600 rounded disabled:opacity-40 hover:bg-gray-700"
//               >
//                 ↶ Undo
//               </button>
//               <button
//                 onClick={redo}
//                 disabled={historyIndex >= history.length - 1}
//                 className="px-4 py-2 border border-gray-600 rounded disabled:opacity-40 hover:bg-gray-700"
//               >
//                 ↷ Redo
//               </button>
//             </div>
//           </>
//         )}

//         {/* ✨ Actual content block area */}
//         <article
//           role="article"
//           aria-label="Post content"
//           className={`transition-all duration-300 ${
//             previewMode
//               ? "space-y-6 max-w-3xl mx-auto px-4 py-10 prose prose-lg prose-neutral"
//               : "space-y-2"
//           }`}
//         >
//           {blocks.map((block, index) => (
//             <div key={block.id}>
//               {!previewMode && (
//                 <DropZone
//                   isActive={dropIndex === index}
//                   onDrop={() => handleReorder(index)}
//                   onDragEnter={() => setDropIndex(index)}
//                   onDragLeave={() => setDropIndex(null)}
//                 />
//               )}

//               <div
//                 role="region"
//                 aria-label={`Content block ${index + 1}`}
//                 draggable={!previewMode}
//                 onDragStart={() => setDraggingIndex(index)}
//                 onDragEnd={() => {
//                   setDraggingIndex(null);
//                   setDropIndex(null);
//                 }}
//                 className={`relative group ${
//                   previewMode ? "" : "bg-slate-800 p-6 rounded-xl"
//                 }`}
//               >
//                 <BlockRenderer
//                   block={block}
//                   readOnly={previewMode}
//                   onChange={(val) => updateBlock(block.id, val)}
//                   onKeyDown={(e) => handleKeyDown(e, block, index)}
//                   onDelete={() => deleteBlock(block.id)}
//                 />

//                 {!previewMode && (
//                   <>
//                     {/* 🔼🔽 Drag controls */}
//                     <div className="absolute -left-8 top-1/2 -translate-y-1/2 flex flex-col gap-2 p-1 rounded-md bg-slate-800 shadow z-20 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity duration-200">
//                       <button
//                         onClick={() => moveBlock(index, -1)}
//                         title="Move block up"
//                         aria-label="Move block up"
//                         className="w-6 h-6 flex items-center justify-center text-white bg-gray-600 hover:bg-gray-500 rounded"
//                       >
//                         ↑
//                       </button>
//                       <button
//                         onClick={() => moveBlock(index, 1)}
//                         title="Move block down"
//                         aria-label="Move block down"
//                         className="w-6 h-6 flex items-center justify-center text-white bg-gray-600 hover:bg-gray-500 rounded"
//                       >
//                         ↓
//                       </button>
//                       <div
//                         title="Drag block"
//                         aria-label="Drag block"
//                         className="w-6 h-6 flex items-center justify-center text-gray-300 bg-gray-700 hover:bg-gray-600 rounded cursor-grab"
//                       >
//                         ⠿
//                       </div>
//                     </div>

//                     {/* ❌ Delete block */}
//                     <button
//                       onClick={() => deleteBlock(block.id)}
//                       title="Delete block"
//                       aria-label="Delete block"
//                       className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-sm text-red-400 bg-red-400/10 rounded-full opacity-0 group-hover:opacity-100 hover:text-white hover:bg-red-500 transition duration-150 ease-in-out"
//                     >
//                       ✕
//                     </button>
//                   </>
//                 )}
//               </div>
//             </div>
//           ))}

//           {!previewMode && (
//             <DropZone
//               isActive={dropIndex === blocks.length}
//               onDrop={() => handleReorder(blocks.length)}
//               onDragEnter={() => setDropIndex(blocks.length)}
//               onDragLeave={() => setDropIndex(null)}
//             />
//           )}
//         </article>

//         {!previewMode && (
//           <button
//             onClick={handleSave}
//             className="mt-10 px-6 py-3 bg-green-600 text-white rounded text-base hover:bg-green-700 shadow"
//           >
//             💾 Save Post
//           </button>
//         )}

//         {slashMenu.visible && (
//           <SlashCommandMenu
//             position={slashMenu.position}
//             onSelect={(type) => {
//               if (type) {
//                 insertBlock(type, slashMenu.index);
//               } else {
//                 const block = blocks[slashMenu.index];
//                 if (block && block.content === "") {
//                   deleteBlock(block.id);
//                 }
//               }

//               setSlashMenu({
//                 visible: false,
//                 index: null,
//                 position: { top: 0, left: 0 },
//               });
//             }}
//           />
//         )}
//       </div>
//     </div>
//   );
// }
