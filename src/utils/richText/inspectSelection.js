// // utils/richText/inspectSelection.js
// 🧪 Selection inspector
export const inspectSelection = () => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;
  const node = selection.focusNode;
  const path = [];
  let current = node;
  while (current && current !== document.body) {
    if (current.nodeType === 1) {
      path.unshift(
        `${current.nodeName.toLowerCase()}.${[...current.classList].join(".")}`
      );
    }
    current = current.parentNode;
  }
  console.log("🔍 Selection Path:", path.join(" > "));
};
