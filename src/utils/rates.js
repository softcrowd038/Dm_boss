export const RATE_FIELDS = [
  "single","jodi","singlepatti","doublepatti","triplepatti","halfsangam","fullsangam",
  "Sp","Dp","round","centerpanna","aki","beki","chart50","chart60","chart70",
  "akibekicut30","abr30pana","startend","cyclepana",
  "groupjodi","panelgroup","bulkjodi","bulksp","bulkdp","familypannel","familyjodi"
];

// body expects per-10 values (e.g., 95 → "10/95")
export function buildDisplayStrings(per10) {
  const out = {};
  for (const k of RATE_FIELDS) {
    const v = per10[k];
    if (v === undefined || v === null) continue;
    // keep user’s number as-is; just coerce to string
    out[k] = `10/${String(v)}`;
  }
  return out;
}

// convert per-10 to normalized numeric (divide by 10)
export function buildNormalized(per10) {
  const out = {};
  for (const k of RATE_FIELDS) {
    const v = per10[k];
    if (v === undefined || v === null) continue;
    const num = Number(v);
    if (!Number.isFinite(num) || num <= 0) {
      throw new Error(`Invalid value for ${k}: ${v}`);
    }
    out[k] = Number((num / 10).toFixed(6)); // keep nice precision
  }
  return out;
}
