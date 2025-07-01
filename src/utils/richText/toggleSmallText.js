// ✅ /utils/richText/toggleSmallText.js
import { wrapSelectionWithTag } from "./wrapSelectionWithTag";

export const toggleSmallText = () =>
  wrapSelectionWithTag("span", "text-xs text-gray-600");
