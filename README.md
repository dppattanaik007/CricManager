# PITCH11 — Cricket Team Manager

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

## 🚀 Run locally

```bash
cd frontend
yarn install
yarn start
```

App opens at `http://localhost:3000`.

---

## 📦 Build a static bundle

```bash
cd frontend
yarn build
```

The production-ready static site is emitted to `frontend/build/`. Assets are
referenced via **relative paths** (`"homepage": "."` in `package.json`), so the
build works both at domain root and under a sub-path like
`https://username.github.io/repo-name/`.

---

## 🌐 Deploy to GitHub Pages

### Option A — `gh-pages` branch (recommended)

1. Create a repo on GitHub (e.g. `cricket-team-manager`) and push this project.
2. From the `frontend` folder install the deploy helper:

   ```bash
   cd frontend
   yarn add --dev gh-pages
   ```

3. In `frontend/package.json`, add:

   ```jsonc
   {
     "homepage": ".",
     "scripts": {
       "predeploy": "yarn build",
       "deploy": "gh-pages -d build"
     }
   }
   ```

4. Deploy:

   ```bash
   yarn deploy
   ```

5. On GitHub → **Settings → Pages** → Source: **Deploy from a branch** →
   Branch: `gh-pages` / `(root)`.
6. Your app will be live at
   `https://<username>.github.io/<repo-name>/`.

### Option B — Manual upload

1. Run `yarn build` inside `frontend/`.
2. Commit everything inside `frontend/build/` to a new `gh-pages` branch
   (or copy it to a repo configured for GitHub Pages).
3. Enable GitHub Pages on that branch.

> ⚠️ Because the app uses `"homepage": "."` and has **no client-side routing**,
> it deploys under any sub-path out of the box. No Vite / base-path tweaks
> required.

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

## 🗂 Project structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── App.js                        # Tab shell + state
│   ├── index.css                     # Cricket theme + tokens
│   ├── components/
│   │   ├── cricket/
│   │   │   ├── Header.jsx
│   │   │   ├── AddPlayer.jsx
│   │   │   ├── PlayersList.jsx
│   │   │   ├── TeamGenerator.jsx
│   │   │   └── Confetti.jsx
│   │   └── ui/                       # shadcn/ui primitives
│   └── lib/
│       ├── storage.js                # localStorage helpers
│       ├── seedData.js               # 20 sample players
│       ├── skills.js                 # Skill config
│       └── teamBalancer.js           # Balancing algorithm
└── package.json
```

---

## 🧾 Data model

```ts
type Player = {
  id: string;         // unique local id
  name: string;
  skill: "bat" | "bowl" | "wk" | "allr";
  rating: number;     // 1–100
  available: boolean; // used by team generator
};
```

All players are persisted as a JSON array in `localStorage` under the key
`cricket_players_v1`.

---

## 📱 Browser support

- Chrome (desktop & mobile)
- Safari (iPhone / iPad) — with `env(safe-area-inset-*)` padding
- Firefox, Edge

No horizontal scroll, fully responsive down to ~320px width.

---

Made with 🏏 for quick weekend pick-up games.
