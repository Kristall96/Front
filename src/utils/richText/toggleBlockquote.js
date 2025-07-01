// /utils/richText/toggleBlockquote.js
import { toggleSelectionWithTag } from "./toggleSelectionWithTag";

export const toggleBlockquote = () => {
  toggleSelectionWithTag(
    "blockquote",
    "border-l-4 border-gray-400 pl-4 italic text-gray-700"
  );
};
