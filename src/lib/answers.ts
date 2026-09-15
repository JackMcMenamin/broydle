/** Normalise a free-text answer for lenient comparison. */
export function normalise(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\b(the|a|an|of)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Levenshtein edit distance. */
export function editDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (!m) return n;
  if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[n];
}

/** How many typos to forgive for an answer of this length (spaces removed). */
export function tolerance(len: number): number {
  if (len <= 3) return 0;
  if (len <= 5) return 1;
  if (len <= 10) return 2;
  return 3;
}

/**
 * Lenient answer check: case, accents, punctuation and articles are ignored,
 * and small typos are forgiven (see tolerance). Spaces are ignored entirely,
 * so "sagradafamilia" matches "Sagrada Família".
 */
export function matches(guess: string, answer: string, aliases: string[] = []): boolean {
  const g = normalise(guess).replace(/ /g, "");
  if (!g) return false;
  return [answer, ...aliases].some((a) => {
    const t = normalise(a).replace(/ /g, "");
    if (!t) return false;
    if (t === g) return true;
    return editDistance(g, t) <= tolerance(t.length);
  });
}

/** Deterministic shuffle so a puzzle looks the same on every reload. */
export function seededShuffle<T>(arr: T[], seed: number): T[] {
  const out = [...arr];
  let s = seed || 1;
  const rand = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
