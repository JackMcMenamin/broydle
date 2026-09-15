/** Fields every task shares, whatever template it uses. */
export interface TaskBase {
  /** Template id, e.g. "reveal". */
  type: string;
  /** Series name shown to the player, e.g. "Pixel Reveal", "Flag Frag". */
  series: string;
  /** Edition number of this series (rendered as a Roman numeral). */
  edition: number;
  /** Title of this particular edition. */
  title: string;
  blurb: string;
  /** Extra rule text shown under the blurb. */
  note?: string;
  /** Overrides the template's default "how to play" text. */
  how?: string;
  sources?: string;
}

export interface TemplateMeta {
  name: string;
  how: string;
  example: string;
}

export function roman(n: number): string {
  const map: [number, string][] = [
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];
  let out = "";
  for (const [v, s] of map)
    while (n >= v) {
      out += s;
      n -= v;
    }
  return out;
}

/** Theme constants (dark). */
export const PAPER = "#121212";
export const INK = "#ececec";
/** Pastel accent per task slot (1-4): purple, green, yellow, blue. */
export const ACCENTS = ["#C3A3EA", "#A9CF86", "#F2C96A", "#8FBDE3"];
/** Display name. One place to change when the real name is picked. */
export const APP_NAME = "Broydle";
/** Letter index -> accent slot for the wordmark: B purple, o green, d yellow, final e blue. */
export const APP_NAME_COLORS: Record<number, number> = { 0: 0, 2: 1, 4: 2, 6: 3 };
export const accentFor = (slot: number) => ACCENTS[(slot - 1) % ACCENTS.length];
