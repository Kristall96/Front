// /utils/richText/toggleSelectionWithTag.js
import { clearFormatting } from "./clearFormatting";
import { wrapSelectionWithTag } from "./wrapSelectionWithTag";
import { isTagActive } from "./isTagActive";

export const toggleSelectionWithTag = (tagName, classInput = "") => {
  // Normalize classInput to a string
  let className = "";

  if (typeof classInput === "string") {
    className = classInput;
  } else if (
    classInput &&
    typeof classInput === "object" &&
    "class" in classInput
  ) {
    className = classInput.class;
  }

  if (isTagActive(tagName)) {
    clearFormatting();
  } else {
    wrapSelectionWithTag(tagName, className);
  }
};
