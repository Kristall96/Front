// utils/formatDate.js
export const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString("en-GB");
};
