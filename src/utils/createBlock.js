import { generateId } from "./generateId";

// Width presets for 1, 2, 3-column layouts
const WIDTH_PRESETS = {
  1: ["100%"],
  2: ["50%", "50%"],
  3: ["33.33%", "33.33%", "33.33%"],
};

// Set of valid text-based types
const TEXT_BLOCKS = new Set([
  "paragraph",
  "quote",
  "heading1",
  "heading2",
  "heading3",
  "heading4",
  "heading5",
  "heading6",
]);

export function createBlock(type, content = "", options = {}) {
  const id = generateId();

  switch (type) {
    case "group":
      return {
        id,
        type,
        layout: options.layout || "vertical",
        children: [],
      };

    case "column":
      return {
        id,
        type,
        width: options.width || "100%",
        blocks: options.blocks || [],
      };

    case "columns": {
      const count = Math.max(1, Math.min(3, options.count || 2));
      const widths = WIDTH_PRESETS[count] || WIDTH_PRESETS[2];

      const columns = Array.from({ length: count }, (_, i) => ({
        width: widths[i] || "100%",
        blocks: options.empty
          ? []
          : [createBlock("paragraph", `Column ${i + 1} content`)],
      }));

      return {
        id,
        type,
        columns,
      };
    }

    default:
      if (TEXT_BLOCKS.has(type)) {
        return {
          id,
          type,
          content,
        };
      }

      return {
        id,
        type,
        ...options,
      };
  }
}
