// /pages/admin/blog/RichTextEditor.jsx
import React, { useRef, useState, useEffect } from "react";
import { EditorToolbar } from "./EditorToolbar";
import {
  createHistoryManager,
  getSelectionRange,
  restoreSnapshot,
} from "../../../utils/richText/useHistory";

const history = createHistoryManager();

const RichTextEditor = () => {
  const editorRef = useRef(null);
  const [, forceUpdate] = useState(0);

  const saveState = () => {
    if (!editorRef.current) return;
    const selection = getSelectionRange(editorRef.current);
    history.save(editorRef.current.innerHTML, selection);
  };

  const handleUndo = () => {
    const prev = history.undo();
    if (prev && editorRef.current) {
      restoreSnapshot(editorRef.current, prev);
      forceUpdate((x) => x + 1);
    }
  };

  const handleRedo = () => {
    const next = history.redo();
    if (next && editorRef.current) {
      restoreSnapshot(editorRef.current, next);
      forceUpdate((x) => x + 1);
    }
  };

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const observer = new MutationObserver(() => {
      saveState();
    });

    observer.observe(editor, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    saveState();
    return () => observer.disconnect();
  }, []);

  return (
    <div className="space-y-4">
      <EditorToolbar
        editorRef={editorRef}
        onUndo={handleUndo}
        onRedo={handleRedo}
      />
      <div
        ref={editorRef}
        contentEditable
        className="min-h-[300px] border p-4 bg-white text-slate-800 rounded shadow-sm prose focus:outline-none"
      />
    </div>
  );
};

export default RichTextEditor;
