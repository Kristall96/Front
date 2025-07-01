// /utils/richText/toggleHeading.js
import { toggleSelectionWithTag } from "./toggleSelectionWithTag";

export const toggleHeading = (level = 1) => {
  const classMap = {
    1: "text-3xl font-bold",
    2: "text-2xl font-semibold",
    3: "text-xl font-medium",
    4: "text-lg font-medium",
    5: "text-base font-semibold",
    6: "text-sm font-semibold text-gray-600",
  };

  toggleSelectionWithTag("h" + level, { class: classMap[level] || "text-lg" });
};
