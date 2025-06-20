import { useState } from "react";
import ParagraphBlock from "./blocks/ParagraphBlock";
import HeadingBlock from "./blocks/HeadingBlock";
import QuoteBlock from "./blocks/QuoteBlock";
import ImageBlock from "./blocks/ImageBlock";
import CodeBlock from "./blocks/CodeBlock";
import DividerBlock from "./blocks/DividerBlock";
import RichTextBlock from "./blocks/RichTextBlock";
import GroupBlock from "./blocks/GroupBlock";
import ColumnBlock from "./blocks/ColumnBlock";
import { createBlock } from "../../../utils/createBlock";

function DropZone({ onDrop, onDragEnter, onDragLeave, isActive }) {
  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={(e) => {
        e.preventDefault();
        onDragEnter?.();
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        onDragLeave?.();
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDrop?.(e);
      }}
      className="relative h-6 my-1 select-none"
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

export default function BlockRenderer({
  block,
  onChange,
  onKeyDown,
  onDelete,
  readOnly = false,
}) {
  const commonProps = { block, onChange, onDelete, onKeyDown, readOnly };
  const [dropIndexes, setDropIndexes] = useState({});

  const setDropIndex = (colIdx, index) => {
    setDropIndexes((prev) => ({ ...prev, [colIdx]: index }));
  };

  const startResize = (e, colIdx, block, onChange) => {
    e.preventDefault();
    const startX = e.clientX;
    const container = e.target.closest(".columns-container");
    const colEls = container.querySelectorAll(".column-block");
    const leftCol = colEls[colIdx];
    const rightCol = colEls[colIdx + 1];
    const leftStart = leftCol.getBoundingClientRect().width;
    const rightStart = rightCol.getBoundingClientRect().width;
    const totalWidth = leftStart + rightStart;

    const handleMouseMove = (moveEvent) => {
      const delta = moveEvent.clientX - startX;
      let newLeft = ((leftStart + delta) / totalWidth) * 100;
      newLeft = Math.max(10, Math.min(90, newLeft));
      const newRight = 100 - newLeft;
      const updated = { ...block, columns: [...block.columns] };
      updated.columns[colIdx].width = `${newLeft.toFixed(2)}%`;
      updated.columns[colIdx + 1].width = `${newRight.toFixed(2)}%`;
      onChange(updated);
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  switch (block.type) {
    case "group":
      return <GroupBlock {...commonProps} />;

    case "column":
      return <ColumnBlock {...commonProps} />;

    case "columns":
      return (
        <div className="columns-container flex w-full gap-0 p-4 border border-slate-600 rounded-md bg-slate-800">
          {block.columns.map((col, colIdx) => {
            const width = col.width || `${100 / block.columns.length}%`;
            const blocksInCol = col.blocks || [];

            return (
              <div
                key={colIdx}
                className="relative flex items-stretch"
                style={{ width }}
              >
                <div className="column-block flex flex-col gap-1 border border-slate-500 p-3 rounded w-full min-w-[10%] transition-all">
                  {!readOnly && (
                    <div className="text-xs text-blue-400 font-mono mb-1">
                      📦 Column {colIdx + 1} — {width}
                    </div>
                  )}

                  {blocksInCol.map((childBlock, blockIdx) => (
                    <div key={childBlock.id}>
                      <DropZone
                        isActive={dropIndexes[colIdx] === blockIdx}
                        onDragEnter={() => setDropIndex(colIdx, blockIdx)}
                        onDragLeave={() => setDropIndex(colIdx, null)}
                        onDrop={(e) => {
                          e.preventDefault();
                          const newType = e.dataTransfer.getData("block-type");
                          const updated = [...block.columns];

                          if (newType) {
                            const newBlock = createBlock(newType);
                            updated[colIdx].blocks.splice(
                              dropIndexes[colIdx] ??
                                updated[colIdx].blocks.length,
                              0,
                              newBlock
                            );
                            onChange({ ...block, columns: updated });
                            setDropIndex(colIdx, null);
                            return;
                          }

                          const draggedId = e.dataTransfer.getData("block-id");
                          const fromColIdx = parseInt(
                            e.dataTransfer.getData("column-index"),
                            10
                          );
                          const fromBlockIdx = parseInt(
                            e.dataTransfer.getData("block-index"),
                            10
                          );
                          if (!draggedId) return;

                          const draggedBlock = updated[
                            fromColIdx
                          ].blocks.splice(fromBlockIdx, 1)[0];
                          updated[colIdx].blocks.splice(
                            dropIndexes[colIdx] ??
                              updated[colIdx].blocks.length,
                            0,
                            draggedBlock
                          );
                          onChange({ ...block, columns: updated });
                          setDropIndex(colIdx, null);
                        }}
                      />

                      <div
                        className="relative group border border-slate-600 rounded px-2 py-2"
                        draggable={!readOnly}
                        onDragStart={(e) => {
                          e.dataTransfer.setData("block-id", childBlock.id);
                          e.dataTransfer.setData("column-index", colIdx);
                          e.dataTransfer.setData("block-index", blockIdx);
                        }}
                      >
                        {!readOnly && (
                          <div className="absolute -top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition z-10">
                            <button
                              title="Drag"
                              draggable
                              onDragStart={(e) => {
                                e.stopPropagation();
                                e.dataTransfer.setData(
                                  "block-id",
                                  childBlock.id
                                );
                                e.dataTransfer.setData("column-index", colIdx);
                                e.dataTransfer.setData("block-index", blockIdx);
                              }}
                              className="text-gray-300 bg-gray-700 hover:bg-gray-600 rounded cursor-grab px-1 py-1 text-lg leading-none rotate-90"
                            >
                              ⠿
                            </button>
                          </div>
                        )}

                        <BlockRenderer
                          block={childBlock}
                          readOnly={readOnly}
                          onKeyDown={onKeyDown}
                          onDelete={(id) => {
                            const updated = [...block.columns];
                            updated[colIdx].blocks = updated[
                              colIdx
                            ].blocks.filter((b) => b.id !== id);
                            onChange({ ...block, columns: updated });
                          }}
                          onChange={(val) => {
                            const updated = [...block.columns];
                            updated[colIdx].blocks = updated[colIdx].blocks.map(
                              (b) => (b.id === val.id ? val : b)
                            );
                            onChange({ ...block, columns: updated });
                          }}
                        />

                        {!readOnly && (
                          <button
                            onClick={() => {
                              const updated = [...block.columns];
                              updated[colIdx].blocks = updated[
                                colIdx
                              ].blocks.filter((b) => b.id !== childBlock.id);
                              onChange({ ...block, columns: updated });
                            }}
                            className="absolute top-1 right-1 text-xs text-red-400 bg-slate-900 px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition"
                            title="Delete block"
                          >
                            ❌
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {!readOnly && (
                    <DropZone
                      isActive={dropIndexes[colIdx] === blocksInCol.length}
                      onDragEnter={() =>
                        setDropIndex(colIdx, blocksInCol.length)
                      }
                      onDragLeave={() => setDropIndex(colIdx, null)}
                      onDrop={(e) => {
                        e.preventDefault();
                        const newType = e.dataTransfer.getData("block-type");
                        const updated = [...block.columns];

                        if (newType) {
                          const newBlock = createBlock(newType);
                          updated[colIdx].blocks.splice(
                            dropIndexes[colIdx] ??
                              updated[colIdx].blocks.length,
                            0,
                            newBlock
                          );
                          onChange({ ...block, columns: updated });
                          setDropIndex(colIdx, null);
                          return;
                        }

                        const draggedId = e.dataTransfer.getData("block-id");
                        const fromColIdx = parseInt(
                          e.dataTransfer.getData("column-index"),
                          10
                        );
                        const fromBlockIdx = parseInt(
                          e.dataTransfer.getData("block-index"),
                          10
                        );
                        if (!draggedId) return;

                        const draggedBlock = updated[fromColIdx].blocks.splice(
                          fromBlockIdx,
                          1
                        )[0];
                        updated[colIdx].blocks.splice(
                          dropIndexes[colIdx] ?? updated[colIdx].blocks.length,
                          0,
                          draggedBlock
                        );
                        onChange({ ...block, columns: updated });
                        setDropIndex(colIdx, null);
                      }}
                    />
                  )}

                  {!readOnly && (
                    <select
                      className="mt-2 text-xs bg-slate-900 text-white border border-slate-700 rounded p-1"
                      value={width}
                      onChange={(e) => {
                        const updated = [...block.columns];
                        updated[colIdx].width = e.target.value;
                        onChange({ ...block, columns: updated });
                      }}
                    >
                      <option value="100%">100%</option>
                      <option value="75%">75%</option>
                      <option value="66.66%">66.66%</option>
                      <option value="50%">50%</option>
                      <option value="33.33%">33.33%</option>
                      <option value="25%">25%</option>
                    </select>
                  )}
                </div>

                {!readOnly && colIdx < block.columns.length - 1 && (
                  <div
                    onMouseDown={(e) => startResize(e, colIdx, block, onChange)}
                    className="w-1 cursor-col-resize bg-blue-500 opacity-0 hover:opacity-60 transition"
                    title="Resize between columns"
                  />
                )}
              </div>
            );
          })}
        </div>
      );

    case "heading":
      return <HeadingBlock {...commonProps} />;
    case "quote":
      return <QuoteBlock {...commonProps} />;
    case "image":
      return <ImageBlock {...commonProps} />;
    case "code":
      return <CodeBlock {...commonProps} />;
    case "divider":
      return <DividerBlock onDelete={onDelete} />;
    case "richtext":
      return <RichTextBlock {...commonProps} />;
    case "paragraph":
    default:
      return <ParagraphBlock {...commonProps} />;
  }
}
