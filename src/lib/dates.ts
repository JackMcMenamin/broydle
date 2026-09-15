/** Date helpers. Days are keyed by local calendar date as YYYY-MM-DD. */

export function toKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Today's key in the player's local timezone. */
export function todayKey(): string {
  return toKey(new Date());
}

export function isValidKey(key: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(key);
}

/** "Tuesday, September 15th" */
export function formatKey(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const n = date.getDate();
  const suffix = n % 10 === 1 && n !== 11 ? "st" : n % 10 === 2 && n !== 12 ? "nd" : n % 10 === 3 && n !== 13 ? "rd" : "th";
  return `${date.toLocaleDateString("en-GB", { weekday: "long" })}, ${date.toLocaleDateString("en-GB", { month: "long" })} ${n}${suffix}`;
}

/** Stable numeric seed derived from a date key, for per-day shuffles. */
export function dateSeed(key: string): number {
  return Number(key.replace(/-/g, "")) % 1000003;
}
