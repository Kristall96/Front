// utils/richText/sanitization.js
import DOMPurify from "dompurify";

export const sanitizeHTML = (html) => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "b",
      "i",
      "u",
      "strong",
      "em",
      "a",
      "ul",
      "ol",
      "li",
      "p",
      "span",
      "code",
      "blockquote",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "br",
    ],
    ALLOWED_ATTR: ["href", "class", "style"],
  });
};
