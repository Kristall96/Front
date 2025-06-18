import { useRef, useEffect } from "react";
import DOMPurify from "dompurify";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaLink,
  FaHeading,
  FaImage,
  FaListUl,
  FaListOl,
} from "react-icons/fa";

export default function RichTextBlock({
  block,
  onChange,
  onKeyDown,
  onDelete,
}) {
  const editorRef = useRef(null);

  useEffect(() => {
    if (typeof block.content === "string" && editorRef.current) {
      editorRef.current.innerHTML = block.content || "<p><br/></p>";
    } else {
      onChange("");
    }
  }, []);

  const syncContent = () => {
    if (!editorRef.current) return;
    const raw = editorRef.current.innerHTML;
    const clean = DOMPurify.sanitize(raw, {
      ALLOWED_TAGS: [
        "b",
        "i",
        "u",
        "strike",
        "a",
        "p",
        "br",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "img",
        "span",
        "ul",
        "ol",
        "li",
      ],
      ALLOWED_ATTR: [
        "href",
        "src",
        "alt",
        "width",
        "height",
        "target",
        "class",
        "type",
      ],
    });
    onChange(clean);
  };

  const exec = (command, value = null) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    syncContent();
  };

  const insertLink = () => {
    const url = prompt("Enter URL (https://...)");
    if (!url || !/^https?:\/\//.test(url)) {
      alert("Invalid URL");
      return;
    }
    exec("createLink", url);
  };

  const insertImage = () => {
    const url = prompt("Enter image URL:");
    if (!url || !/^https?:\/\//.test(url)) {
      alert("Invalid image URL");
      return;
    }
    exec("insertImage", url);
  };

  const applyInlineHeading = (level) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    if (range.collapsed) return;

    const wrapper = document.createElement("span");
    switch (level) {
      case 1:
        wrapper.className = "text-3xl font-bold";
        break;
      case 2:
        wrapper.className = "text-2xl font-semibold";
        break;
      case 3:
        wrapper.className = "text-xl font-medium";
        break;
      case 4:
        wrapper.className = "text-lg font-medium";
        break;
      case 5:
        wrapper.className = "text-base font-semibold";
        break;
      case 6:
        wrapper.className = "text-sm font-semibold text-gray-600";
        break;
      default:
        return;
    }

    wrapper.appendChild(range.extractContents());
    range.deleteContents();
    range.insertNode(wrapper);
    range.setStartAfter(wrapper);
    range.setEndAfter(wrapper);
    selection.removeAllRanges();
    selection.addRange(range);
    syncContent();
  };

  const applyParagraph = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    if (range.collapsed) return;

    const paragraph = document.createElement("p");
    paragraph.className = "text-base leading-relaxed mb-3";
    paragraph.appendChild(range.extractContents());
    range.deleteContents();
    range.insertNode(paragraph);
    range.setStartAfter(paragraph);
    range.setEndAfter(paragraph);
    selection.removeAllRanges();
    selection.addRange(range);
    syncContent();
  };

  const insertNestedListFromSelection = (type = "ul") => {
    const selection = window.getSelection();
    if (!selection?.rangeCount) return;

    const range = selection.getRangeAt(0);
    let node = selection.anchorNode;

    // Traverse to LI
    while (node && node.nodeName !== "LI") {
      node = node.parentNode;
    }
    if (!node) return;

    const text = range.toString().trim();
    if (!text) return;

    range.deleteContents(); // Clear selected text

    const nestedList = document.createElement(type === "ul" ? "ul" : "ol");
    if (type === "ol-a") nestedList.setAttribute("type", "a");
    if (type === "ol") nestedList.setAttribute("type", "1");

    const li = document.createElement("li");
    li.textContent = text;

    nestedList.appendChild(li);
    node.appendChild(nestedList);

    const newRange = document.createRange();
    newRange.selectNodeContents(li);
    newRange.collapse(false);
    selection.removeAllRanges();
    selection.addRange(newRange);

    syncContent();
  };

  const handleListAction = (type = "ul") => {
    const selection = window.getSelection();
    if (!selection?.rangeCount) return;

    const range = selection.getRangeAt(0);
    const node = selection.anchorNode;

    const insideLi = (el) => {
      while (el) {
        if (el.nodeName === "LI") return el;
        el = el.parentNode;
      }
      return null;
    };

    const currentLi = insideLi(node);

    if (currentLi) {
      insertNestedListFromSelection(type);
      return;
    }

    const selectedText = range.toString().trim();
    if (!selectedText) return;

    range.deleteContents(); // Clear original text

    const list = document.createElement(type === "ul" ? "ul" : "ol");
    if (type === "ol-a") list.setAttribute("type", "a");
    if (type === "ol") list.setAttribute("type", "1");

    const li = document.createElement("li");
    li.textContent = selectedText;
    list.appendChild(li);

    range.insertNode(list);

    const newRange = document.createRange();
    newRange.selectNodeContents(li);
    newRange.collapse(false);
    selection.removeAllRanges();
    selection.addRange(newRange);

    syncContent();
  };

  return (
    <div className="relative group border border-slate-600 bg-[#1e293b] rounded-lg shadow-md p-3 space-y-2">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2">
        <ToolbarButton icon={<FaBold />} onClick={() => exec("bold")} />
        <ToolbarButton icon={<FaItalic />} onClick={() => exec("italic")} />
        <ToolbarButton
          icon={<FaUnderline />}
          onClick={() => exec("underline")}
        />
        <ToolbarButton
          icon={<FaStrikethrough />}
          onClick={() => exec("strikeThrough")}
        />
        <ToolbarButton icon={<FaLink />} onClick={insertLink} />
        <ToolbarButton icon={<FaImage />} onClick={insertImage} />

        {/* Headings */}
        <ToolbarButton
          icon={<FaHeading />}
          onClick={() => applyInlineHeading(1)}
          title="H1"
        />
        <ToolbarButton
          icon={<FaHeading />}
          onClick={() => applyInlineHeading(2)}
          title="H2"
        />
        <ToolbarButton
          icon={<FaHeading />}
          onClick={() => applyInlineHeading(3)}
          title="H3"
        />
        <ToolbarButton
          icon={<FaHeading />}
          onClick={() => applyInlineHeading(4)}
          title="H4"
        />
        <ToolbarButton
          icon={<FaHeading />}
          onClick={() => applyInlineHeading(5)}
          title="H5"
        />
        <ToolbarButton
          icon={<FaHeading />}
          onClick={() => applyInlineHeading(6)}
          title="H6"
        />

        {/* Paragraph */}
        <ToolbarButton
          icon={<span className="text-sm">¶</span>}
          onClick={applyParagraph}
          title="Paragraph"
        />

        {/* Lists */}
        {/* Nest UL inside OL */}
        <ToolbarButton
          icon={<FaListUl />}
          onClick={() => handleListAction("ul")}
          title="Bullet List"
        />
        <ToolbarButton
          icon={<FaListOl />}
          onClick={() => handleListAction("ol")}
          title="Number List"
        />
        <ToolbarButton
          icon={<span className="text-sm font-bold">a.</span>}
          onClick={() => handleListAction("ol-a")}
          title="Alphabet List"
        />
      </div>

      {/* Editable Content */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={syncContent}
        onKeyDown={(e) => onKeyDown?.(e, block)}
        className="min-h-[100px] bg-white text-black p-3 rounded-md border border-gray-300 focus:outline-none transition-shadow focus:shadow-inner"
      ></div>

      {/* Delete Button */}
      <button
        onClick={onDelete}
        className="absolute top-2 right-2 text-red-400 hover:text-red-600 hidden group-hover:block"
        title="Delete Block"
      >
        ✕
      </button>
    </div>
  );
}

function ToolbarButton({ icon, onClick, title }) {
  return (
    <button
      type="button"
      title={title}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white rounded-md transition"
    >
      {icon}
    </button>
  );
}
