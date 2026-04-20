import React, { useEffect, useMemo, useState } from "react";
import "@/App.css";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Toaster } from "./components/ui/sonner";
import { UserPlus2, Users2, Wand2, History } from "lucide-react";

import Header from "./components/cricket/Header";
import AddPlayer from "./components/cricket/AddPlayer";
import PlayersList from "./components/cricket/PlayersList";
import TeamGenerator from "./components/cricket/TeamGenerator";
import MatchHistory from "./components/cricket/MatchHistory";

import {
  loadPlayers,
  savePlayers,
  hasSeeded,
  markSeeded,
} from "./lib/storage";
import { buildSeedPlayers } from "./lib/seedData";

const THEME_KEY = "cricket_theme_v1";

function App() {
  const [players, setPlayers] = useState(() => {
    const existing = loadPlayers();
    if (existing && existing.length > 0) return existing;
    if (!hasSeeded()) {
      const seed = buildSeedPlayers();
      savePlayers(seed);
      markSeeded();
      return seed;
    }
    return [];
  });
  const [tab, setTab] = useState("add");
  const [theme, setTheme] = useState("light");
  const [restoredMatch, setRestoredMatch] = useState(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const initial =
      savedTheme ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  useEffect(() => {
    savePlayers(players);
  }, [players]);

  function addPlayer(p) {
    setPlayers((prev) => [p, ...prev]);
    setTab("list");
  }

  function bulkAdd(list) {
    setPlayers((prev) => [...list, ...prev]);
  }

  function deletePlayer(id) {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
  }

  function updatePlayer(id, patch) {
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...patch } : p))
    );
  }

  function toggleAvailable(id, available) {
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, available } : p))
    );
  }

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem(THEME_KEY, next);
    document.documentElement.classList.toggle("dark", next === "dark");
  }

  function restoreFromHistory(entry) {
    // Rebuild team objects to match the TeamGenerator render contract.
    const teams = entry.teams.map((t, i) => ({
      id: `restored-t${i + 1}`,
      name: t.name,
      players: t.players.map((p, j) => ({
        id: `restored-${i}-${j}`,
        name: p.name,
        rating: p.rating,
        skill: p.skill,
      })),
      total: t.total,
      avg: t.avg ?? 0,
      balanceDiffPct: entry.balanceDiffPct,
      skillCounts: t.players.reduce(
        (acc, p) => {
          acc[p.skill] = (acc[p.skill] || 0) + 1;
          return acc;
        },
        { wk: 0, bowl: 0, bat: 0, allr: 0 }
      ),
    }));
    setRestoredMatch({ teams, numTeams: entry.numTeams, key: Date.now() });
    setTab("generate");
  }

  const sortedPlayers = useMemo(
    () => [...players].sort((a, b) => b.rating - a.rating),
    [players]
  );

  return (
    <div className="app-shell min-h-screen">
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        playerCount={players.length}
      />

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <main className="pb-28">
          <TabsContent value="add" className="m-0">
            <AddPlayer onAdd={addPlayer} />
          </TabsContent>

          <TabsContent value="list" className="m-0">
            <PlayersList
              players={sortedPlayers}
              onDelete={deletePlayer}
              onUpdate={updatePlayer}
              onBulkAdd={bulkAdd}
            />
          </TabsContent>

          <TabsContent value="generate" className="m-0">
            <TeamGenerator
              key={restoredMatch?.key ?? "live"}
              players={sortedPlayers}
              onToggleAvailable={toggleAvailable}
              initialTeams={restoredMatch?.teams}
            />
          </TabsContent>

          <TabsContent value="history" className="m-0">
            <MatchHistory onRestore={restoreFromHistory} />
          </TabsContent>
        </main>

        {/* Sticky bottom nav */}
        <nav
          className="bottom-nav"
          style={{ paddingBottom: "max(env(safe-area-inset-bottom), 10px)" }}
          data-testid="bottom-nav"
        >
          <TabsList className="bottom-nav__list">
            <TabsTrigger value="add" className="bottom-nav__item" data-testid="tab-add">
              <UserPlus2 className="h-5 w-5" />
              <span>Add</span>
            </TabsTrigger>
            <TabsTrigger value="list" className="bottom-nav__item" data-testid="tab-list">
              <Users2 className="h-5 w-5" />
              <span>Players</span>
            </TabsTrigger>
            <TabsTrigger value="generate" className="bottom-nav__item" data-testid="tab-generate">
              <Wand2 className="h-5 w-5" />
              <span>Teams</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="bottom-nav__item" data-testid="tab-history">
              <History className="h-5 w-5" />
              <span>History</span>
            </TabsTrigger>
          </TabsList>
        </nav>
      </Tabs>

      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;
