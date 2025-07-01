// utils/getAssignedToLabel.js
export function getAssignedToLabel(assignedTo, currentUserId) {
  if (!assignedTo) return "-";
  if (assignedTo._id?.toString() === currentUserId?.toString()) return "You";

  // Prefer first/last name, but only if they exist and aren't empty
  const first = assignedTo.firstName?.trim();
  const last = assignedTo.lastName?.trim();

  if (first || last) return `${first ?? ""} ${last ?? ""}`.trim();

  if (assignedTo.name) return assignedTo.name;

  return "-";
}
