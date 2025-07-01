// // utils/richText/cleanRedundantSpans.js
export const cleanRedundantSpans = (root) => {
  const spans = root.querySelectorAll("span");
  spans.forEach((span) => {
    if (!span.getAttribute("class") && !span.getAttribute("style")) {
      const fragment = document.createDocumentFragment();
      while (span.firstChild) {
        fragment.appendChild(span.firstChild);
      }
      span.replaceWith(fragment);
    }
  });
};
