// Text formatting toggles
export { toggleBold } from "./toggleBold";
export { toggleItalic } from "./toggleItalic";
export { toggleUnderline } from "./toggleUnderline";
export { toggleStrikethrough } from "./toggleStrikethrough";
export { toggleHighlight } from "./toggleHighlight";
export { toggleSuperscript } from "./toggleSuperscript";
export { toggleSubscript } from "./toggleSubscript";
export { toggleSmallText } from "./toggleSmallText";
export { toggleInlineCode } from "./toggleInlineCode";

// Block-level toggles
export { toggleHeading } from "./toggleHeading";
export { toggleParagraph } from "./toggleParagraph";
export { toggleBlockquote } from "./toggleBlockquote";
export { toggleCodeBlock } from "./toggleCodeBlock";
export { toggleList } from "./toggleList";
export { toggleAlignment } from "./toggleAlignment";

// Utility functions
export { inspectSelection } from "./inspectSelection";
export { removeLink } from "./removeLink";
export { clearFormatting } from "./clearFormatting";

// History and snapshots (optional if used elsewhere)
export {
  createHistoryManager,
  getSelectionRange,
  restoreSnapshot,
} from "./useHistory";

// You may also export postProcessEditorContent here for convenience:
export { postProcessEditorContent } from "./postProcessEditorContent";
