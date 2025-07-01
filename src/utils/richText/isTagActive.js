// // utils/richText/isTagActive.js
// ✅ Improved isTagActive with tag + class detection
export const isTagActive = (tagName, className = "") => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return false;
  let node = selection.focusNode;
  while (node) {
    if (
      node.nodeType === 1 &&
      node.nodeName.toLowerCase() === tagName.toLowerCase()
    ) {
      if (!className || node.classList.contains(className)) return true;
    }
    node = node.parentNode;
  }
  return false;
};
