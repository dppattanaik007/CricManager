// CSV parsing for bulk player import.
// Accepted format: `name, skill, rating` — one player per line.
// Header row optional (auto-detected). Skill is tolerant: accepts code
// (bat/bowl/wk/allr) or human label (Batsman, Bowler, Wicket Keeper,
// All-Rounder / All Rounder / AR).

const SKILL_ALIASES = {
  bat: "bat",
  batsman: "bat",
  batter: "bat",
  bowl: "bowl",
  bowler: "bowl",
  wk: "wk",
  keeper: "wk",
  "wicket keeper": "wk",
  "wicketkeeper": "wk",
  allr: "allr",
  ar: "allr",
  "all-rounder": "allr",
  "all rounder": "allr",
  allrounder: "allr",
};

function normaliseSkill(raw) {
  const k = String(raw || "").trim().toLowerCase();
  return SKILL_ALIASES[k] ?? null;
}

export function parsePlayerCSV(text) {
  const rows = [];
  const errors = [];
  const lines = String(text || "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) return { rows, errors: ["Empty input"] };

  // Detect / skip a header row.
  const first = lines[0].toLowerCase();
  const hasHeader =
    first.includes("name") &&
    (first.includes("rating") || first.includes("skill"));
  const start = hasHeader ? 1 : 0;

  for (let i = start; i < lines.length; i++) {
    const raw = lines[i];
    const parts = raw.split(",").map((p) => p.trim());
    if (parts.length < 3) {
      errors.push(`Line ${i + 1}: need 3 fields (name, skill, rating)`);
      continue;
    }
    const [name, skillRaw, ratingRaw] = parts;
    if (!name) {
      errors.push(`Line ${i + 1}: empty name`);
      continue;
    }
    const skill = normaliseSkill(skillRaw);
    if (!skill) {
      errors.push(`Line ${i + 1}: unknown skill "${skillRaw}"`);
      continue;
    }
    const rating = Math.round(Number(ratingRaw));
    if (!Number.isFinite(rating) || rating < 1 || rating > 100) {
      errors.push(`Line ${i + 1}: rating must be 1–100, got "${ratingRaw}"`);
      continue;
    }
    rows.push({ name, skill, rating });
  }
  return { rows, errors };
}

export const CSV_EXAMPLE = `name, skill, rating
Rohit Sharma, batsman, 94
Jasprit Bumrah, bowler, 95
MS Dhoni, wk, 90
Hardik Pandya, all-rounder, 88`;
