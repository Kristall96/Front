import { generateId } from "./generateId";

// Width presets for 1, 2, 3-column layouts
const WIDTH_PRESETS = {
  1: ["100%"],
  2: ["50%", "50%"],
  3: ["33.33%", "33.33%", "33.33%"],
};

export function createBlock(type, content = "", options = {}) {
  const id = generateId();

  switch (type) {
    case "group":
      return {
        id,
        type,
        layout: options.layout || "vertical", // or "flex"
        children: [],
      };

    case "column":
      return {
        id,
        type,
        width: options.width || "100%",
        blocks: options.blocks || [], // Allows any type, including nested layouts
      };

    case "columns": {
      const count = Math.max(1, Math.min(3, options.count || 2));
      const widths = WIDTH_PRESETS[count] || WIDTH_PRESETS[2];

      const columns = Array.from({ length: count }, (_, i) => ({
        width: widths[i] || "100%",
        blocks: options.empty
          ? []
          : [
              // Optional: default content can be disabled via `empty: true`
              createBlock("paragraph", `Column ${i + 1} content`),
            ],
      }));

      return {
        id,
        type,
        columns,
      };
    }

    default:
      return {
        id,
        type,
        content,
        ...(options.children ? { children: options.children } : {}),
      };
  }
}
