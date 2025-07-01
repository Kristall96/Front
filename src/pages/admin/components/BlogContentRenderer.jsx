// components/BlogContentRenderer.jsx
import React from "react";

export default function BlogContentRenderer({ blocks }) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      {blocks.map((block) => renderBlock(block))}
    </div>
  );
}

function renderBlock(block) {
  switch (block.type) {
    case "heading1":
      return <h1 key={block.id}>{block.content}</h1>;
    case "heading2":
      return <h2 key={block.id}>{block.content}</h2>;
    case "heading3":
      return <h3 key={block.id}>{block.content}</h3>;
    case "heading4":
      return <h4 key={block.id}>{block.content}</h4>;
    case "heading5":
      return <h5 key={block.id}>{block.content}</h5>;
    case "heading6":
      return <h6 key={block.id}>{block.content}</h6>;
    case "paragraph":
      return <p key={block.id}>{block.content}</p>;
    case "quote":
      return <blockquote key={block.id}>{block.content}</blockquote>;
    case "divider":
      return <hr key={block.id} />;
    case "image":
      return (
        <div key={block.id} className="my-4">
          <img src={block.url} alt={block.alt || "Image"} className="rounded" />
        </div>
      );
    case "code":
      return (
        <pre
          key={block.id}
          className="bg-gray-900 text-white rounded p-4 overflow-auto"
        >
          <code>{block.content}</code>
        </pre>
      );
    case "group":
      return (
        <div key={block.id} className="flex flex-col gap-4">
          {block.children.map(renderBlock)}
        </div>
      );
    case "columns":
      return (
        <div key={block.id} className="flex flex-wrap gap-4">
          {block.columns.map((col, idx) => (
            <div
              key={idx}
              style={{ width: col.width || "100%" }}
              className="min-w-[10%]"
            >
              {col.blocks?.map(renderBlock)}
            </div>
          ))}
        </div>
      );
    default:
      return null;
  }
}
