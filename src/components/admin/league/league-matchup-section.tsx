import { type FormEvent, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  CheckSquare,
  ChevronDown,
  ListChecks,
  Pencil,
  Sparkles,
} from "lucide-react";

import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { leagueRoles } from "@/src/features/league/roles";
import {
  isChampionInRole,
  sortChampionsForRole,
} from "@/src/features/league/champion-roles";
import type {
  AdminLeagueChampion,
  AdminLeagueMatchup,
  FormStatus,
  LeagueMatchupBatchPlanItem,
  LeagueMatchupFormState,
} from "../types";
import { fieldClassName, selectOptionClassName } from "../constants";
import { cn } from "@/src/lib/utils";
import {
  LeagueMatchupForm,
  LeagueMatchupFormCard,
} from "./league-matchup-form";

type LeagueMatchupRoleFilter = AdminLeagueMatchup["role"] | "all";
type LeagueMatchupSortMode =
  | "alphabetical"
  | "least-reviewed"
  | "most-drafts"
  | "most-reviewed";

type ChampionMatchupGroup = {
  draftCount: number;
  id: string;
  items: AdminLeagueMatchup[];
  missingCount: number | null;
  reviewedCount: number;
  statusClassName: string;
  statusLabel: string;
  title: string;
  totalCount: number;
};

const championGroupStorageKey =
  "seasontracker.admin.leagueMatchups.collapsedChampionGroups";

export function AdminLeagueMatchupsSection({
  champions,
  createForm,
  createStatus,
  editForm,
  editStatus,
  editingMatchupId,
  generatingMatchupId,
  matchups,
  batchProgress,
  batchStatus,
  onCancelEdit,
  onGenerateBatch,
  onCreateChange,
  onCreateSubmit,
  onEditChange,
  onEditSubmit,
  onGenerateDraft,
  onMarkReviewed,
  onStartEdit,
}: {
  champions: AdminLeagueChampion[];
  createForm: LeagueMatchupFormState;
  createStatus: FormStatus;
  editForm: LeagueMatchupFormState;
  editStatus: FormStatus;
  editingMatchupId: number | null;
  generatingMatchupId: number | null;
  matchups: AdminLeagueMatchup[];
  batchProgress: { current: number; label: string; total: number } | null;
  batchStatus: FormStatus;
  onCancelEdit: () => void;
  onCreateChange: (form: LeagueMatchupFormState) => void;
  onCreateSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onEditChange: (form: LeagueMatchupFormState) => void;
  onEditSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onGenerateBatch: (items: LeagueMatchupBatchPlanItem[]) => void;
  onGenerateDraft: (matchup: AdminLeagueMatchup) => void;
  onMarkReviewed: (matchup: AdminLeagueMatchup) => void;
  onStartEdit: (matchup: AdminLeagueMatchup) => void;
}) {
  const [collapsedChampionGroups, setCollapsedChampionGroups] = useState<
    Record<string, boolean>
  >({});
  const [roleFilter, setRoleFilter] = useState<LeagueMatchupRoleFilter>("all");
  const [sortMode, setSortMode] =
    useState<LeagueMatchupSortMode>("alphabetical");
  const championsById = useMemo(
    () => new Map(champions.map((champion) => [champion.id, champion] as const)),
    [champions]
  );
  const championGroups = useMemo(
    () =>
      getChampionMatchupGroups({
        champions,
        matchups,
        roleFilter,
        sortMode,
      }),
    [champions, matchups, roleFilter, sortMode]
  );

  useEffect(() => {
    const animationFrameId = window.requestAnimationFrame(() => {
      const storedValue = window.localStorage.getItem(championGroupStorageKey);

      if (!storedValue) {
        return;
      }

      try {
        const parsedValue: unknown = JSON.parse(storedValue);

        if (!parsedValue || typeof parsedValue !== "object") {
          return;
        }

        const nextCollapsedGroups: Record<string, boolean> = {};

        for (const [groupId, isCollapsed] of Object.entries(parsedValue)) {
          nextCollapsedGroups[groupId] = Boolean(isCollapsed);
        }

        setCollapsedChampionGroups(nextCollapsedGroups);
      } catch {
        window.localStorage.removeItem(championGroupStorageKey);
      }
    });

    return () => window.cancelAnimationFrame(animationFrameId);
  }, []);

  function toggleChampionGroup(groupId: string) {
    setCollapsedChampionGroups((currentGroups) => {
      const nextGroups = {
        ...currentGroups,
        [groupId]: !currentGroups[groupId],
      };

      window.localStorage.setItem(
        championGroupStorageKey,
        JSON.stringify(nextGroups)
      );

      return nextGroups;
    });
  }

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

      <LeagueMatchupBatchPlanner
        champions={champions}
        isDisabled={generatingMatchupId !== null}
        matchups={matchups}
        onGenerateBatch={onGenerateBatch}
        progress={batchProgress}
        status={batchStatus}
      />

      <Card className="border-white/10 bg-[#10182b]/90 text-white shadow-xl shadow-black/15">
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <CardTitle className="font-mono text-xl">
                League matchups
              </CardTitle>
              <p className="mt-2 text-sm text-zinc-400">
                Manage coverage by source champion. Each group shows Champion A
                matchups for the selected lane filter.
              </p>
            </div>
            <div className="grid w-full gap-3 sm:w-auto sm:grid-cols-2">
              <label className="block space-y-2">
                <span className="text-xs font-medium uppercase tracking-[0.12em] text-zinc-500">
                  Lane filter
                </span>
                <select
                  className={`${fieldClassName} h-10 min-w-40`}
                  onChange={(event) =>
                    setRoleFilter(event.target.value as LeagueMatchupRoleFilter)
                  }
                  value={roleFilter}
                >
                  <option className={selectOptionClassName} value="all">
                    All lanes
                  </option>
                  {leagueRoles.map((role) => (
                    <option
                      className={selectOptionClassName}
                      key={role}
                      value={role}
                    >
                      {role === "adc" ? "ADC" : titleCase(role)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block space-y-2">
                <span className="text-xs font-medium uppercase tracking-[0.12em] text-zinc-500">
                  Sort
                </span>
                <select
                  className={`${fieldClassName} h-10 min-w-44`}
                  onChange={(event) =>
                    setSortMode(event.target.value as LeagueMatchupSortMode)
                  }
                  value={sortMode}
                >
                  <option className={selectOptionClassName} value="alphabetical">
                    Alphabetical
                  </option>
                  <option className={selectOptionClassName} value="most-reviewed">
                    Most reviewed
                  </option>
                  <option className={selectOptionClassName} value="least-reviewed">
                    Least reviewed
                  </option>
                  <option className={selectOptionClassName} value="most-drafts">
                    Most drafts remaining
                  </option>
                </select>
              </label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {championGroups.length > 0 ? (
            <ul className="space-y-4">
              {championGroups.map((group) => {
                const isCollapsed = Boolean(collapsedChampionGroups[group.id]);
                const contentId = `${championGroupStorageKey}-${group.id}`;

                return (
                  <li
                    className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.025]"
                    key={group.id}
                  >
                    <div
                      className={cn(
                        "flex flex-wrap items-center justify-between gap-4 px-4 py-3 transition-colors",
                        isCollapsed ? "" : "border-b border-white/10"
                      )}
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-white">
                            {group.title}
                          </p>
                          <span
                            className={`rounded-md border px-2 py-1 text-xs ${group.statusClassName}`}
                          >
                            {group.statusLabel}
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2 text-xs">
                          <span className="rounded-md border border-white/10 bg-black/15 px-2 py-1 text-zinc-300">
                            {group.totalCount} matchup
                            {group.totalCount === 1 ? "" : "s"}
                          </span>
                          <span className="rounded-md border border-emerald-300/20 bg-emerald-500/10 px-2 py-1 text-emerald-100">
                            {group.reviewedCount} reviewed
                          </span>
                          <span className="rounded-md border border-violet-300/20 bg-violet-500/10 px-2 py-1 text-violet-100">
                            {group.draftCount} draft
                            {group.draftCount === 1 ? "" : "s"}
                          </span>
                          {group.missingCount !== null ? (
                            <span className="rounded-md border border-amber-300/20 bg-amber-400/10 px-2 py-1 text-amber-100">
                              {group.missingCount} missing
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <button
                        aria-controls={contentId}
                        aria-expanded={!isCollapsed}
                        aria-label={`${isCollapsed ? "Expand" : "Collapse"} ${
                          group.title
                        } matchups`}
                        className="flex size-9 items-center justify-center rounded-md border border-white/10 bg-white/5 text-zinc-300 transition hover:bg-white/10 hover:text-white"
                        onClick={() => toggleChampionGroup(group.id)}
                        type="button"
                      >
                        <ChevronDown
                          className={cn(
                            "size-4 transition-transform duration-200",
                            isCollapsed ? "-rotate-90" : "rotate-0"
                          )}
                          aria-hidden="true"
                        />
                      </button>
                    </div>

                    <div
                      aria-hidden={isCollapsed}
                      className={cn(
                        "grid transition-[grid-template-rows,opacity] duration-200 ease-out",
                        isCollapsed
                          ? "pointer-events-none grid-rows-[0fr] opacity-0"
                          : "grid-rows-[1fr] opacity-100"
                      )}
                      id={contentId}
                      inert={isCollapsed ? true : undefined}
                    >
                      <div className="overflow-hidden">
                        {group.items.length > 0 ? (
                          <ul className="space-y-3 p-4">
                            {group.items.map((matchup) => {
                const championA = championsById.get(matchup.champion_a_id);
                const championB = championsById.get(matchup.champion_b_id);
                const contentState = getMatchupContentState(matchup);
                const isGenerating = generatingMatchupId === matchup.id;

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
                        <span className="rounded-md border border-white/10 bg-black/15 px-2 py-1 text-xs text-zinc-300">
                          {getRoleLabel(matchup.role)}
                        </span>
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
                        className="border-violet-300/20 bg-violet-500/10 text-violet-100 hover:bg-violet-500/20"
                        disabled={
                          generatingMatchupId !== null ||
                          batchStatus.isLoading
                        }
                        onClick={() => onGenerateDraft(matchup)}
                        size="sm"
                        type="button"
                        variant="ghost"
                      >
                        <Sparkles className="size-3.5" aria-hidden="true" />
                        {isGenerating ? "Generating..." : "Generate draft"}
                      </Button>
                      <Button
                        className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
                        disabled={isGenerating || batchStatus.isLoading}
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
                        disabled={
                          isGenerating ||
                          batchStatus.isLoading ||
                          matchup.generation_status === "reviewed"
                        }
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
                        ) : (
                          <div className="p-4">
                            <p className="rounded-lg border border-white/10 bg-black/15 p-4 text-sm text-zinc-400">
                              No saved matchups for this champion in the current
                              lane filter.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6 text-sm text-zinc-400">
              No League matchup guidance found.
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}

function LeagueMatchupBatchPlanner({
  champions,
  isDisabled,
  matchups,
  onGenerateBatch,
  progress,
  status,
}: {
  champions: AdminLeagueChampion[];
  isDisabled: boolean;
  matchups: AdminLeagueMatchup[];
  onGenerateBatch: (items: LeagueMatchupBatchPlanItem[]) => void;
  progress: { current: number; label: string; total: number } | null;
  status: FormStatus;
}) {
  const [role, setRole] = useState<AdminLeagueMatchup["role"]>("mid");
  const [sourceChampionId, setSourceChampionId] = useState("");
  const [direction, setDirection] =
    useState<"source-first" | "source-second" | "both">("source-first");
  const [poolFilter, setPoolFilter] = useState<"role" | "all">("role");
  const [includeOffMeta, setIncludeOffMeta] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [onlyMissing, setOnlyMissing] = useState(true);
  const [maxBatchSize, setMaxBatchSize] = useState(10);
  const [selectedOpponentIds, setSelectedOpponentIds] = useState<string[]>([]);
  const championsById = useMemo(
    () => new Map(champions.map((champion) => [champion.id, champion] as const)),
    [champions]
  );
  const existingMatchupIds = useMemo(
    () =>
      new Map(
        matchups.map((matchup) => [
          getMatchupKey(matchup.champion_a_id, matchup.champion_b_id, matchup.role),
          matchup.id,
        ])
      ),
    [matchups]
  );
  const opponentPool = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const filteredChampions = champions.filter((champion) => {
      if (champion.id === sourceChampionId) {
        return false;
      }

      if (
        poolFilter === "role" &&
        !isChampionInRole(champion, role, {
          includeOffMeta: includeOffMeta || Boolean(normalizedQuery),
        })
      ) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return (
        champion.name.toLowerCase().includes(normalizedQuery) ||
        champion.id.toLowerCase().includes(normalizedQuery)
      );
    });

    return poolFilter === "role"
      ? sortChampionsForRole(filteredChampions, role)
      : filteredChampions;
  }, [champions, includeOffMeta, poolFilter, role, searchQuery, sourceChampionId]);
  const selectedOpponents = selectedOpponentIds.filter((id) =>
    opponentPool.some((champion) => champion.id === id)
  );
  const plannedItems = useMemo(() => {
    const candidateItems = selectedOpponents.flatMap((opponentId) => {
      const directions =
        direction === "both" ? ["source-first", "source-second"] : [direction];

      return directions.map((plannedDirection) => {
        const championAId =
          plannedDirection === "source-first" ? sourceChampionId : opponentId;
        const championBId =
          plannedDirection === "source-first" ? opponentId : sourceChampionId;
        const existingMatchupId =
          existingMatchupIds.get(getMatchupKey(championAId, championBId, role)) ??
          null;

        return {
          championAId,
          championBId,
          existingMatchupId,
          role,
        };
      });
    });

    return onlyMissing
      ? candidateItems.filter((item) => item.existingMatchupId === null)
      : candidateItems;
  }, [
    direction,
    existingMatchupIds,
    onlyMissing,
    role,
    selectedOpponents,
    sourceChampionId,
  ]);
  const safeBatchSize = Math.min(Math.max(maxBatchSize, 1), 25);
  const executableItems = plannedItems.slice(0, safeBatchSize);
  const skippedByLimit = Math.max(plannedItems.length - executableItems.length, 0);
  const selectedOpponentSet = new Set(selectedOpponents);
  const canGenerate =
    sourceChampionId && executableItems.length > 0 && !status.isLoading;

  function updateRole(nextRole: AdminLeagueMatchup["role"]) {
    setRole(nextRole);
    setSelectedOpponentIds([]);
  }

  function updateSourceChampion(nextChampionId: string) {
    setSourceChampionId(nextChampionId);
    setSelectedOpponentIds((current) =>
      current.filter((opponentId) => opponentId !== nextChampionId)
    );
  }

  function toggleOpponent(opponentId: string) {
    setSelectedOpponentIds((current) =>
      current.includes(opponentId)
        ? current.filter((id) => id !== opponentId)
        : [...current, opponentId]
    );
  }

  function selectVisibleOpponents() {
    setSelectedOpponentIds((current) =>
      Array.from(
        new Set([
          ...current,
          ...opponentPool.slice(0, 50).map((champion) => champion.id),
        ])
      )
    );
  }

  function clearOpponents() {
    setSelectedOpponentIds([]);
  }

  return (
    <Card className="border-white/10 bg-[#10182b]/90 text-white shadow-xl shadow-black/15">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="font-mono text-xl">
              Batch generation planner
            </CardTitle>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
              Plan a limited set of directional matchup drafts before generating.
              Ekko vs Hwei and Hwei vs Ekko are treated as separate matchups.
            </p>
          </div>
          <span className="rounded-md border border-cyan-300/20 bg-cyan-400/10 px-2 py-1 text-xs text-cyan-100">
            Admin only
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 lg:grid-cols-4">
          <label className="block space-y-2">
            <span className="text-sm text-zinc-300">Role / lane</span>
            <select
              className={fieldClassName}
              disabled={status.isLoading}
              onChange={(event) =>
                updateRole(event.target.value as AdminLeagueMatchup["role"])
              }
              value={role}
            >
              {leagueRoles.map((leagueRole) => (
                <option
                  className={selectOptionClassName}
                  key={leagueRole}
                  value={leagueRole}
                >
                  {leagueRole === "adc" ? "ADC" : titleCase(leagueRole)}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-zinc-300">Source champion</span>
            <select
              className={fieldClassName}
              disabled={status.isLoading}
              onChange={(event) => updateSourceChampion(event.target.value)}
              value={sourceChampionId}
            >
              <option className={selectOptionClassName} value="">
                Select source
              </option>
              {champions.map((champion) => (
                <option
                  className={selectOptionClassName}
                  key={champion.id}
                  value={champion.id}
                >
                  {champion.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-zinc-300">Direction</span>
            <select
              className={fieldClassName}
              disabled={status.isLoading}
              onChange={(event) =>
                setDirection(
                  event.target.value as "source-first" | "source-second" | "both"
                )
              }
              value={direction}
            >
              <option className={selectOptionClassName} value="source-first">
                Source vs selected opponents
              </option>
              <option className={selectOptionClassName} value="source-second">
                Selected opponents vs source
              </option>
              <option className={selectOptionClassName} value="both">
                Both directions
              </option>
            </select>
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-zinc-300">Max batch size</span>
            <input
              className={`${fieldClassName} h-11`}
              disabled={status.isLoading}
              max={25}
              min={1}
              onChange={(event) =>
                setMaxBatchSize(Number.parseInt(event.target.value, 10) || 1)
              }
              type="number"
              value={maxBatchSize}
            />
          </label>
        </div>

        <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-4 rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <label className="block space-y-2">
              <span className="text-sm text-zinc-300">Champion pool</span>
              <select
                className={fieldClassName}
                disabled={status.isLoading}
                onChange={(event) =>
                  setPoolFilter(event.target.value as "role" | "all")
                }
                value={poolFilter}
              >
                <option className={selectOptionClassName} value="role">
                  Champions tagged for selected role
                </option>
                <option className={selectOptionClassName} value="all">
                  All champions
                </option>
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm text-zinc-300">Filter champions</span>
              <input
                className={`${fieldClassName} h-11`}
                disabled={status.isLoading}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by champion name"
                value={searchQuery}
              />
            </label>

            <label className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/10 p-3 text-sm text-zinc-300">
              <input
                checked={includeOffMeta}
                className="size-4 accent-violet-500"
                disabled={status.isLoading || poolFilter !== "role"}
                onChange={(event) => setIncludeOffMeta(event.target.checked)}
                type="checkbox"
              />
              Include off-meta role picks
            </label>

            <label className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/10 p-3 text-sm text-zinc-300">
              <input
                checked={onlyMissing}
                className="size-4 accent-violet-500"
                disabled={status.isLoading}
                onChange={(event) => setOnlyMissing(event.target.checked)}
                type="checkbox"
              />
              Only missing directional matchups
            </label>

            <div className="flex flex-wrap gap-3">
              <Button
                className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
                disabled={status.isLoading || opponentPool.length === 0}
                onClick={selectVisibleOpponents}
                size="sm"
                type="button"
                variant="ghost"
              >
                <CheckSquare className="size-3.5" aria-hidden="true" />
                Select visible
              </Button>
              <Button
                className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
                disabled={status.isLoading || selectedOpponents.length === 0}
                onClick={clearOpponents}
                size="sm"
                type="button"
                variant="ghost"
              >
                Clear
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-white">Opponent champions</p>
                <p className="mt-1 text-xs text-zinc-500">
                  {selectedOpponents.length} selected from {opponentPool.length}{" "}
                  visible champions.
                </p>
              </div>
              <span className="rounded-md border border-white/10 bg-black/15 px-2 py-1 text-xs text-zinc-300">
                Specific checkboxes
              </span>
            </div>

            <div className="mt-4 grid max-h-64 gap-2 overflow-auto pr-1 sm:grid-cols-2 xl:grid-cols-3">
              {opponentPool.map((champion) => (
                <label
                  className="flex items-center gap-3 rounded-md border border-white/10 bg-black/10 px-3 py-2 text-sm text-zinc-300"
                  key={champion.id}
                >
                  <input
                    checked={selectedOpponentSet.has(champion.id)}
                    className="size-4 accent-violet-500"
                    disabled={status.isLoading}
                    onChange={() => toggleOpponent(champion.id)}
                    type="checkbox"
                  />
                  <span className="truncate">{champion.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-violet-300/15 bg-violet-500/[0.06] p-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 font-semibold text-white">
                <ListChecks className="size-4 text-violet-200" aria-hidden="true" />
                Batch preview
              </p>
              <p className="mt-2 text-sm text-zinc-300">
                {plannedItems.length} directional matchup
                {plannedItems.length === 1 ? "" : "s"} planned.{" "}
                {executableItems.length} will generate now with the current safe
                limit of {safeBatchSize}.
              </p>
              {skippedByLimit > 0 ? (
                <p className="mt-1 text-xs text-amber-100">
                  {skippedByLimit} planned matchup
                  {skippedByLimit === 1 ? "" : "s"} will wait for another batch.
                </p>
              ) : null}
            </div>

            <Button
              className="h-10 bg-violet-500/80 px-4 text-white hover:bg-violet-500"
              disabled={!canGenerate || isDisabled}
              onClick={() => onGenerateBatch(executableItems)}
              type="button"
            >
              <Sparkles className="size-4" aria-hidden="true" />
              {status.isLoading ? "Generating..." : "Generate batch"}
            </Button>
          </div>

          {executableItems.length > 0 ? (
            <ol className="mt-4 grid gap-2 text-sm text-zinc-300 md:grid-cols-2">
              {executableItems.map((item) => {
                const championA = championsById.get(item.championAId);
                const championB = championsById.get(item.championBId);

                return (
                  <li
                    className="rounded-md border border-white/10 bg-black/15 px-3 py-2"
                    key={getMatchupKey(item.championAId, item.championBId, item.role)}
                  >
                    <span className="font-medium text-zinc-100">
                      {championA?.name ?? item.championAId} vs{" "}
                      {championB?.name ?? item.championBId}
                    </span>
                    <span className="ml-2 text-xs text-zinc-500">
                      {item.existingMatchupId ? "existing row" : "missing row"}
                    </span>
                  </li>
                );
              })}
            </ol>
          ) : (
            <p className="mt-4 rounded-md border border-white/10 bg-black/15 p-3 text-sm text-zinc-400">
              Select a source champion and at least one opponent to preview a safe
              batch.
            </p>
          )}

          {progress ? (
            <p className="mt-4 rounded-md border border-cyan-300/20 bg-cyan-400/10 p-3 text-sm text-cyan-100">
              {progress.label} ({progress.current}/{progress.total})
            </p>
          ) : null}

          {status.error ? (
            <p className="mt-4 rounded-md border border-rose-400/20 bg-rose-500/10 p-3 text-sm text-rose-100">
              {status.error}
            </p>
          ) : null}

          {status.success ? (
            <p className="mt-4 rounded-md border border-emerald-400/20 bg-emerald-500/10 p-3 text-sm text-emerald-100">
              {status.success}
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

function getMatchupKey(
  championAId: string,
  championBId: string,
  role: AdminLeagueMatchup["role"]
) {
  return `${role}:${championAId}:${championBId}`;
}

function getChampionMatchupGroups({
  champions,
  matchups,
  roleFilter,
  sortMode,
}: {
  champions: AdminLeagueChampion[];
  matchups: AdminLeagueMatchup[];
  roleFilter: LeagueMatchupRoleFilter;
  sortMode: LeagueMatchupSortMode;
}): ChampionMatchupGroup[] {
  const championsById = new Map(
    champions.map((champion) => [champion.id, champion] as const)
  );
  const filteredMatchups =
    roleFilter === "all"
      ? matchups
      : matchups.filter((matchup) => matchup.role === roleFilter);
  const matchupsBySourceChampion = new Map<string, AdminLeagueMatchup[]>();

  for (const matchup of filteredMatchups) {
    matchupsBySourceChampion.set(matchup.champion_a_id, [
      ...(matchupsBySourceChampion.get(matchup.champion_a_id) ?? []),
      matchup,
    ]);
  }

  const sourceChampionIds =
    roleFilter === "all"
      ? new Set(filteredMatchups.map((matchup) => matchup.champion_a_id))
      : new Set([
          ...champions
            .filter((champion) => isChampionInRole(champion, roleFilter))
            .map((champion) => champion.id),
          ...filteredMatchups.map((matchup) => matchup.champion_a_id),
        ]);

  return Array.from(sourceChampionIds)
    .map((championId) => {
      const champion = championsById.get(championId);
      const items = sortMatchupsForChampion(
        matchupsBySourceChampion.get(championId) ?? [],
        championsById
      );
      const totalCount = items.length;
      const reviewedCount = items.filter(
        (matchup) => matchup.generation_status === "reviewed"
      ).length;
      const draftCount = totalCount - reviewedCount;
      const missingCount =
        roleFilter === "all"
          ? null
          : Math.max(
              champions.filter(
                (championOption) =>
                  championOption.id !== championId &&
                  isChampionInRole(championOption, roleFilter)
              ).length - totalCount,
              0
            );
      const status = getChampionGroupStatus({
        draftCount,
        missingCount,
        reviewedCount,
        totalCount,
      });

      return {
        draftCount,
        id: championId,
        items,
        missingCount,
        reviewedCount,
        statusClassName: status.className,
        statusLabel: status.label,
        title: champion?.name ?? championId,
        totalCount,
      };
    })
    .sort((groupA, groupB) => sortChampionGroups(groupA, groupB, sortMode));
}

function sortMatchupsForChampion(
  matchups: AdminLeagueMatchup[],
  championsById: Map<string, AdminLeagueChampion>
) {
  return [...matchups].sort((matchupA, matchupB) => {
    const roleDifference =
      leagueRoles.indexOf(matchupA.role) - leagueRoles.indexOf(matchupB.role);

    if (roleDifference !== 0) {
      return roleDifference;
    }

    return getChampionSortName(matchupA.champion_b_id, championsById).localeCompare(
      getChampionSortName(matchupB.champion_b_id, championsById)
    );
  });
}

function sortChampionGroups(
  groupA: ChampionMatchupGroup,
  groupB: ChampionMatchupGroup,
  sortMode: LeagueMatchupSortMode
) {
  switch (sortMode) {
    case "least-reviewed": {
      const reviewedDifference = groupA.reviewedCount - groupB.reviewedCount;

      return reviewedDifference || groupA.title.localeCompare(groupB.title);
    }
    case "most-drafts": {
      const draftDifference = groupB.draftCount - groupA.draftCount;
      const missingDifference =
        (groupB.missingCount ?? 0) - (groupA.missingCount ?? 0);

      return (
        draftDifference ||
        missingDifference ||
        groupA.title.localeCompare(groupB.title)
      );
    }
    case "most-reviewed": {
      const reviewedDifference = groupB.reviewedCount - groupA.reviewedCount;

      return reviewedDifference || groupA.title.localeCompare(groupB.title);
    }
    case "alphabetical":
      return groupA.title.localeCompare(groupB.title);
  }
}

function getChampionSortName(
  championId: string,
  championsById: Map<string, AdminLeagueChampion>
) {
  return championsById.get(championId)?.name ?? championId;
}

function getChampionGroupStatus({
  draftCount,
  missingCount,
  reviewedCount,
  totalCount,
}: {
  draftCount: number;
  missingCount: number | null;
  reviewedCount: number;
  totalCount: number;
}) {
  if (totalCount === 0) {
    return {
      className: "border-zinc-300/15 bg-white/5 text-zinc-300",
      label: "Needs coverage",
    };
  }

  if (missingCount === 0 && draftCount === 0) {
    return {
      className: "border-emerald-300/20 bg-emerald-500/10 text-emerald-100",
      label: "Complete",
    };
  }

  if (draftCount > 0) {
    return {
      className: "border-violet-300/20 bg-violet-500/10 text-violet-100",
      label: "Drafts waiting",
    };
  }

  if ((missingCount ?? 0) > 0) {
    return {
      className: "border-amber-300/20 bg-amber-400/10 text-amber-100",
      label: "Needs matchups",
    };
  }

  if (reviewedCount > 0) {
    return {
      className: "border-cyan-300/20 bg-cyan-400/10 text-cyan-100",
      label: "Reviewed",
    };
  }

  return {
    className: "border-zinc-300/15 bg-white/5 text-zinc-300",
    label: "Needs review",
  };
}

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getRoleLabel(role: AdminLeagueMatchup["role"]) {
  return role === "adc" ? "ADC" : titleCase(role);
}

function getMatchupContentState(matchup: AdminLeagueMatchup) {
  const hasContent = [
    matchup.overview,
    matchup.early_game,
    matchup.trading_pattern,
    matchup.power_spikes,
    matchup.danger_windows,
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
