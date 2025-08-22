const WEEK = ["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"];

// HH:mm validator
export const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;

export function buildDaysString(defaultOpen, defaultClose, perDay = {}) {
  const parts = [];
  for (const day of WEEK) {
    const row = perDay?.[day];
    if (!row) continue;

    if (row.timetype === "close") {
      parts.push(`${day}(CLOSED)`);
      continue;
    }

    const dOpen = String(row.open || "").trim();
    const dClose = String(row.close || "").trim();
    // Only add if both present AND differ from default
    if (dOpen && dClose && (dOpen !== defaultOpen || dClose !== defaultClose)) {
      parts.push(`${day}(${dOpen}-${dClose})`);
    }
  }
  return parts.join(",");
}
