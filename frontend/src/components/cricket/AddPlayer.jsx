import React, { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";
import { toast } from "sonner";
import { SKILLS } from "../../lib/skills";
import { uid } from "../../lib/storage";
import { UserPlus2 } from "lucide-react";

export default function AddPlayer({ onAdd }) {
  const [name, setName] = useState("");
  const [skill, setSkill] = useState("allr");
  const [rating, setRating] = useState([75]);

  function submit(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error("Please enter a player name");
      return;
    }
    onAdd({
      id: uid(),
      name: trimmed,
      skill,
      rating: rating[0],
      available: true,
    });
    toast.success(`${trimmed} added to the squad`);
    setName("");
    setSkill("allr");
    setRating([75]);
  }

  return (
    <section
      className="mx-auto w-full max-w-2xl px-4 pb-10 pt-4"
      data-testid="add-player-section"
    >
      <div className="glass-card p-5 sm:p-7">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--brand-green)]/15 text-[color:var(--brand-green)]">
            <UserPlus2 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-2xl leading-none tracking-wide">
              Add Player
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Build your squad one cricketer at a time.
            </p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="player-name" className="text-sm font-semibold">
              Player name
            </Label>
            <Input
              id="player-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. MS Dhoni"
              autoComplete="off"
              className="h-12 rounded-xl text-base"
              data-testid="player-name-input"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold">Skill</Label>
            <div
              className="flex flex-wrap gap-2"
              role="radiogroup"
              data-testid="skill-chip-group"
            >
              {SKILLS.map((s) => {
                const active = skill === s.code;
                return (
                  <button
                    key={s.code}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setSkill(s.code)}
                    className={`skill-chip ${active ? "skill-chip--active" : ""}`}
                    style={active ? { ["--chip-color"]: s.color } : undefined}
                    data-testid={`skill-chip-${s.code}`}
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
            <div className="flex items-end justify-between">
              <Label className="text-sm font-semibold">Rating</Label>
              <span
                className="font-display text-3xl leading-none text-[color:var(--brand-green)]"
                data-testid="rating-display"
              >
                {rating[0]}
                <span className="ml-1 text-base text-muted-foreground">
                  /100
                </span>
              </span>
            </div>
            <Slider
              min={1}
              max={100}
              step={1}
              value={rating}
              onValueChange={setRating}
              data-testid="rating-slider"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Rookie</span>
              <span>Legend</span>
            </div>
          </div>

          <Button
            type="submit"
            className="h-12 w-full rounded-xl bg-[color:var(--brand-green)] text-base font-semibold text-white hover:bg-[color:var(--brand-green-2)] active:scale-[0.98]"
            data-testid="add-player-submit-btn"
          >
            Add Player
          </Button>
        </form>
      </div>
    </section>
  );
}
