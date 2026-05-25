import type { FormEvent } from "react";
import { Plus, Save, X } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { fieldClassName, selectOptionClassName } from "../constants";
import type {
  AdminGame,
  AdminSeason,
  FormStatus,
  TimelineEventFormState,
} from "../types";

const timelineEventTypes = ["event", "patch", "season-start", "season-end"];

export function TimelineEventFormCard({
  form,
  games,
  onChange,
  onSubmit,
  seasons,
  status,
  submitLabel,
  title,
}: {
  form: TimelineEventFormState;
  games: AdminGame[];
  onChange: (form: TimelineEventFormState) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  seasons: AdminSeason[];
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
        <TimelineEventForm
          form={form}
          games={games}
          onChange={onChange}
          onSubmit={onSubmit}
          seasons={seasons}
          status={status}
          submitLabel={submitLabel}
        />
      </CardContent>
    </Card>
  );
}

export function TimelineEventForm({
  form,
  games,
  onCancel,
  onChange,
  onSubmit,
  seasons,
  status,
  submitLabel,
}: {
  form: TimelineEventFormState;
  games: AdminGame[];
  onCancel?: () => void;
  onChange: (form: TimelineEventFormState) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  seasons: AdminSeason[];
  status: FormStatus;
  submitLabel: string;
}) {
  const SubmitIcon = submitLabel.startsWith("Save") ? Save : Plus;
  const visibleSeasons =
    form.game_id ? seasons.filter((season) => season.game_id === form.game_id) : seasons;

  function updateField(
    field: keyof TimelineEventFormState,
    value: boolean | string
  ) {
    onChange({
      ...form,
      [field]: value,
      ...(field === "game_id" ? { season_id: "" } : {}),
    });
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
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

        <label className="block space-y-2">
          <span className="text-sm text-zinc-300">Season</span>
          <select
            className={fieldClassName}
            disabled={status.isLoading}
            onChange={(event) => updateField("season_id", event.target.value)}
            value={form.season_id}
          >
            <option className={selectOptionClassName} value="">
              No season
            </option>
            {visibleSeasons.map((season) => (
              <option
                className={selectOptionClassName}
                key={season.id}
                value={season.id}
              >
                {season.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block space-y-2">
        <span className="text-sm text-zinc-300">Title</span>
        <Input
          className="h-11 border-white/10 bg-white/5 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-violet-400/70 focus-visible:ring-violet-400/20"
          disabled={status.isLoading}
          onChange={(event) => updateField("title", event.target.value)}
          placeholder="Midseason patch"
          required
          value={form.title}
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm text-zinc-300">Event date</span>
          <Input
            className="h-11 border-white/10 bg-white/5 text-zinc-100 focus-visible:border-violet-400/70 focus-visible:ring-violet-400/20"
            disabled={status.isLoading}
            onChange={(event) => updateField("event_date", event.target.value)}
            required
            type="datetime-local"
            value={form.event_date}
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm text-zinc-300">Event type</span>
          <select
            className={fieldClassName}
            disabled={status.isLoading}
            onChange={(event) => updateField("event_type", event.target.value)}
            value={form.event_type}
          >
            {timelineEventTypes.map((eventType) => (
              <option
                className={selectOptionClassName}
                key={eventType}
                value={eventType}
              >
                {eventType}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block space-y-2">
        <span className="text-sm text-zinc-300">Description</span>
        <textarea
          className={`${fieldClassName} min-h-24 resize-y py-2`}
          disabled={status.isLoading}
          onChange={(event) => updateField("description", event.target.value)}
          placeholder="Optional event details"
          value={form.description}
        />
      </label>

      <label className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-300">
        <input
          checked={form.is_pinned}
          className="size-4 accent-violet-500"
          disabled={status.isLoading}
          onChange={(event) => updateField("is_pinned", event.target.checked)}
          type="checkbox"
        />
        Pin near top of timeline
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
