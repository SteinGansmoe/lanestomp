import type { FormEvent } from "react";
import { Plus, Save, X } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { fieldClassName, selectOptionClassName } from "../constants";
import type { AdminGame, FormStatus, SeasonFormState } from "../types";

export function SeasonFormCard({
  form,
  games,
  onChange,
  onSubmit,
  status,
  submitLabel,
  title,
}: {
  form: SeasonFormState;
  games: AdminGame[];
  onChange: (form: SeasonFormState) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  status: FormStatus;
  submitLabel: string;
  title: string;
}) {
  return (
    <Card className="border-white/10 bg-[#10182b]/90 text-white shadow-xl shadow-black/15">
      <CardHeader>
        <CardTitle className="font-mono text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <SeasonForm
          form={form}
          games={games}
          onChange={onChange}
          onSubmit={onSubmit}
          status={status}
          submitLabel={submitLabel}
        />
      </CardContent>
    </Card>
  );
}

export function SeasonForm({
  form,
  games,
  onCancel,
  onChange,
  onSubmit,
  status,
  submitLabel,
}: {
  form: SeasonFormState;
  games: AdminGame[];
  onCancel?: () => void;
  onChange: (form: SeasonFormState) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  status: FormStatus;
  submitLabel: string;
}) {
  const SubmitIcon = submitLabel.startsWith("Save") ? Save : Plus;

  function updateField(field: keyof SeasonFormState, value: string) {
    onChange({
      ...form,
      [field]: value,
    });
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <label className="block space-y-2">
        <span className="text-sm text-zinc-300">Game</span>
        <select
          className={fieldClassName}
          disabled={status.isLoading}
          onChange={(event) => updateField("game_id", event.target.value)}
          required
          value={form.game_id}
        >
          <option className={selectOptionClassName} value="">
            Select game
          </option>
          {games.map((game) => (
            <option
              className={selectOptionClassName}
              key={game.id}
              value={game.id}
            >
              {game.name}
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm text-zinc-300">Name</span>
          <Input
            className="h-11 border-white/10 bg-white/5 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-violet-400/70 focus-visible:ring-violet-400/20"
            disabled={status.isLoading}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="Season 14"
            required
            value={form.name}
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm text-zinc-300">Slug</span>
          <Input
            className="h-11 border-white/10 bg-white/5 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-violet-400/70 focus-visible:ring-violet-400/20"
            disabled={status.isLoading}
            onChange={(event) => updateField("slug", event.target.value)}
            placeholder="season-14"
            required
            value={form.slug}
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm text-zinc-300">Starts at</span>
          <Input
            className="h-11 border-white/10 bg-white/5 text-zinc-100 focus-visible:border-violet-400/70 focus-visible:ring-violet-400/20"
            disabled={status.isLoading}
            onChange={(event) => updateField("starts_at", event.target.value)}
            required
            type="datetime-local"
            value={form.starts_at}
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm text-zinc-300">Ends at</span>
          <Input
            className="h-11 border-white/10 bg-white/5 text-zinc-100 focus-visible:border-violet-400/70 focus-visible:ring-violet-400/20"
            disabled={status.isLoading}
            onChange={(event) => updateField("ends_at", event.target.value)}
            type="datetime-local"
            value={form.ends_at}
          />
        </label>
      </div>

      <label className="block space-y-2">
        <span className="text-sm text-zinc-300">Description</span>
        <textarea
          className={`${fieldClassName} min-h-24 resize-y py-2`}
          disabled={status.isLoading}
          onChange={(event) => updateField("description", event.target.value)}
          placeholder="Optional season notes"
          value={form.description}
        />
      </label>

      {status.error ? (
        <p className="rounded-md border border-rose-400/20 bg-rose-500/10 p-3 text-sm text-rose-100">
          {status.error}
        </p>
      ) : null}

      {status.success ? (
        <p className="rounded-md border border-emerald-400/20 bg-emerald-500/10 p-3 text-sm text-emerald-100">
          {status.success}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button
          className="h-10 bg-violet-500/80 px-4 text-white hover:bg-violet-500"
          disabled={status.isLoading}
          type="submit"
        >
          <SubmitIcon className="size-4" aria-hidden="true" />
          {status.isLoading ? "Saving..." : submitLabel}
        </Button>

        {onCancel ? (
          <Button
            className="h-10 border-white/10 bg-white/5 px-4 text-zinc-100 hover:bg-white/10"
            disabled={status.isLoading}
            onClick={onCancel}
            type="button"
            variant="ghost"
          >
            <X className="size-4" aria-hidden="true" />
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  );
}
