/**
 * Shared text normalisation for search, synonyms and emergency rules.
 * MUST stay in sync with normalize() in scripts/enrich/v2/build.mjs.
 * - lowercase, ß -> ss, strip diacritics (ä -> a, é -> e)
 * - remove apostrophes ("can't" -> "cant"), everything else non-alphanumeric -> space
 */
export function normalize(s: string): string {
  return String(s ?? "")
    .toLowerCase()
    .replace(/ß/g, "ss")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’‘`´]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

/** German umlaut transliteration variant (ä -> ae ...), then normalised. "Migräne" -> "migraene". */
export function normalizeUmlautVariant(s: string): string {
  return normalize(
    String(s ?? "")
      .replace(/ä/g, "ae")
      .replace(/ö/g, "oe")
      .replace(/ü/g, "ue")
      .replace(/Ä/g, "Ae")
      .replace(/Ö/g, "Oe")
      .replace(/Ü/g, "Ue")
  );
}

/**
 * Word-start containment on normalised text. Terms of <=3 chars must match a whole word;
 * longer terms may be a word prefix ("brustschmerz" matches "brustschmerzen").
 */
export function containsTerm(normText: string, normTerm: string): boolean {
  if (!normTerm) return false;
  const hay = " " + normText + " ";
  if (normTerm.length <= 3) return hay.includes(" " + normTerm + " ");
  return hay.includes(" " + normTerm);
}

/** Whole-phrase containment (both ends on word boundaries). */
export function containsPhrase(normText: string, normTerm: string): boolean {
  if (!normTerm) return false;
  return (" " + normText + " ").includes(" " + normTerm + " ");
}

export function levenshtein(a: string, b: string, max = 3): number {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = new Array(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      if (cur[j] < rowMin) rowMin = cur[j];
    }
    if (rowMin > max) return max + 1;
    prev = cur;
  }
  return prev[b.length];
}
