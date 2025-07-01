// /utils/richText/toggleList.js
import { isTagActive } from "./isTagActive";
import { unwrapTag } from "./unwrapTag";
import { toggleSelectionWithTag } from "./toggleSelectionWithTag";

// 🔨 Smart toggle list
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
