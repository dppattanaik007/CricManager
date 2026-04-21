# CricManager — Cricket Team Manager

> **From players to perfect teams — instantly.**

A modern, responsive cricket team management web app. Add players, manage your
squad, mark availability, and generate **balanced teams** automatically. Works
100% on the client — your data lives in `localStorage`. No backend required.

> Tech: React (CRA) · TailwindCSS · shadcn/ui · localStorage · zero-backend

---

## ✨ Features

- **Add Player** — name, skill (Batsman / Bowler / Wicket Keeper / All-Rounder),
  and a 1–100 rating slider with live readout.
- **Squad view** — cards with color-coded skill badges, search, edit, delete.
- **Team Generator**
  - Pick 2, 3, or 4 teams.
  - Toggle availability per player with a checkbox list.
  - Greedy rating-based balancing (aims for <5% total rating delta).
  - Shows each team's total rating and average.
- **Confetti** burst on team generation 🎉
- **Light / Dark** toggle (cricket dark-green + cream palette).
- **Mobile-first** layout with sticky bottom nav + safe-area padding.
- Ships with **20 sample players** pre-seeded on first load.

---

## 🧠 How team balancing works

1. Filter to **available** players only.
2. Sort by rating descending.
3. For each player, assign them to the team with the **lowest running total**
   (tie-broken by smaller team size, then team index).
4. Report the balance delta as
   `(max_total − min_total) / avg_total × 100%`.

Result: teams end up within a few points of each other even with wildly
different player counts or ratings.

---

## 📱 Browser support

- Chrome (desktop & mobile)
- Safari (iPhone / iPad) — with `env(safe-area-inset-*)` padding
- Firefox, Edge

No horizontal scroll, fully responsive down to ~320px width.

---

Made with 🏏 for quick weekend pick-up games.
