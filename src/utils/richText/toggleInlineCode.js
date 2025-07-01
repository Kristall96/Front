// /utils/richText/toggleInlineCode.js
import { toggleSelectionWithTag } from "./toggleSelectionWithTag";
export const toggleInlineCode = () =>
  toggleSelectionWithTag("code", "font-mono bg-gray-200 px-1 rounded text-sm");
