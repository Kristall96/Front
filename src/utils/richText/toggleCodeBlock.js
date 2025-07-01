// /utils/richText/toggleCodeBlock.js
import { toggleSelectionWithTag } from "./toggleSelectionWithTag";

export const toggleCodeBlock = () => {
  toggleSelectionWithTag(
    "pre",
    "bg-gray-100 p-2 rounded text-sm font-mono whitespace-pre-wrap"
  );
};
