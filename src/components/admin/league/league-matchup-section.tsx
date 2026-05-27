import type { FormEvent } from "react";
import { CheckCircle2, Pencil } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { leagueRoles } from "@/src/features/league/roles";
import { AdminGroupedListCard } from "../shared/admin-grouped-list-card";
import type {
  AdminLeagueChampion,
  AdminLeagueMatchup,
  FormStatus,
  LeagueMatchupFormState,
} from "../types";
import {
  LeagueMatchupForm,
  LeagueMatchupFormCard,
} from "./league-matchup-form";

export function AdminLeagueMatchupsSection({
  champions,
  createForm,
  createStatus,
  editForm,
  editStatus,
  editingMatchupId,
  matchups,
  onCancelEdit,
  onCreateChange,
  onCreateSubmit,
  onEditChange,
  onEditSubmit,
  onMarkReviewed,
  onStartEdit,
}: {
  champions: AdminLeagueChampion[];
  createForm: LeagueMatchupFormState;
  createStatus: FormStatus;
  editForm: LeagueMatchupFormState;
  editStatus: FormStatus;
  editingMatchupId: number | null;
  matchups: AdminLeagueMatchup[];
  onCancelEdit: () => void;
  onCreateChange: (form: LeagueMatchupFormState) => void;
  onCreateSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onEditChange: (form: LeagueMatchupFormState) => void;
  onEditSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onMarkReviewed: (matchup: AdminLeagueMatchup) => void;
  onStartEdit: (matchup: AdminLeagueMatchup) => void;
}) {
  const championsById = new Map(
    champions.map((champion) => [champion.id, champion] as const)
  );
  const groups = leagueRoles
    .map((role) => ({
      count: matchups.filter((matchup) => matchup.role === role).length,
      id: role,
      items: matchups.filter((matchup) => matchup.role === role),
      title: role === "adc" ? "ADC" : titleCase(role),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <>
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <LeagueMatchupFormCard
          champions={champions}
          form={createForm}
          onChange={onCreateChange}
          onSubmit={onCreateSubmit}
          status={createStatus}
          submitLabel="Create matchup"
          title="Create League matchup"
        />

        <Card className="border-white/10 bg-[#10182b]/90 text-white shadow-xl shadow-black/15">
          <CardHeader>
            <CardTitle className="font-mono text-xl">
              Edit League matchup
            </CardTitle>
          </CardHeader>
          <CardContent>
            {editingMatchupId ? (
              <LeagueMatchupForm
                champions={champions}
                form={editForm}
                onCancel={onCancelEdit}
                onChange={onEditChange}
                onSubmit={onEditSubmit}
                status={editStatus}
                submitLabel="Save changes"
              />
            ) : (
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6 text-sm text-zinc-400">
                Select a matchup below to edit its structured guidance.
                {editStatus.error ? (
                  <p className="mt-3 rounded-md border border-rose-400/20 bg-rose-500/10 p-3 text-rose-100">
                    {editStatus.error}
                  </p>
                ) : null}
                {editStatus.success ? (
                  <p className="mt-3 text-emerald-200">{editStatus.success}</p>
                ) : null}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AdminGroupedListCard
        emptyMessage="No League matchup guidance found."
        groups={groups.map((group) => ({
          children: (
            <ul className="space-y-3 p-4">
              {group.items.map((matchup) => {
                const championA = championsById.get(matchup.champion_a_id);
                const championB = championsById.get(matchup.champion_b_id);
                const contentState = getMatchupContentState(matchup);

                return (
                  <li
                    className="rounded-lg border border-white/10 bg-white/[0.03] p-4"
                    key={matchup.id}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-white">
                          {championA?.name ?? matchup.champion_a_id} vs{" "}
                          {championB?.name ?? matchup.champion_b_id}
                        </p>
                        <p className="mt-1 font-mono text-xs text-zinc-500">
                          {matchup.champion_a_id} / {matchup.champion_b_id}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span
                          className={`rounded-md border px-2 py-1 text-xs ${contentState.className}`}
                        >
                          {contentState.label}
                        </span>
                        {matchup.difficulty_rating ? (
                          <span className="rounded-md border border-amber-300/20 bg-amber-400/10 px-2 py-1 text-xs text-amber-100">
                            Difficulty {matchup.difficulty_rating}/5
                          </span>
                        ) : null}
                        {matchup.confidence_level ? (
                          <span className="rounded-md border border-cyan-300/20 bg-cyan-400/10 px-2 py-1 text-xs text-cyan-100">
                            {matchup.confidence_level}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <p className="mt-3 line-clamp-2 text-sm text-zinc-400">
                      {matchup.overview ?? "No overview yet."}
                    </p>
                    {matchup.admin_notes ? (
                      <p className="mt-3 rounded-md border border-white/10 bg-black/15 p-3 text-xs leading-5 text-zinc-400">
                        {matchup.admin_notes}
                      </p>
                    ) : null}
                    <div className="mt-4 flex flex-wrap gap-3">
                      <Button
                        className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
                        onClick={() => onStartEdit(matchup)}
                        size="sm"
                        type="button"
                        variant="ghost"
                      >
                        <Pencil className="size-3.5" aria-hidden="true" />
                        Edit
                      </Button>
                      <Button
                        className="border-emerald-300/20 bg-emerald-500/10 text-emerald-100 hover:bg-emerald-500/20"
                        disabled={matchup.generation_status === "reviewed"}
                        onClick={() => onMarkReviewed(matchup)}
                        size="sm"
                        type="button"
                        variant="ghost"
                      >
                        <CheckCircle2 className="size-3.5" aria-hidden="true" />
                        Mark as reviewed
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          ),
          count: group.count,
          id: group.id,
          title: group.title,
        }))}
        storageKey="seasontracker.admin.leagueMatchups.collapsedGroups"
        title="League matchups"
      />
    </>
  );
}

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getMatchupContentState(matchup: AdminLeagueMatchup) {
  const hasContent = [
    matchup.overview,
    matchup.early_game,
    matchup.trading_pattern,
    matchup.power_spikes,
    matchup.danger_windows,
    matchup.itemization_notes,
    matchup.win_conditions,
  ].some((value) => Boolean(value?.trim()));

  if (!hasContent) {
    return {
      className: "border-zinc-300/15 bg-white/5 text-zinc-300",
      label: "Missing content",
    };
  }

  if (matchup.generation_status === "reviewed") {
    return {
      className: "border-emerald-300/20 bg-emerald-500/10 text-emerald-100",
      label: "Reviewed / published",
    };
  }

  return {
    className: "border-violet-300/20 bg-violet-500/10 text-violet-100",
    label: "Draft / generated",
  };
}
