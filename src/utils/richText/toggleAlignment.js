// /utils/richText/toggleAlignment.js
import { toggleSelectionWithTag } from "./toggleSelectionWithTag";

export const toggleAlignment = (direction = "left") => {
  const classMap = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  toggleSelectionWithTag("div", { class: classMap[direction] });
};
