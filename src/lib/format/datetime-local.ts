// Formats a Date for use as the defaultValue of <input type="datetime-local">,
// which requires "YYYY-MM-DDTHH:mm" in local time (no timezone offset, no seconds).
export function toDatetimeLocalValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
