import React, { useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Sparkles,
  RotateCcw,
  Trophy,
  CheckSquare,
  Square,
  Download,
} from "lucide-react";
import { SKILLS, skillColor, skillShort, skillLabel } from "../../lib/skills";
import { generateTeams } from "../../lib/teamBalancer";
import { addHistoryEntry, uid } from "../../lib/storage";
import Confetti from "./Confetti";
import { toast } from "sonner";

function saveToHistory(teams, numTeams) {
  const totalPlayers = teams.reduce((a, t) => a + t.players.length, 0);
  const entry = {
    id: uid(),
    timestamp: Date.now(),
    numTeams,
    totalPlayers,
    balanceDiffPct: teams[0]?.balanceDiffPct ?? 0,
    teams: teams.map((t) => ({
      name: t.name,
      total: t.total,
      avg: t.avg,
      players: t.players.map((p) => ({
        name: p.name,
        rating: p.rating,
        skill: p.skill,
      })),
    })),
  };
  addHistoryEntry(entry);
}

export default function TeamGenerator({
  players,
  onToggleAvailable,
  initialTeams,
}) {
  const [numTeams, setNumTeams] = useState(
    String(initialTeams?.length || 2)
  );
  const [teams, setTeams] = useState(initialTeams ?? []);
  const [confetti, setConfetti] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const outputRef = useRef(null);

  const availableCount = useMemo(
    () => players.filter((p) => p.available).length,
    [players]
  );

  function handleGenerate() {
    const pool = players.filter((p) => p.available);
    const n = parseInt(numTeams, 10);
    if (pool.length < n) {
      toast.error(
        `Need at least ${n} available players. Selected: ${pool.length}`
      );
      return;
    }
    const result = generateTeams(pool, n);
    setTeams(result);
    saveToHistory(result, n);
    setConfetti(true);
    toast.success(
      `Generated ${n} balanced teams (Δ ${result[0]?.balanceDiffPct ?? 0}%)`
    );
    requestAnimationFrame(() => {
      document
        .getElementById("teams-output")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function handleReset() {
    setTeams([]);
    toast.message("Teams reset");
  }

  function toggleAll(checked) {
    players.forEach((p) => {
      if (p.available !== checked) onToggleAvailable(p.id, checked);
    });
  }

  async function handleDownload() {
    if (!outputRef.current) return;
    try {
      setDownloading(true);
      // Capture with transparent→solid background so dark-green card stays readable.
      const canvas = await html2canvas(outputRef.current, {
        backgroundColor: "#0a2916",
        scale: 2,
        useCORS: true,
      });
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      const date = new Date().toISOString().split("T")[0];
      a.href = dataUrl;
      a.download = `pitch11-teams-${date}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success("Teams image downloaded");
    } catch (err) {
      toast.error("Could not generate image");
      console.error(err);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <section
      className="mx-auto w-full max-w-3xl px-4 pb-10 pt-4"
      data-testid="team-generator-section"
    >
      <Confetti show={confetti} onDone={() => setConfetti(false)} />

      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--brand-gold)]/20 text-[color:var(--brand-green)]">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h2 className="font-display text-2xl leading-none tracking-wide">
            Generate Teams
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Pick availability · split by rating · balanced skills.
          </p>
        </div>
      </div>

      <div className="glass-card mb-4 p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-2">
            <Label className="text-sm font-semibold">Number of teams</Label>
            <Select value={numTeams} onValueChange={setNumTeams}>
              <SelectTrigger
                className="h-11 rounded-xl"
                data-testid="num-teams-trigger"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2" data-testid="num-teams-2">2 Teams</SelectItem>
                <SelectItem value="3" data-testid="num-teams-3">3 Teams</SelectItem>
                <SelectItem value="4" data-testid="num-teams-4">4 Teams</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleGenerate}
              disabled={availableCount < parseInt(numTeams, 10)}
              className="h-11 flex-1 rounded-xl bg-[color:var(--brand-green)] px-5 font-semibold text-white hover:bg-[color:var(--brand-green-2)] disabled:opacity-50 sm:flex-none"
              data-testid="generate-teams-btn"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Generate
            </Button>
            {teams.length > 0 && (
              <Button
                onClick={handleReset}
                variant="outline"
                className="h-11 rounded-xl"
                data-testid="reset-teams-btn"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Availability picker */}
      <div className="glass-card p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div>
            <div className="font-display text-lg">Available players</div>
            <div className="text-xs text-muted-foreground">
              {availableCount} of {players.length} selected
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleAll(true)}
              className="h-8 rounded-lg text-xs"
              data-testid="select-all-btn"
            >
              <CheckSquare className="mr-1 h-3.5 w-3.5" />
              All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleAll(false)}
              className="h-8 rounded-lg text-xs"
              data-testid="clear-all-btn"
            >
              <Square className="mr-1 h-3.5 w-3.5" />
              None
            </Button>
          </div>
        </div>

        {players.length === 0 ? (
          <p
            className="py-6 text-center text-sm text-muted-foreground"
            data-testid="team-gen-empty"
          >
            Add players first to generate teams.
          </p>
        ) : (
          <ul className="divide-y divide-black/5 dark:divide-white/10">
            {players.map((p) => (
              <li
                key={p.id}
                className="flex items-center gap-3 py-2.5"
                data-testid={`avail-row-${p.id}`}
              >
                <Checkbox
                  id={`avail-${p.id}`}
                  checked={p.available}
                  onCheckedChange={(v) => onToggleAvailable(p.id, !!v)}
                  className="h-5 w-5 rounded-md data-[state=checked]:bg-[color:var(--brand-green)] data-[state=checked]:border-[color:var(--brand-green)]"
                  data-testid={`avail-checkbox-${p.id}`}
                />
                <label
                  htmlFor={`avail-${p.id}`}
                  className="flex flex-1 cursor-pointer items-center justify-between gap-3"
                >
                  <span className="truncate font-medium">{p.name}</span>
                  <span className="flex items-center gap-2">
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase"
                      style={{
                        background: `${skillColor(p.skill)}22`,
                        color: skillColor(p.skill),
                      }}
                    >
                      {skillShort(p.skill)}
                    </span>
                    <span className="font-display text-base text-[color:var(--brand-green)]">
                      {p.rating}
                    </span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Results */}
      {teams.length > 0 && (
        <div id="teams-output" className="mt-8">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Trophy className="h-5 w-5 text-[color:var(--brand-gold)]" />
            <h3 className="font-display text-xl">Generated Teams</h3>
            <span
              className="rounded-full bg-[color:var(--brand-gold)]/20 px-3 py-1 text-xs font-semibold text-[color:var(--brand-ink)] dark:text-[color:var(--brand-gold)]"
              data-testid="balance-indicator"
            >
              Δ {teams[0]?.balanceDiffPct ?? 0}% diff
            </span>
            <Button
              onClick={handleDownload}
              disabled={downloading}
              variant="outline"
              size="sm"
              className="ml-auto h-8 rounded-lg border-[color:var(--brand-green)]/30 text-[color:var(--brand-green)] hover:bg-[color:var(--brand-green)]/10 hover:text-[color:var(--brand-green)]"
              data-testid="download-teams-btn"
            >
              <Download className="mr-1.5 h-3.5 w-3.5" />
              {downloading ? "Rendering…" : "Download PNG"}
            </Button>
          </div>
          <div
            ref={outputRef}
            className="grid grid-cols-1 gap-4 rounded-2xl bg-transparent p-1 sm:grid-cols-2"
          >
            {teams.map((t, i) => (
              <div
                key={t.id}
                className="team-card"
                data-testid={`team-card-${i + 1}`}
              >
                <div className="team-card__stripe" />
                <div className="p-4 sm:p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-display text-xl text-white">
                        {t.name}
                      </span>
                      <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold text-white/80">
                        {t.players.length} players
                      </span>
                    </div>
                    <div className="text-right">
                      <div
                        className="font-display text-3xl leading-none text-[color:var(--brand-gold)]"
                        data-testid={`team-total-${i + 1}`}
                      >
                        {t.total}
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-white/60">
                        total · avg {t.avg}
                      </div>
                    </div>
                  </div>

                  {/* Skill composition pills */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {SKILLS.map((s) => {
                      const count = t.skillCounts?.[s.code] ?? 0;
                      if (!count) return null;
                      return (
                        <span
                          key={s.code}
                          className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/90"
                          title={`${count} ${s.label}`}
                        >
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ background: s.color }}
                          />
                          {count}× {s.short}
                        </span>
                      );
                    })}
                  </div>

                  <ul className="mt-4 space-y-1.5">
                    {t.players.map((p) => (
                      <li
                        key={p.id}
                        className="flex items-center justify-between gap-2 rounded-lg bg-white/5 px-3 py-1.5 text-sm text-white/95"
                      >
                        <span className="flex items-center gap-2 truncate">
                          <span
                            className="inline-block h-1.5 w-1.5 rounded-full"
                            style={{ background: skillColor(p.skill) }}
                            title={skillLabel(p.skill)}
                          />
                          <span className="truncate">{p.name}</span>
                        </span>
                        <span className="font-display text-base text-white">
                          {p.rating}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
