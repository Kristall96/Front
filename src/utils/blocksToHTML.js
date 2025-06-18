export const blocksToHTML = (blocks = []) => {
  return blocks
    .map((block) => {
      switch (block.type) {
        case "paragraph":
          return `<p>${block.content}</p>`;
        case "heading":
          return `<h2>${block.content}</h2>`;
        case "quote":
          return `<blockquote>${block.content}</blockquote>`;
        case "code":
          return `<pre><code>${block.content}</code></pre>`;
        case "divider":
          return `<hr />`;
        case "image":
          return `<img src="${block.content.url}" alt="${
            block.content.alt || ""
          }" />`;
        default:
          return "";
      }
    })
    .join("\n");
};
