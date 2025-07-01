import { cleanRedundantSpans } from "./cleanSpans";

export const postProcessEditorContent = (editorRef) => {
  if (!editorRef?.current) return;
  cleanRedundantSpans(editorRef.current);
};
