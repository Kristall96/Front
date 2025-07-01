// // utils/richText/insertLink.js
import { wrapSelectionWithAttributes } from "./wrapSelectionWithAttributes";

export const insertLink = () => {
  const href = prompt("Enter URL (https://...)");
  if (!href || !/^https?:\/\//.test(href)) return alert("Invalid URL");

  wrapSelectionWithAttributes("a", {
    href,
    target: "_blank",
    rel: "noopener noreferrer",
  });
};
