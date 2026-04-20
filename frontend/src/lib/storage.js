// localStorage helpers for Cricket Team Manager
// Single key stores the full player list. Versioned for future migrations.

const KEY = "cricket_players_v1";
const SEED_KEY = "cricket_seeded_v1";

export function loadPlayers() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function savePlayers(players) {
  localStorage.setItem(KEY, JSON.stringify(players));
}

export function hasSeeded() {
  return localStorage.getItem(SEED_KEY) === "1";
}

export function markSeeded() {
  localStorage.setItem(SEED_KEY, "1");
}

export function uid() {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  );
}
