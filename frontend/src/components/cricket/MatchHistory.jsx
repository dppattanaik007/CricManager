import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { History, Trash2, RotateCw, Trophy } from "lucide-react";
import {
  loadHistory,
  deleteHistoryEntry,
  clearHistory,
} from "../../lib/storage";
import { skillColor, skillShort } from "../../lib/skills";
import { toast } from "sonner";

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function MatchHistory({ onRestore }) {
  const [entries, setEntries] = useState([]);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    setEntries(loadHistory());
  }, []);

  function refresh() {
    setEntries(loadHistory());
  }

  function handleDelete(id) {
    deleteHistoryEntry(id);
    refresh();
    toast.success("Match removed");
  }

  function handleClear() {
    if (entries.length === 0) return;
    clearHistory();
    refresh();
    toast.success("History cleared");
  }

  function handleRestore(entry) {
    onRestore?.(entry);
    toast.success(`Restored ${entry.numTeams}-team split`);
  }

  return (
    <section
      className="mx-auto w-full max-w-3xl px-4 pb-10 pt-4"
      data-testid="match-history-section"
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--brand-gold)]/20 text-[color:var(--brand-green)]">
          <History className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h2 className="font-display text-2xl leading-none tracking-wide">
            Match History
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Last {entries.length} {entries.length === 1 ? "split" : "splits"} saved on this device.
          </p>
        </div>
        {entries.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="rounded-lg text-muted-foreground hover:text-red-500"
            data-testid="clear-history-btn"
          >
            <Trash2 className="mr-1 h-3.5 w-3.5" />
            Clear all
          </Button>
        )}
      </div>

      {entries.length === 0 ? (
        <div
          className="glass-card flex flex-col items-center justify-center py-14 text-center"
          data-testid="history-empty-state"
        >
          <div className="mb-3 text-4xl">📜</div>
          <p className="font-display text-lg">No matches yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Generate teams and we'll save the split here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((e) => {
            const isOpen = openId === e.id;
            return (
              <div
                key={e.id}
                className="glass-card overflow-hidden"
                data-testid={`history-card-${e.id}`}
              >
                <button
                  className="flex w-full items-center gap-3 p-4 text-left"
                  onClick={() => setOpenId(isOpen ? null : e.id)}
                  aria-expanded={isOpen}
                  data-testid={`history-toggle-${e.id}`}
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[color:var(--brand-green)]/12 text-[color:var(--brand-green)]">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-base leading-tight">
                      {e.numTeams}-team split · Δ {e.balanceDiffPct}%
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {formatTime(e.timestamp)} · {e.totalPlayers} players
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <span
                      className="hidden rounded-full bg-[color:var(--brand-green)]/10 px-2.5 py-1 text-[11px] font-semibold text-[color:var(--brand-green)] sm:inline-flex"
                    >
                      {e.teams.map((t) => t.total).join(" · ")}
                    </span>
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-black/5 p-4 dark:border-white/10">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {e.teams.map((t) => (
                        <div
                          key={t.name}
                          className="rounded-xl border border-[color:var(--brand-green)]/20 bg-[color:var(--brand-green)]/5 p-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-display text-base">
                              {t.name}
                            </span>
                            <span className="font-display text-lg text-[color:var(--brand-green)]">
                              {t.total}
                            </span>
                          </div>
                          <ul className="mt-2 space-y-1">
                            {t.players.map((p, i) => (
                              <li
                                key={i}
                                className="flex items-center justify-between gap-2 text-sm"
                              >
                                <span className="flex items-center gap-1.5 truncate">
                                  <span
                                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                                    style={{ background: skillColor(p.skill) }}
                                  />
                                  <span className="truncate">{p.name}</span>
                                  <span className="ml-1 text-[10px] font-semibold uppercase text-muted-foreground">
                                    {skillShort(p.skill)}
                                  </span>
                                </span>
                                <span className="font-display text-sm text-muted-foreground">
                                  {p.rating}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRestore(e)}
                        className="rounded-lg"
                        data-testid={`restore-match-btn-${e.id}`}
                      >
                        <RotateCw className="mr-1.5 h-3.5 w-3.5" />
                        Restore to Teams tab
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(e.id)}
                        className="rounded-lg text-muted-foreground hover:text-red-500"
                        data-testid={`delete-match-btn-${e.id}`}
                      >
                        <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
