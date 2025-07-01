// /utils/richText/EditorToolbar.js
import {
  toggleBold,
  toggleItalic,
  toggleUnderline,
  toggleStrikethrough,
  toggleHighlight,
  toggleSuperscript,
  toggleSubscript,
  toggleSmallText,
  toggleInlineCode,
  toggleHeading,
  toggleParagraph,
  toggleBlockquote,
  toggleCodeBlock,
  toggleList,
  toggleAlignment,
  inspectSelection,
  removeLink,
  clearFormatting,
} from "../../../utils/richText";

import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaHighlighter,
  FaSuperscript,
  FaSubscript,
  FaCode,
  FaQuoteRight,
  FaListOl,
  FaListUl,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaHeading,
  FaParagraph,
} from "react-icons/fa";

import { postProcessEditorContent } from "../../../utils/richText/postProcessEditorContent"; // make sure this exists

export const EditorToolbar = ({ editorRef, onUndo, onRedo }) => {
  const handleAction = (fn) => () => {
    fn();
    if (editorRef?.current) postProcessEditorContent(editorRef);
  };

  return (
    <div className="flex flex-wrap gap-2 p-2 bg-slate-100 border rounded">
      <ToolbarButton
        icon={<FaBold />}
        onClick={handleAction(toggleBold)}
        title="Bold"
      />
      <ToolbarButton
        icon={<FaItalic />}
        onClick={handleAction(toggleItalic)}
        title="Italic"
      />
      <ToolbarButton
        icon={<FaUnderline />}
        onClick={handleAction(toggleUnderline)}
        title="Underline"
      />
      <ToolbarButton
        icon={<FaStrikethrough />}
        onClick={handleAction(toggleStrikethrough)}
        title="Strikethrough"
      />
      <ToolbarButton
        icon={<FaHighlighter />}
        onClick={handleAction(toggleHighlight)}
        title="Highlight"
      />
      <ToolbarButton
        icon={<FaSuperscript />}
        onClick={handleAction(toggleSuperscript)}
        title="Superscript"
      />
      <ToolbarButton
        icon={<FaSubscript />}
        onClick={handleAction(toggleSubscript)}
        title="Subscript"
      />
      <ToolbarButton
        icon={<span className="text-xs">aA</span>}
        onClick={handleAction(toggleSmallText)}
        title="Small Text"
      />
      <ToolbarButton
        icon={<FaCode />}
        onClick={handleAction(toggleInlineCode)}
        title="Inline Code"
      />

      {[1, 2, 3].map((level) => (
        <ToolbarButton
          key={level}
          icon={<FaHeading />}
          onClick={handleAction(() => toggleHeading(level))}
          title={`H${level}`}
        />
      ))}

      <ToolbarButton
        icon={<FaParagraph />}
        onClick={handleAction(toggleParagraph)}
        title="Paragraph"
      />
      <ToolbarButton
        icon={<FaQuoteRight />}
        onClick={handleAction(toggleBlockquote)}
        title="Blockquote"
      />
      <ToolbarButton
        icon={<FaCode />}
        onClick={handleAction(toggleCodeBlock)}
        title="Code Block"
      />
      <ToolbarButton
        icon={<FaListUl />}
        onClick={handleAction(() => toggleList("ul"))}
        title="Bullet List"
      />
      <ToolbarButton
        icon={<FaListOl />}
        onClick={handleAction(() => toggleList("ol"))}
        title="Numbered List"
      />

      <ToolbarButton
        icon={<FaAlignLeft />}
        onClick={handleAction(() => toggleAlignment("left"))}
        title="Align Left"
      />
      <ToolbarButton
        icon={<FaAlignCenter />}
        onClick={handleAction(() => toggleAlignment("center"))}
        title="Align Center"
      />
      <ToolbarButton
        icon={<FaAlignRight />}
        onClick={handleAction(() => toggleAlignment("right"))}
        title="Align Right"
      />

      <ToolbarButton
        icon={<span>🔍</span>}
        onClick={handleAction(inspectSelection)}
        title="Inspect Selection"
      />
      <ToolbarButton
        icon={<span>🔗✖️</span>}
        onClick={handleAction(removeLink)}
        title="Remove Link"
      />
      <ToolbarButton
        icon={<span>🧹</span>}
        onClick={handleAction(() => clearFormatting("*"))}
        title="Clear All Formatting"
      />
      <ToolbarButton icon={<span>↩️</span>} onClick={onUndo} title="Undo" />
      <ToolbarButton icon={<span>↪️</span>} onClick={onRedo} title="Redo" />
    </div>
  );
};

const ToolbarButton = ({ icon, onClick, title }) => (
  <button
    type="button"
    title={title}
    onClick={(e) => {
      e.preventDefault();
      onClick();
    }}
    className="flex items-center justify-center w-10 h-10 rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 active:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
  >
    {icon}
  </button>
);

// ✅ Toolbar actions now call postProcessEditorContent after changes
// 💡 Remember to pass editorRef and onUndo/onRedo from the parent rich text editor component
