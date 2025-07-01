// // utils/richText/clearFormatting.js
export const clearFormatting = (tagName = null, className = null) => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;
  const range = selection.getRangeAt(0);
  if (range.collapsed) return;

  if (tagName === "*") {
    tagName = null;
    className = null;
  }

  const fragment = range.cloneContents();

  const cleanNode = (node) => {
    if (node.nodeType === 1) {
      const shouldRemove =
        (!tagName || node.nodeName.toLowerCase() === tagName.toLowerCase()) &&
        (!className || node.classList.contains(className));

      const span = document.createElement("span");
      span.textContent = node.textContent;

      if (shouldRemove) {
        return span;
      }

      const clone = document.createElement(node.nodeName.toLowerCase());
      Array.from(node.attributes).forEach((attr) =>
        clone.setAttribute(attr.name, attr.value)
      );

      node.childNodes.forEach((child) => {
        clone.appendChild(cleanNode(child));
      });
      return clone;
    }

    return node.cloneNode(true);
  };

  const cleaned = document.createDocumentFragment();
  fragment.childNodes.forEach((child) => cleaned.appendChild(cleanNode(child)));

  range.deleteContents();
  range.insertNode(cleaned);
};
