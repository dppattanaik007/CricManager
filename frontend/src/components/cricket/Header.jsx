import React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";

export default function Header({ theme, onToggleTheme, playerCount }) {
  return (
    <header
      className="sticky top-0 z-40 w-full border-b border-white/10 backdrop-blur-md"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        backgroundColor: "rgba(10, 41, 22, 0.96)",
      }}
      data-testid="app-header"
    >
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:py-4">
        <div className="flex items-center gap-3">
          <div
            className="relative flex h-10 w-10 items-center justify-center rounded-xl shadow-lg"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, #e8dcc0 0%, #c2a36b 60%, #7a5a2a 100%)",
            }}
            aria-hidden
          >
            <span
              className="absolute inset-[6px] rounded-full border-2"
              style={{ borderColor: "#7a3b1e" }}
            />
            <span
              className="absolute left-1/2 top-1/2 h-[2px] w-7 -translate-x-1/2 -translate-y-1/2"
              style={{ background: "#7a3b1e" }}
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span
              className="font-display text-xl tracking-wide text-[color:var(--brand-cream)] sm:text-2xl"
              data-testid="app-title"
            >
              PITCH<span className="text-[color:var(--brand-gold)]">11</span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/60 sm:text-xs">
              Cricket Team Manager
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className="hidden rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 sm:inline"
            data-testid="header-player-count"
          >
            {playerCount} {playerCount === 1 ? "player" : "players"}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleTheme}
            className="rounded-full text-white hover:bg-white/10 hover:text-white"
            data-testid="theme-toggle-btn"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
