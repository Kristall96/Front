// utils/richText/selectionUtils.js
export const saveSelection = () => {
  const selection = window.getSelection();
  if (!selection.rangeCount) return null;
  return selection.getRangeAt(0).cloneRange();
};

export const restoreSelection = (savedRange) => {
  if (!savedRange) return;
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(savedRange);
};
