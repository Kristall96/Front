export const wrapSelectionWithTag = (tagName = "span", className = "") => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  if (range.collapsed) return;

  const selectedText = range.toString();
  if (!selectedText.trim()) return;

  const newClasses = className.trim().split(/\s+/);
  const alignmentClasses = ["text-left", "text-center", "text-right"];

  // Check if selected content is already inside an element
  const container = range.commonAncestorContainer;
  const parentElement =
    container.nodeType === 3 ? container.parentElement : container;

  // If already wrapped in the target tag (like <div>), just toggle the class
  if (
    parentElement &&
    parentElement.tagName.toLowerCase() === tagName.toLowerCase()
  ) {
    const existing = new Set(parentElement.className.trim().split(/\s+/));

    // Remove conflicting alignment classes
    alignmentClasses.forEach((cls) => existing.delete(cls));

    newClasses.forEach((cls) => {
      if (existing.has(cls)) {
        existing.delete(cls);
      } else {
        existing.add(cls);
      }
    });

    parentElement.className = Array.from(existing).join(" ");
    return;
  }

  // Else wrap the selection
  const wrapper = document.createElement(tagName);
  wrapper.classList.add(...newClasses);

  const extracted = range.extractContents();
  wrapper.appendChild(extracted);
  range.insertNode(wrapper);

  // Reposition cursor after wrapper
  const newRange = document.createRange();
  newRange.setStartAfter(wrapper);
  newRange.collapse(true);
  selection.removeAllRanges();
  selection.addRange(newRange);
};
