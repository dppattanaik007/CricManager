// Cricket skill definitions — code, short label, full label, theme color.
// Colors are chosen to read on both light cream and dark-green backgrounds.

export const SKILLS = [
  { code: "bat",  short: "BAT", label: "Batsman",       color: "#f5a524" },
  { code: "bowl", short: "BOW", label: "Bowler",        color: "#ef4444" },
  { code: "wk",   short: "WK",  label: "Wicket Keeper", color: "#8b5cf6" },
  { code: "allr", short: "AR",  label: "All-Rounder",   color: "#10b981" },
];

export const skillByCode = Object.fromEntries(SKILLS.map((s) => [s.code, s]));

export function skillLabel(code) {
  return skillByCode[code]?.label ?? code;
}

export function skillColor(code) {
  return skillByCode[code]?.color ?? "#64748b";
}

export function skillShort(code) {
  return skillByCode[code]?.short ?? code.toUpperCase();
}
