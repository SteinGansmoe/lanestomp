import type { FormEvent } from "react";
import { Pencil } from "lucide-react";

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
                    <Button
                      className="mt-4 border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
                      onClick={() => onStartEdit(matchup)}
                      size="sm"
                      type="button"
                      variant="ghost"
                    >
                      <Pencil className="size-3.5" aria-hidden="true" />
                      Edit
                    </Button>
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
