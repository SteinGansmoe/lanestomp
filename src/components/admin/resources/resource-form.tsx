import type { FormEvent } from "react";
import { Plus, Save, X } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { fieldClassName, selectOptionClassName } from "../constants";
import type { AdminGame, FormStatus, ResourceFormState } from "../types";

export function ResourceFormCard({
  form,
  games,
  mode = "resources",
  onChange,
  onSubmit,
  status,
  submitLabel,
  title,
}: {
  form: ResourceFormState;
  games: AdminGame[];
  mode?: "community" | "resources";
  onChange: (form: ResourceFormState) => void;
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
        <ResourceForm
          form={form}
          games={games}
          mode={mode}
          onChange={onChange}
          onSubmit={onSubmit}
          status={status}
          submitLabel={submitLabel}
        />
      </CardContent>
    </Card>
  );
}

export function ResourceForm({
  form,
  games,
  mode = "resources",
  onCancel,
  onChange,
  onSubmit,
  status,
  submitLabel,
}: {
  form: ResourceFormState;
  games: AdminGame[];
  mode?: "community" | "resources";
  onCancel?: () => void;
  onChange: (form: ResourceFormState) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  status: FormStatus;
  submitLabel: string;
}) {
  const SubmitIcon = submitLabel.startsWith("Save") ? Save : Plus;
  const isCommunity = mode === "community";
  const iconOptions = isCommunity
    ? ["discord", "forum", "reddit", "social", "video"]
    : ["builds", "official", "patch-notes", "stats", "tier-list", "tools", "trade", "wiki"];

  function updateField(field: keyof ResourceFormState, value: boolean | string) {
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
            <option className={selectOptionClassName} key={game.id} value={game.id}>
              {game.name}
            </option>
          ))}
        </select>
      </label>

      <label className="block space-y-2">
        <span className="text-sm text-zinc-300">
          {isCommunity ? "Community link ID" : "Resource ID"}
        </span>
        <Input
          className="h-11 border-white/10 bg-white/5 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-violet-400/70 focus-visible:ring-violet-400/20"
          disabled={status.isLoading || Boolean(onCancel)}
          onChange={(event) => updateField("id", event.target.value)}
          placeholder={isCommunity ? "diablo-4-official-forums" : "d4-maxroll-builds"}
          required
          value={form.id}
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm text-zinc-300">Title</span>
        <Input
          className="h-11 border-white/10 bg-white/5 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-violet-400/70 focus-visible:ring-violet-400/20"
          disabled={status.isLoading}
          onChange={(event) => updateField("title", event.target.value)}
          placeholder={isCommunity ? "Official Forums" : "Maxroll Builds"}
          required
          value={form.title}
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        {!isCommunity ? (
          <label className="block space-y-2">
            <span className="text-sm text-zinc-300">Resource group</span>
            <Input
              className="h-11 border-white/10 bg-white/5 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-violet-400/70 focus-visible:ring-violet-400/20"
              disabled={status.isLoading}
              onChange={(event) => updateField("group_title", event.target.value)}
              placeholder="Build prep"
              required
              value={form.group_title}
            />
          </label>
        ) : null}

        <label className="block space-y-2">
          <span className="text-sm text-zinc-300">
            {isCommunity ? "Type label" : "Description"}
          </span>
          <Input
            className="h-11 border-white/10 bg-white/5 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-violet-400/70 focus-visible:ring-violet-400/20"
            disabled={status.isLoading}
            onChange={(event) => updateField("label", event.target.value)}
            placeholder={isCommunity ? "Forum" : "Leveling and endgame build guides"}
            required
            value={form.label}
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm text-zinc-300">{isCommunity ? "Icon" : "Category"}</span>
          <select
            className={fieldClassName}
            disabled={status.isLoading}
            onChange={(event) => updateField("icon", event.target.value)}
            value={form.icon}
          >
            {iconOptions.map((icon) => (
              <option className={selectOptionClassName} key={icon} value={icon}>
                {icon}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block space-y-2">
        <span className="text-sm text-zinc-300">URL</span>
        <Input
          className="h-11 border-white/10 bg-white/5 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-violet-400/70 focus-visible:ring-violet-400/20"
          disabled={status.isLoading}
          onChange={(event) => updateField("url", event.target.value)}
          placeholder="https://example.com"
          required
          value={form.url}
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm text-zinc-300">Sort order</span>
          <Input
            className="h-11 border-white/10 bg-white/5 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-violet-400/70 focus-visible:ring-violet-400/20"
            disabled={status.isLoading}
            onChange={(event) => updateField("sort_order", event.target.value)}
            type="number"
            value={form.sort_order}
          />
        </label>

        <label className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-300">
          <input
            checked={form.is_active}
            className="size-4 accent-violet-500"
            disabled={status.isLoading}
            onChange={(event) => updateField("is_active", event.target.checked)}
            type="checkbox"
          />
          Active on game detail page
        </label>
      </div>

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
