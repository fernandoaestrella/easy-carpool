// Get the short timezone abbreviation (e.g., EST, MT) for a given IANA timezone string
// Returns a string like 'EST', 'PDT', etc. If invalid, returns '-'.
export function getShortTimezoneAbbreviation(timezone: string): string {
  try {
    if (!timezone) return "-";
    // Use a fixed date to avoid DST ambiguity
    const date = new Date("2020-01-01T12:00:00Z");
    const options: Intl.DateTimeFormatOptions = {
      timeZone: timezone,
      timeZoneName: "short",
    };
    const parts = new Intl.DateTimeFormat("en-US", options).formatToParts(date);
    const tzPart = parts.find((p) => p.type === "timeZoneName");
    return tzPart ? tzPart.value : "-";
  } catch {
    return "-";
  }
}
// Format a time string (ISO or timestamp) to 'h:mm AM/PM Z' using the provided timezone string
// time: string | number (ISO string or timestamp)
// timezone: string (IANA, e.g. 'America/Chicago')
export function formatTimeWithZone(
  time: string | number,
  timezone: string
): string {
  if (!time || !timezone) return "-";
  let date;
  try {
    if (typeof time === "string" && /^\d{1,2}:\d{2}$/.test(time)) {
      // If time is in HH:mm, convert to ISO string with default date
      time = `1970-01-01T${time}:00`;
    }
    date = typeof time === "number" ? new Date(time) : new Date(time);
    if (isNaN(date.getTime())) return "-";
  } catch {
    return "-";
  }
  try {
    const options: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: timezone,
      timeZoneName: "shortGeneric",
    };
    const formatted = new Intl.DateTimeFormat("en-US", options).format(date);
    return formatted.replace(/,/, "").replace(/ GMT.*/, "");
  } catch {
    return "-";
  }
}
// Utility functions for registration
export function checkForExistingRegistration(
  carpoolId: string,
  setUserRegistration: (reg: any) => void
): boolean {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(`registration_${carpoolId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUserRegistration(parsed);
        return true;
      } catch (error) {
        console.error("Failed to load registration:", error);
      }
    }
  }
  return false;
}

export function showToast(
  setToastMessage: (msg: string) => void,
  setToastVisible: (v: boolean) => void,
  message: string
) {
  setToastMessage(message);
  setToastVisible(true);
  setTimeout(() => setToastVisible(false), 3000);
}
