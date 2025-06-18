export function serializeSlateToHtml(value) {
  return value
    .map((n) => {
      if (n.type === "paragraph") {
        return `<p>${serializeChildren(n.children)}</p>`;
      } else if (n.type === "heading") {
        return `<h2>${serializeChildren(n.children)}</h2>`;
      } else if (n.type === "quote") {
        return `<blockquote>${serializeChildren(n.children)}</blockquote>`;
      } else {
        return serializeChildren(n.children);
      }
    })
    .join("");
}

function serializeChildren(children) {
  return children
    .map((child) => {
      let text = escapeHtml(child.text || "");

      if (child.bold) text = `<strong>${text}</strong>`;
      if (child.italic) text = `<em>${text}</em>`;
      if (child.underline) text = `<u>${text}</u>`;

      return text;
    })
    .join("");
}

function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
