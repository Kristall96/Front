// utils/richText/execFormat.js
export const execFormat = (command, value = null) => {
  document.execCommand(command, false, value);
};
