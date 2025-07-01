// /utils/richText/toggleParagraph.js
import { toggleSelectionWithTag } from "./toggleSelectionWithTag";

export const toggleParagraph = () => {
  toggleSelectionWithTag("p", "text-base leading-relaxed mb-3");
};
