// localStorage helpers for Cricket Team Manager
// Keys:
//   cricket_players_v1  — full player list
//   cricket_seeded_v1   — '1' once we've inserted the initial seed
//   cricket_history_v1  — array of saved match snapshots (cap MAX_HISTORY)
//   cricket_theme_v1    — 'light' | 'dark'

const KEY = "cricket_players_v1";
const SEED_KEY = "cricket_seeded_v1";
const HISTORY_KEY = "cricket_history_v1";
const MAX_HISTORY = 20;

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

// ---- history ---------------------------------------------------------------

export function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveHistory(list) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, MAX_HISTORY)));
}

export function addHistoryEntry(entry) {
  const current = loadHistory();
  const next = [entry, ...current].slice(0, MAX_HISTORY);
  saveHistory(next);
  return next;
}

export function deleteHistoryEntry(id) {
  const next = loadHistory().filter((e) => e.id !== id);
  saveHistory(next);
  return next;
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}
