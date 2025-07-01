// /utils/richText/insertImage.js
export const insertImage = () => {
  const url = prompt("Enter image URL:");
  if (!url || !/^https?:\/\//.test(url)) return alert("Invalid image URL");

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;
  const range = selection.getRangeAt(0);
  const img = document.createElement("img");
  img.src = url;
  img.alt = "Inserted image";
  img.className = "max-w-full my-2";

  range.deleteContents();
  range.insertNode(img);
};
