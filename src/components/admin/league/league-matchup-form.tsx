import type { FormEvent } from "react";
import { AlertTriangle, CheckCircle2, Plus, Save, Sparkles, X } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { getChampionCombatProfile } from "@/src/features/league/champion-knowledge";
import { leagueRoles } from "@/src/features/league/roles";
import { fieldClassName, selectOptionClassName } from "../constants";
import type {
  AdminLeagueChampion,
  FormStatus,
  LeagueMatchupFormState,
} from "../types";

const matchupTextFields = [
  { key: "overview", label: "Overview" },
  { key: "early_game", label: "Early game" },
  { key: "trading_pattern", label: "Trading pattern" },
  { key: "power_spikes", label: "Power spikes" },
  { key: "danger_windows", label: "Danger windows" },
  { key: "win_conditions", label: "Win conditions" },
] as const;

export function LeagueMatchupGenerateFormCard({
  champions,
  form,
  onChange,
  onSubmit,
  status,
}: {
  champions: AdminLeagueChampion[];
  form: LeagueMatchupFormState;
  onChange: (form: LeagueMatchupFormState) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  status: FormStatus;
}) {
  return (
    <Card className="border-white/10 bg-[#10182b]/90 text-white shadow-xl shadow-black/15">
      <CardHeader>
        <CardTitle className="font-mono text-xl">
          Generate League matchup draft
        </CardTitle>
      </CardHeader>
      <CardContent>
        <LeagueMatchupGenerateForm
          champions={champions}
          form={form}
          onChange={onChange}
          onSubmit={onSubmit}
          status={status}
        />
      </CardContent>
    </Card>
  );
}

export function LeagueMatchupGenerateForm({
  champions,
  form,
  onChange,
  onSubmit,
  status,
}: {
  champions: AdminLeagueChampion[];
  form: LeagueMatchupFormState;
  onChange: (form: LeagueMatchupFormState) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  status: FormStatus;
}) {
  const championA = champions.find(
    (champion) => champion.id === form.champion_a_id
  );
  const championB = champions.find(
    (champion) => champion.id === form.champion_b_id
  );

  function updateField(
    field: keyof LeagueMatchupFormState,
    value: LeagueMatchupFormState[keyof LeagueMatchupFormState]
  ) {
    onChange({
      ...form,
      [field]: value,
    });
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <ChampionSelect
          champions={champions}
          disabled={status.isLoading}
          label="Champion A"
          onChange={(value) => updateField("champion_a_id", value)}
          value={form.champion_a_id}
        />
        <ChampionSelect
          champions={champions}
          disabled={status.isLoading}
          label="Champion B"
          onChange={(value) => updateField("champion_b_id", value)}
          value={form.champion_b_id}
        />
      </div>

      <label className="block space-y-2">
        <span className="text-sm text-zinc-300">Role</span>
        <select
          className={fieldClassName}
          disabled={status.isLoading}
          onChange={(event) =>
            updateField(
              "role",
              event.target.value as LeagueMatchupFormState["role"]
            )
          }
          required
          value={form.role}
        >
          {leagueRoles.map((role) => (
            <option className={selectOptionClassName} key={role} value={role}>
              {role === "adc" ? "ADC" : titleCase(role)}
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-3 md:grid-cols-2">
        <ProfileReadiness champion={championA} label="Champion A profile" />
        <ProfileReadiness champion={championB} label="Champion B profile" />
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

      <Button
        className="h-10 bg-violet-500/80 px-4 text-white hover:bg-violet-500"
        disabled={status.isLoading}
        type="submit"
      >
        <Sparkles className="size-4" aria-hidden="true" />
        {status.isLoading ? "Generating..." : "Generate draft"}
      </Button>
    </form>
  );
}

export function LeagueMatchupForm({
  champions,
  form,
  onCancel,
  onChange,
  onSubmit,
  status,
  submitLabel,
}: {
  champions: AdminLeagueChampion[];
  form: LeagueMatchupFormState;
  onCancel?: () => void;
  onChange: (form: LeagueMatchupFormState) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  status: FormStatus;
  submitLabel: string;
}) {
  const SubmitIcon = submitLabel.startsWith("Save") ? Save : Plus;

  function updateField(
    field: keyof LeagueMatchupFormState,
    value: LeagueMatchupFormState[keyof LeagueMatchupFormState]
  ) {
    onChange({
      ...form,
      [field]: value,
    });
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <ChampionSelect
          champions={champions}
          disabled={status.isLoading}
          label="Champion A"
          onChange={(value) => updateField("champion_a_id", value)}
          value={form.champion_a_id}
        />
        <ChampionSelect
          champions={champions}
          disabled={status.isLoading}
          label="Champion B"
          onChange={(value) => updateField("champion_b_id", value)}
          value={form.champion_b_id}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="block space-y-2">
          <span className="text-sm text-zinc-300">Role</span>
          <select
            className={fieldClassName}
            disabled={status.isLoading}
            onChange={(event) =>
              updateField(
                "role",
                event.target.value as LeagueMatchupFormState["role"]
              )
            }
            required
            value={form.role}
          >
            {leagueRoles.map((role) => (
              <option className={selectOptionClassName} key={role} value={role}>
                {role === "adc" ? "ADC" : titleCase(role)}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-2">
          <span className="text-sm text-zinc-300">Difficulty rating</span>
          <Input
            className="h-11 border-white/10 bg-white/5 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-violet-400/70 focus-visible:ring-violet-400/20"
            disabled={status.isLoading}
            max={5}
            min={1}
            onChange={(event) =>
              updateField("difficulty_rating", event.target.value)
            }
            placeholder="1-5"
            type="number"
            value={form.difficulty_rating}
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm text-zinc-300">Confidence level</span>
          <Input
            className="h-11 border-white/10 bg-white/5 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-violet-400/70 focus-visible:ring-violet-400/20"
            disabled={status.isLoading}
            onChange={(event) =>
              updateField("confidence_level", event.target.value)
            }
            placeholder="Draft, tested, high"
            value={form.confidence_level}
          />
        </label>
      </div>

      <label className="block space-y-2">
        <span className="text-sm text-zinc-300">Admin notes</span>
        <textarea
          className={`${fieldClassName} min-h-24 resize-y py-2`}
          disabled={status.isLoading}
          onChange={(event) => updateField("admin_notes", event.target.value)}
          placeholder="Corrections, source notes, or future AI context"
          value={form.admin_notes}
        />
      </label>

      <div className="grid gap-4 xl:grid-cols-2">
        {matchupTextFields.map((field) => (
          <label className="block space-y-2" key={field.key}>
            <span className="text-sm text-zinc-300">{field.label}</span>
            <textarea
              className={`${fieldClassName} min-h-28 resize-y py-2`}
              disabled={status.isLoading}
              onChange={(event) => updateField(field.key, event.target.value)}
              placeholder={`Write ${field.label.toLowerCase()} guidance`}
              value={form[field.key]}
            />
          </label>
        ))}
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

function ChampionSelect({
  champions,
  disabled,
  label,
  onChange,
  value,
}: {
  champions: AdminLeagueChampion[];
  disabled: boolean;
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm text-zinc-300">{label}</span>
      <select
        className={fieldClassName}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        required
        value={value}
      >
        <option className={selectOptionClassName} value="">
          Select champion
        </option>
        {champions.map((champion) => (
          <option
            className={selectOptionClassName}
            key={champion.id}
            value={champion.id}
          >
            {champion.name} - {champion.title || "Champion"}
          </option>
        ))}
      </select>
    </label>
  );
}

function ProfileReadiness({
  champion,
  label,
}: {
  champion: AdminLeagueChampion | undefined;
  label: string;
}) {
  const profile = champion ? getChampionCombatProfile(champion.id) : null;
  const hasProfile = Boolean(profile);

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-zinc-500">
        {label}
      </p>
      {champion ? (
        <p
          className={`mt-2 flex items-center gap-2 text-sm ${
            hasProfile ? "text-emerald-100" : "text-amber-100"
          }`}
        >
          {hasProfile ? (
            <CheckCircle2 className="size-4" aria-hidden="true" />
          ) : (
            <AlertTriangle className="size-4" aria-hidden="true" />
          )}
          {hasProfile ? "Combat profile available" : "Missing combat profile"}
        </p>
      ) : (
        <p className="mt-2 text-sm text-zinc-400">Select a champion</p>
      )}
    </div>
  );
}

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
