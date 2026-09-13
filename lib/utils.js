export function escapeHtml(value = "") {
  return String(value).replace(/[&<>'"]/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;"
  }[char]));
}

export const escapeAttr = escapeHtml;
export const formatText = (value = "") => escapeHtml(value).replace(/\n/g, "<br>");