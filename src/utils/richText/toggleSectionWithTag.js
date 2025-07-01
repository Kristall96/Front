// utils/richText/toogleSectionWithTag.js
import { isTagActive } from "./isTagActive";

// 🔨 Smart toggle list
import { toggleSelectionWithTag } from "./toggleSelectionWithTag"; // make sure this import exists if using modular
import { unwrapTag } from "./unwrapTag";
export const toggleList = (type = "ul") => {
  const tag = type === "ol" ? "ol" : "ul";
  const active = isTagActive(tag);
  if (active) unwrapTag(tag);
  else
    toggleSelectionWithTag(
      tag,
      tag === "ul" ? "list-disc pl-6" : "list-decimal pl-6"
    );
};
