// Helper to get total length of text inside a tree
export function getTextLength(children) {
  let len = 0;
  for (const child of children) {
    if (child.type === "text" && typeof child.text === "string") {
      len += child.text.length;
    } else if (child.children) {
      len += getTextLength(child.children);
    }
  }
  return len;
}

// Helper: Parse indented lines to nested inline-numbers
function parseIndentedNumberedTree(
  lines,
  startNumber = 1,
  indentSize = 2,
  currentIndent = 0
) {
  let result = [];
  let i = 0;
  let number = startNumber;
  while (i < lines.length) {
    const line = lines[i];
    const match = line.match(/^(\s*)/);
    const indentLen = match ? match[1].replace(/\t/g, "  ").length : 0;
    if (indentLen === currentIndent) {
      let j = i + 1;
      const childLines = [];
      while (j < lines.length) {
        const next = lines[j];
        const nextIndent = (next.match(/^(\s*)/) || [""])[0].replace(
          /\t/g,
          "  "
        ).length;
        if (nextIndent <= currentIndent) break;
        childLines.push(next.slice(indentSize));
        j++;
      }
      result.push({
        type: "inline-number",
        number: number++,
        children: childLines.length
          ? parseIndentedNumberedTree(
              childLines,
              1,
              indentSize,
              currentIndent + indentSize
            )
          : [{ type: "text", text: line.trim() }],
      });
      i = j;
    } else {
      i++;
    }
  }
  return result;
}

// Main function: prevents double wrapping
export function wrapSelectionWithInlineMultiple(
  children,
  start,
  end,
  inlineType,
  offset = 0,
  numberStart = 1
) {
  const result = [];
  let numberCounter = numberStart;

  for (const child of children) {
    // 1. Prevent double wrapping
    if (child.type === "inline-bullet" || child.type === "inline-number") {
      result.push(child);
      offset += getTextLength(child.children || []);
      continue;
    }
    // 2. Text node: wrap only selected part
    if (typeof child.text === "string" && child.type === "text") {
      const length = child.text.length;
      if (offset + length <= start || offset >= end) {
        // Not in selection range
        result.push(child);
      } else {
        // Before selection
        if (start > offset) {
          result.push({
            ...child,
            text: child.text.slice(0, start - offset),
          });
        }

        // Selected part: parse as tree from indented lines (for numbers)
        const selStart = Math.max(0, start - offset);
        const selEnd = Math.min(length, end - offset);
        const selectedText = child.text.slice(selStart, selEnd);

        // Split by newline
        const segments = selectedText.split(/\n/);

        if (inlineType === "inline-number") {
          // NEW: indentation-aware nested numbering!
          const numberedTree = parseIndentedNumberedTree(
            segments,
            numberCounter,
            2,
            0
          );
          result.push(...numberedTree);
          numberCounter += numberedTree.length;
        } else if (inlineType === "inline-bullet") {
          segments
            .filter((seg) => seg.length)
            .forEach((seg) => {
              result.push({
                type: "inline-bullet",
                children: [{ type: "text", text: seg.trim() }],
              });
            });
        }

        // After selection
        if (end < offset + length) {
          result.push({
            ...child,
            text: child.text.slice(end - offset),
          });
        }
      }
      offset += length;
    } else if (child.children && Array.isArray(child.children)) {
      // 3. Recurse
      const childLen = getTextLength(child.children);
      const childStart = offset;
      const childEnd = offset + childLen;
      if (childEnd <= start || childStart >= end) {
        result.push(child);
      } else {
        result.push({
          ...child,
          children: wrapSelectionWithInlineMultiple(
            child.children,
            start - childStart,
            end - childStart,
            inlineType,
            0,
            numberCounter
          ),
        });
      }
      offset += childLen;
    } else {
      result.push(child);
    }
  }
  return result;
}
