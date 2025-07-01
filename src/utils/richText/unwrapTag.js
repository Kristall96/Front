// utils/richText/unwrapTag.js
// 🔁 Unwrap specific tag and preserve cursor
export const unwrapTag = (tagName) => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;
  const range = selection.getRangeAt(0);
  const node = range.commonAncestorContainer;

  let parent = node.nodeType === 3 ? node.parentNode : node;
  while (parent && parent.nodeName.toLowerCase() !== tagName.toLowerCase()) {
    parent = parent.parentNode;
  }
  if (parent && parent.nodeName.toLowerCase() === tagName.toLowerCase()) {
    const fragment = document.createDocumentFragment();
    const childNodes = Array.from(parent.childNodes);
    childNodes.forEach((child) => fragment.appendChild(child));

    const newRange = document.createRange();
    newRange.setStartBefore(childNodes[0]);
    newRange.setEndAfter(childNodes[childNodes.length - 1]);

    parent.replaceWith(fragment);

    selection.removeAllRanges();
    selection.addRange(newRange);
  }
};
