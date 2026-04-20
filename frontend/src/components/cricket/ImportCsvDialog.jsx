import React, { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Upload, FileUp, CheckCircle2, AlertTriangle } from "lucide-react";
import { parsePlayerCSV, CSV_EXAMPLE } from "../../lib/csv";
import { skillLabel } from "../../lib/skills";
import { toast } from "sonner";
import { uid } from "../../lib/storage";

export default function ImportCsvDialog({ open, onOpenChange, onImport }) {
  const [text, setText] = useState("");

  const result = useMemo(() => parsePlayerCSV(text), [text]);

  function handleImport() {
    if (result.rows.length === 0) {
      toast.error("No valid rows to import");
      return;
    }
    const toAdd = result.rows.map((r) => ({
      id: uid(),
      name: r.name,
      skill: r.skill,
      rating: r.rating,
      available: true,
    }));
    onImport(toAdd);
    toast.success(`Imported ${toAdd.length} players`);
    setText("");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[90vh] overflow-y-auto rounded-2xl sm:max-w-xl"
        data-testid="csv-import-dialog"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display text-xl">
            <FileUp className="h-5 w-5 text-[color:var(--brand-green)]" />
            Import players from CSV
          </DialogTitle>
          <DialogDescription>
            Paste one player per line in{" "}
            <span className="font-mono text-xs">name, skill, rating</span>{" "}
            format. Header row is optional.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={CSV_EXAMPLE}
            rows={8}
            className="rounded-xl font-mono text-sm"
            data-testid="csv-textarea"
          />

          <div className="rounded-xl bg-[color:var(--brand-green)]/5 p-3 text-xs">
            <div className="mb-1 font-semibold text-[color:var(--brand-green)]">
              Accepted skills
            </div>
            <div className="text-muted-foreground">
              bat / batsman · bowl / bowler · wk / keeper · allr / all-rounder
            </div>
          </div>

          {text.trim() && (
            <div
              className="space-y-2 rounded-xl border border-border p-3"
              data-testid="csv-preview"
            >
              <div className="flex items-center gap-2 text-sm font-semibold">
                <CheckCircle2 className="h-4 w-4 text-[color:var(--brand-green)]" />
                <span data-testid="csv-valid-count">
                  {result.rows.length} valid
                </span>
                {result.errors.length > 0 && (
                  <>
                    <span className="text-muted-foreground">·</span>
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <span
                      className="text-amber-600 dark:text-amber-400"
                      data-testid="csv-error-count"
                    >
                      {result.errors.length} skipped
                    </span>
                  </>
                )}
              </div>

              {result.rows.length > 0 && (
                <div className="max-h-40 overflow-y-auto rounded-lg bg-muted/40 p-2 text-xs">
                  {result.rows.slice(0, 20).map((r, i) => (
                    <div key={i} className="flex justify-between gap-2 py-0.5">
                      <span className="truncate font-medium">{r.name}</span>
                      <span className="text-muted-foreground">
                        {skillLabel(r.skill)} · {r.rating}
                      </span>
                    </div>
                  ))}
                  {result.rows.length > 20 && (
                    <div className="pt-1 text-center text-muted-foreground">
                      …and {result.rows.length - 20} more
                    </div>
                  )}
                </div>
              )}

              {result.errors.length > 0 && (
                <ul className="max-h-32 overflow-y-auto rounded-lg bg-amber-50 p-2 text-xs text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
                  {result.errors.slice(0, 8).map((err, i) => (
                    <li key={i}>• {err}</li>
                  ))}
                  {result.errors.length > 8 && (
                    <li className="pt-1 text-muted-foreground">
                      …and {result.errors.length - 8} more
                    </li>
                  )}
                </ul>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="mt-2 gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl"
            data-testid="csv-cancel-btn"
          >
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={result.rows.length === 0}
            className="rounded-xl bg-[color:var(--brand-green)] text-white hover:bg-[color:var(--brand-green-2)]"
            data-testid="csv-import-confirm-btn"
          >
            <Upload className="mr-1.5 h-4 w-4" />
            Import {result.rows.length || ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
