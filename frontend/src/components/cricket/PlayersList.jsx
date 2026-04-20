import React, { useMemo, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Trash2, Pencil, Search, Users2, Upload } from "lucide-react";
import { SKILLS, skillColor, skillLabel, skillShort } from "../../lib/skills";
import { toast } from "sonner";
import ImportCsvDialog from "./ImportCsvDialog";

function RatingBadge({ rating }) {
  return (
    <div
      className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl font-display text-lg leading-none text-white shadow-md"
      style={{
        background:
          "linear-gradient(135deg, var(--brand-green) 0%, var(--brand-green-2) 100%)",
      }}
      aria-label={`rating ${rating}`}
    >
      {rating}
      <span className="mt-0.5 text-[9px] font-sans font-medium uppercase tracking-wider text-white/70">
        rtg
      </span>
    </div>
  );
}

export default function PlayersList({ players, onDelete, onUpdate, onBulkAdd }) {
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(null); // player object
  const [draft, setDraft] = useState({ name: "", skill: "allr", rating: 75 });
  const [importOpen, setImportOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = [...players].sort((a, b) => b.rating - a.rating);
    if (!q) return base;
    return base.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        skillLabel(p.skill).toLowerCase().includes(q)
    );
  }, [players, query]);

  function openEdit(p) {
    setEditing(p);
    setDraft({ name: p.name, skill: p.skill, rating: p.rating });
  }

  function saveEdit() {
    if (!draft.name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    onUpdate(editing.id, {
      name: draft.name.trim(),
      skill: draft.skill,
      rating: draft.rating,
    });
    toast.success("Player updated");
    setEditing(null);
  }

  function handleDelete(p) {
    onDelete(p.id);
    toast.success(`${p.name} removed from squad`);
  }

  return (
    <section
      className="mx-auto w-full max-w-3xl px-4 pb-10 pt-4"
      data-testid="players-list-section"
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--brand-green)]/15 text-[color:var(--brand-green)]">
          <Users2 className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h2 className="font-display text-2xl leading-none tracking-wide">
            Squad
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {players.length} {players.length === 1 ? "player" : "players"} registered
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setImportOpen(true)}
          className="rounded-lg border-[color:var(--brand-green)]/30 text-[color:var(--brand-green)] hover:bg-[color:var(--brand-green)]/10 hover:text-[color:var(--brand-green)]"
          data-testid="open-csv-import-btn"
        >
          <Upload className="mr-1.5 h-3.5 w-3.5" />
          Import CSV
        </Button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or skill…"
          className="h-11 rounded-xl pl-9"
          data-testid="player-search-input"
        />
      </div>

      {filtered.length === 0 ? (
        <div
          className="glass-card flex flex-col items-center justify-center py-14 text-center"
          data-testid="players-empty-state"
        >
          <div className="mb-3 text-4xl">🏏</div>
          <p className="font-display text-lg">
            {players.length === 0 ? "No players yet" : "No matches"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {players.length === 0
              ? "Add your first player to get started."
              : "Try a different search."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3" data-testid="players-grid">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="glass-card flex items-center gap-4 p-3 sm:p-4"
              data-testid={`player-card-${p.id}`}
            >
              <RatingBadge rating={p.rating} />
              <div className="min-w-0 flex-1">
                <div className="truncate font-display text-lg leading-tight">
                  {p.name}
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider"
                    style={{
                      background: `${skillColor(p.skill)}22`,
                      color: skillColor(p.skill),
                    }}
                    data-testid={`player-skill-${p.id}`}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: skillColor(p.skill) }}
                    />
                    {skillShort(p.skill)} · {skillLabel(p.skill)}
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openEdit(p)}
                  className="h-9 w-9 rounded-lg text-muted-foreground hover:text-[color:var(--brand-green)]"
                  data-testid={`edit-player-btn-${p.id}`}
                  aria-label={`Edit ${p.name}`}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(p)}
                  className="h-9 w-9 rounded-lg text-muted-foreground hover:text-red-500"
                  data-testid={`delete-player-btn-${p.id}`}
                  aria-label={`Delete ${p.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit dialog */}
      <Dialog
        open={!!editing}
        onOpenChange={(o) => !o && setEditing(null)}
      >
        <DialogContent
          className="rounded-2xl"
          data-testid="edit-player-dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              Edit player
            </DialogTitle>
            <DialogDescription>
              Update name, skill, or rating. Changes save to your device.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 pt-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                className="h-11 rounded-xl"
                data-testid="edit-player-name-input"
              />
            </div>

            <div className="space-y-2">
              <Label>Skill</Label>
              <div className="flex flex-wrap gap-2">
                {SKILLS.map((s) => {
                  const active = draft.skill === s.code;
                  return (
                    <button
                      key={s.code}
                      type="button"
                      onClick={() => setDraft({ ...draft, skill: s.code })}
                      className={`skill-chip ${
                        active ? "skill-chip--active" : ""
                      }`}
                      style={
                        active ? { ["--chip-color"]: s.color } : undefined
                      }
                      data-testid={`edit-skill-chip-${s.code}`}
                    >
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ background: s.color }}
                      />
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Rating</Label>
                <span className="font-display text-2xl text-[color:var(--brand-green)]">
                  {draft.rating}
                </span>
              </div>
              <Slider
                min={1}
                max={100}
                step={1}
                value={[draft.rating]}
                onValueChange={(v) => setDraft({ ...draft, rating: v[0] })}
                data-testid="edit-rating-slider"
              />
            </div>
          </div>

          <DialogFooter className="mt-4 gap-2">
            <Button
              variant="outline"
              onClick={() => setEditing(null)}
              className="rounded-xl"
              data-testid="edit-cancel-btn"
            >
              Cancel
            </Button>
            <Button
              onClick={saveEdit}
              className="rounded-xl bg-[color:var(--brand-green)] text-white hover:bg-[color:var(--brand-green-2)]"
              data-testid="edit-save-btn"
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ImportCsvDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        onImport={(rows) => onBulkAdd(rows)}
      />
    </section>
  );
}
