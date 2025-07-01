// utils/richText/useHistory.js
export const createHistoryManager = () => {
  const stack = [];
  let pointer = -1;

  const save = (content, selection) => {
    stack.splice(pointer + 1);
    stack.push({ content, selection });
    pointer = stack.length - 1;
  };

  const undo = () => {
    if (pointer > 0) {
      pointer--;
      return stack[pointer];
    }
    return null;
  };

  const redo = () => {
    if (pointer < stack.length - 1) {
      pointer++;
      return stack[pointer];
    }
    return null;
  };

  return { save, undo, redo };
};

export const getSelectionRange = (editor) => {
  const selection = window.getSelection();
  if (!selection.rangeCount) return null;
  const range = selection.getRangeAt(0);
  if (!editor.contains(range.startContainer)) return null;
  return {
    startOffset: range.startOffset,
    endOffset: range.endOffset,
    startContainerPath: getNodePath(editor, range.startContainer),
    endContainerPath: getNodePath(editor, range.endContainer),
  };
};

export const restoreSnapshot = (editor, { content, selection }) => {
  editor.innerHTML = content;
  if (selection) {
    const range = document.createRange();
    const startNode = resolveNodePath(editor, selection.startContainerPath);
    const endNode = resolveNodePath(editor, selection.endContainerPath);
    if (startNode && endNode) {
      range.setStart(startNode, selection.startOffset);
      range.setEnd(endNode, selection.endOffset);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }
};

const getNodePath = (root, node) => {
  const path = [];
  while (node !== root && node != null) {
    const parent = node.parentNode;
    if (!parent) break;
    const index = Array.from(parent.childNodes).indexOf(node);
    path.unshift(index);
    node = parent;
  }
  return path;
};

const resolveNodePath = (root, path) => {
  let node = root;
  for (let i of path) {
    if (!node || !node.childNodes[i]) return null;
    node = node.childNodes[i];
  }
  return node;
};
