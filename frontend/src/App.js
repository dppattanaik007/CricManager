import React, { useEffect, useMemo, useState } from "react";
import "@/App.css";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Toaster } from "./components/ui/sonner";
import { UserPlus2, Users2, Wand2 } from "lucide-react";

import Header from "./components/cricket/Header";
import AddPlayer from "./components/cricket/AddPlayer";
import PlayersList from "./components/cricket/PlayersList";
import TeamGenerator from "./components/cricket/TeamGenerator";

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
    // Initialise synchronously so the save effect can never overwrite with [].
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

  // Bootstrap theme only (players are initialised lazily above).
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

  // Persist whenever players change.
  useEffect(() => {
    savePlayers(players);
  }, [players]);

  function addPlayer(p) {
    setPlayers((prev) => [p, ...prev]);
    setTab("list");
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
            />
          </TabsContent>

          <TabsContent value="generate" className="m-0">
            <TeamGenerator
              players={sortedPlayers}
              onToggleAvailable={toggleAvailable}
            />
          </TabsContent>
        </main>

        {/* Sticky bottom nav (mobile-first, persistent on desktop too) */}
        <nav
          className="bottom-nav"
          style={{ paddingBottom: "max(env(safe-area-inset-bottom), 10px)" }}
          data-testid="bottom-nav"
        >
          <TabsList className="bottom-nav__list">
            <TabsTrigger
              value="add"
              className="bottom-nav__item"
              data-testid="tab-add"
            >
              <UserPlus2 className="h-5 w-5" />
              <span>Add</span>
            </TabsTrigger>
            <TabsTrigger
              value="list"
              className="bottom-nav__item"
              data-testid="tab-list"
            >
              <Users2 className="h-5 w-5" />
              <span>Players</span>
            </TabsTrigger>
            <TabsTrigger
              value="generate"
              className="bottom-nav__item"
              data-testid="tab-generate"
            >
              <Wand2 className="h-5 w-5" />
              <span>Teams</span>
            </TabsTrigger>
          </TabsList>
        </nav>
      </Tabs>

      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;
