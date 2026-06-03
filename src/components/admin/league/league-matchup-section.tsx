import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  CheckSquare,
  ChevronDown,
  Clock3,
  ListChecks,
  Pause,
  Pencil,
  Play,
  RefreshCw,
  Sparkles,
  Square,
  Trash2,
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
  AdminLeagueMatchupFeedback,
  AdminLeagueMatchup,
  FormStatus,
  LeagueMatchupBatchPlanItem,
  LeagueMatchupFormState,
  LeagueMatchupQueueItemResult,
} from "../types";
import { generateLeagueMatchupDraftSection } from "@/src/app/admin/league/matchups/actions";
import type { MatchupDraftSectionKey } from "@/src/features/league/matchup-draft-prompt";
import { fieldClassName, selectOptionClassName } from "../constants";
import { cn } from "@/src/lib/utils";
import { supabase } from "@/src/lib/supabase";
import {
  LeagueMatchupGenerateFormCard,
  LeagueMatchupForm,
} from "./league-matchup-form";

type LeagueMatchupRoleFilter = AdminLeagueMatchup["role"] | "all";
type LeagueMatchupFeedbackStatusFilter = AdminLeagueMatchupFeedback["status"] | "all";
type LeagueMatchupSortMode =
  | "alphabetical"
  | "least-reviewed"
  | "most-drafts"
  | "most-reviewed";
type LeagueMatchupQueueMode = "missing-only" | "regenerate-all";
type LeagueMatchupQueueStatus =
  | "complete"
  | "idle"
  | "paused"
  | "running"
  | "stopped";
type LeagueMatchupQueueItemStatus =
  | "failed"
  | "generated"
  | "pending"
  | "running";

type LeagueMatchupQueueItem = LeagueMatchupBatchPlanItem & {
  completedAt: number | null;
  durationMs: number | null;
  error: string | null;
  id: string;
  matchupId: number | null;
  status: LeagueMatchupQueueItemStatus;
};

type LeagueMatchupQueueState = {
  createdAt: number;
  mode: LeagueMatchupQueueMode;
  role: AdminLeagueMatchup["role"];
  status: LeagueMatchupQueueStatus;
  updatedAt: number;
  items: LeagueMatchupQueueItem[];
};

type ChampionMatchupGroup = {
  approvableDraftIds: number[];
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

type LaneMatchupGroup = {
  championCount: number;
  championGroups: ChampionMatchupGroup[];
  draftCount: number;
  reviewedCount: number;
  role: AdminLeagueMatchup["role"];
  title: string;
  totalCount: number;
};

const championGroupStorageKey =
  "lanestomp.admin.leagueMatchups.collapsedChampionGroups";
const legacyMidMatchupQueueStorageKey =
  "lanestomp.admin.leagueMatchups.midBulkGenerationQueue";
const matchupQueueStorageKeyPrefix =
  "lanestomp.admin.leagueMatchups.bulkGenerationQueue";

export function AdminLeagueMatchupsSection({
  champions,
  createForm,
  createStatus,
  deletingDraftMatchupId,
  editForm,
  editStatus,
  editingMatchupId,
  feedback,
  generatingMatchupId,
  matchups,
  batchProgress,
  batchStatus,
  onCancelEdit,
  onGenerateBatch,
  onGenerateQueueItem,
  onRefresh,
  onCreateChange,
  onCreateSubmit,
  onDeleteDraft,
  onEditChange,
  onEditSubmit,
  onGenerateDraft,
  onMarkReviewed,
  onMarkReviewedForChampion,
  onUpdateFeedbackStatus,
  onStartEdit,
}: {
  champions: AdminLeagueChampion[];
  createForm: LeagueMatchupFormState;
  createStatus: FormStatus;
  deletingDraftMatchupId: number | null;
  editForm: LeagueMatchupFormState;
  editStatus: FormStatus;
  editingMatchupId: number | null;
  feedback: AdminLeagueMatchupFeedback[];
  generatingMatchupId: number | null;
  matchups: AdminLeagueMatchup[];
  batchProgress: { current: number; label: string; total: number } | null;
  batchStatus: FormStatus;
  onCancelEdit: () => void;
  onCreateChange: (form: LeagueMatchupFormState) => void;
  onCreateSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onDeleteDraft: (matchup: AdminLeagueMatchup) => void;
  onEditChange: (form: LeagueMatchupFormState) => void;
  onEditSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onGenerateBatch: (items: LeagueMatchupBatchPlanItem[]) => void;
  onGenerateDraft: (matchup: AdminLeagueMatchup) => void;
  onGenerateQueueItem: (
    item: LeagueMatchupBatchPlanItem
  ) => Promise<LeagueMatchupQueueItemResult>;
  onRefresh: () => Promise<boolean>;
  onMarkReviewed: (matchup: AdminLeagueMatchup) => void;
  onMarkReviewedForChampion: (
    championName: string,
    matchupIds: number[]
  ) => void;
  onUpdateFeedbackStatus: (
    feedback: AdminLeagueMatchupFeedback,
    status: AdminLeagueMatchupFeedback["status"]
  ) => void;
  onStartEdit: (matchup: AdminLeagueMatchup) => void;
}) {
  const [collapsedChampionGroups, setCollapsedChampionGroups] = useState<
    Record<string, boolean>
  >({});
  const [collapsedLaneGroups, setCollapsedLaneGroups] = useState<
    Record<string, boolean>
  >(() => getDefaultCollapsedLaneGroups("all"));
  const [roleFilter, setRoleFilter] = useState<LeagueMatchupRoleFilter>("all");
  const [sortMode, setSortMode] =
    useState<LeagueMatchupSortMode>("alphabetical");
  const [isBulkQueueActive, setIsBulkQueueActive] = useState(false);
  const championsById = useMemo(
    () => new Map(champions.map((champion) => [champion.id, champion] as const)),
    [champions]
  );
  const laneGroups = useMemo(
    () =>
      getLaneMatchupGroups({
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

  function toggleLaneGroup(role: AdminLeagueMatchup["role"]) {
    setCollapsedLaneGroups((currentGroups) => ({
      ...currentGroups,
      [role]: !currentGroups[role],
    }));
  }

  function updateRoleFilter(nextRoleFilter: LeagueMatchupRoleFilter) {
    setRoleFilter(nextRoleFilter);
    setCollapsedLaneGroups(getDefaultCollapsedLaneGroups(nextRoleFilter));
  }

  return (
    <>
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <LeagueMatchupGenerateFormCard
          champions={champions}
          form={createForm}
          onChange={onCreateChange}
          onSubmit={onCreateSubmit}
          status={createStatus}
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

      <LeagueMatchupBulkGenerationQueue
        champions={champions}
        isDisabled={generatingMatchupId !== null || batchStatus.isLoading}
        matchups={matchups}
        onActiveChange={setIsBulkQueueActive}
        onGenerateQueueItem={onGenerateQueueItem}
        onRefresh={onRefresh}
      />

      <LeagueMatchupBatchPlanner
        champions={champions}
        isDisabled={generatingMatchupId !== null || isBulkQueueActive}
        matchups={matchups}
        onGenerateBatch={onGenerateBatch}
        progress={batchProgress}
        status={batchStatus}
      />

      <LeagueMatchupFeedbackReview
        editStatus={editStatus}
        feedback={feedback}
        matchups={matchups}
        onRefresh={onRefresh}
        onStartEdit={onStartEdit}
        onUpdateFeedbackStatus={onUpdateFeedbackStatus}
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
                    updateRoleFilter(
                      event.target.value as LeagueMatchupRoleFilter
                    )
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
          {laneGroups.length > 0 ? (
            <ul className="space-y-4">
              {laneGroups.map((laneGroup) => {
                const isLaneCollapsed = Boolean(
                  collapsedLaneGroups[laneGroup.role]
                );
                const laneContentId = `${championGroupStorageKey}-lane-${laneGroup.role}`;

                return (
                  <li
                    className="overflow-hidden rounded-xl border border-white/10 bg-black/10"
                    key={laneGroup.role}
                  >
                    <div
                      className={cn(
                        "flex flex-wrap items-center justify-between gap-4 px-4 py-4 transition-colors",
                        isLaneCollapsed ? "" : "border-b border-white/10"
                      )}
                    >
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-mono text-lg font-semibold text-white">
                            {laneGroup.title}
                          </p>
                          <span className="rounded-md border border-cyan-300/20 bg-cyan-400/10 px-2 py-1 text-xs text-cyan-100">
                            {laneGroup.championCount} champion
                            {laneGroup.championCount === 1 ? "" : "s"}
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2 text-xs">
                          <span className="rounded-md border border-white/10 bg-black/15 px-2 py-1 text-zinc-300">
                            {laneGroup.totalCount} matchup
                            {laneGroup.totalCount === 1 ? "" : "s"}
                          </span>
                          <span className="rounded-md border border-emerald-300/20 bg-emerald-500/10 px-2 py-1 text-emerald-100">
                            {laneGroup.reviewedCount} reviewed
                          </span>
                          <span className="rounded-md border border-violet-300/20 bg-violet-500/10 px-2 py-1 text-violet-100">
                            {laneGroup.draftCount} draft
                            {laneGroup.draftCount === 1 ? "" : "s"}
                          </span>
                        </div>
                      </div>

                      <button
                        aria-controls={laneContentId}
                        aria-expanded={!isLaneCollapsed}
                        aria-label={`${isLaneCollapsed ? "Expand" : "Collapse"} ${
                          laneGroup.title
                        } lane matchups`}
                        className="flex size-9 items-center justify-center rounded-md border border-white/10 bg-white/5 text-zinc-300 transition hover:bg-white/10 hover:text-white"
                        onClick={() => toggleLaneGroup(laneGroup.role)}
                        type="button"
                      >
                        <ChevronDown
                          className={cn(
                            "size-4 transition-transform duration-200",
                            isLaneCollapsed ? "-rotate-90" : "rotate-0"
                          )}
                          aria-hidden="true"
                        />
                      </button>
                    </div>

                    <div
                      aria-hidden={isLaneCollapsed}
                      className={cn(
                        "grid transition-[grid-template-rows,opacity] duration-200 ease-out",
                        isLaneCollapsed
                          ? "pointer-events-none grid-rows-[0fr] opacity-0"
                          : "grid-rows-[1fr] opacity-100"
                      )}
                      id={laneContentId}
                      inert={isLaneCollapsed ? true : undefined}
                    >
                      <div className="overflow-hidden">
                        {laneGroup.championGroups.length > 0 ? (
                          <ul className="space-y-4 p-4">
                            {laneGroup.championGroups.map((group) => {
                const isCollapsed = Boolean(collapsedChampionGroups[group.id]);
                const contentId = `${championGroupStorageKey}-${group.id}`;
                const isApproveAllDisabled =
                  editStatus.isLoading ||
                  generatingMatchupId !== null ||
                  deletingDraftMatchupId !== null ||
                  batchStatus.isLoading ||
                  isBulkQueueActive ||
                  group.approvableDraftIds.length === 0;

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

                      <div className="flex flex-wrap items-center gap-2">
                        {group.approvableDraftIds.length > 0 ? (
                          <Button
                            className="border-emerald-300/20 bg-emerald-500/10 text-emerald-100 hover:bg-emerald-500/20"
                            disabled={isApproveAllDisabled}
                            onClick={() =>
                              onMarkReviewedForChampion(
                                group.title,
                                group.approvableDraftIds
                              )
                            }
                            size="sm"
                            type="button"
                            variant="ghost"
                          >
                            <CheckCircle2
                              className="size-3.5"
                              aria-hidden="true"
                            />
                            Approve all drafts
                          </Button>
                        ) : null}

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
                const isDeletingDraft = deletingDraftMatchupId === matchup.id;
                const hasDraftContent = hasMatchupDraftContent(matchup);

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
                          deletingDraftMatchupId !== null ||
                          batchStatus.isLoading
                          || isBulkQueueActive
                        }
                        onClick={() => onGenerateDraft(matchup)}
                        size="sm"
                        type="button"
                        variant="ghost"
                      >
                        {hasDraftContent ? (
                          <RefreshCw className="size-3.5" aria-hidden="true" />
                        ) : (
                          <Sparkles className="size-3.5" aria-hidden="true" />
                        )}
                        {isGenerating
                          ? "Generating..."
                          : hasDraftContent
                            ? "Regenerate draft"
                            : "Generate draft"}
                      </Button>
                      <Button
                        className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
                        disabled={
                          isGenerating ||
                          isDeletingDraft ||
                          batchStatus.isLoading
                          || isBulkQueueActive
                        }
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
                          isDeletingDraft ||
                          batchStatus.isLoading ||
                          isBulkQueueActive ||
                          !hasDraftContent ||
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
                      <Button
                        className="border-rose-300/20 bg-rose-500/10 text-rose-100 hover:bg-rose-500/20"
                        disabled={
                          isGenerating ||
                          deletingDraftMatchupId !== null ||
                          batchStatus.isLoading ||
                          isBulkQueueActive ||
                          !hasDraftContent
                        }
                        onClick={() => onDeleteDraft(matchup)}
                        size="sm"
                        type="button"
                        variant="ghost"
                      >
                        <Trash2 className="size-3.5" aria-hidden="true" />
                        {isDeletingDraft ? "Deleting..." : "Delete draft"}
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
                          <div className="p-4">
                            <p className="rounded-lg border border-white/10 bg-black/15 p-4 text-sm text-zinc-400">
                              No champion matchup groups for this lane yet.
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

function LeagueMatchupFeedbackReview({
  editStatus,
  feedback,
  matchups,
  onRefresh,
  onStartEdit,
  onUpdateFeedbackStatus,
}: {
  editStatus: FormStatus;
  feedback: AdminLeagueMatchupFeedback[];
  matchups: AdminLeagueMatchup[];
  onRefresh: () => Promise<boolean>;
  onStartEdit: (matchup: AdminLeagueMatchup) => void;
  onUpdateFeedbackStatus: (
    feedback: AdminLeagueMatchupFeedback,
    status: AdminLeagueMatchupFeedback["status"]
  ) => void;
}) {
  const [cardFilter, setCardFilter] = useState("all");
  const [championFilter, setChampionFilter] = useState("");
  const [laneFilter, setLaneFilter] = useState<LeagueMatchupRoleFilter>("all");
  const [reasonFilter, setReasonFilter] = useState("all");
  const [regeneratingFeedbackId, setRegeneratingFeedbackId] = useState<number | null>(
    null
  );
  const [statusFilter, setStatusFilter] =
    useState<LeagueMatchupFeedbackStatusFilter>("open");
  const [targetedStatus, setTargetedStatus] = useState<FormStatus>({
    error: null,
    isLoading: false,
    success: null,
  });
  const matchupsById = useMemo(
    () => new Map(matchups.map((matchup) => [matchup.id, matchup] as const)),
    [matchups]
  );
  const filteredFeedback = useMemo(
    () =>
      feedback.filter((item) => {
        const championQuery = championFilter.trim().toLowerCase();
        const championMatch =
          !championQuery ||
          item.player_champion.toLowerCase().includes(championQuery) ||
          item.enemy_champion.toLowerCase().includes(championQuery);

        return (
          (statusFilter === "all" || item.status === statusFilter) &&
          (laneFilter === "all" || item.lane === laneFilter) &&
          (cardFilter === "all" || item.card_type === cardFilter) &&
          (reasonFilter === "all" || item.reason === reasonFilter) &&
          championMatch
        );
      }),
    [cardFilter, championFilter, feedback, laneFilter, reasonFilter, statusFilter]
  );
  const groups = useMemo(
    () => groupFeedbackForAdmin(filteredFeedback),
    [filteredFeedback]
  );
  const countsByStatus = getFeedbackCountsByStatus(feedback);

  async function regenerateAffectedCard(item: AdminLeagueMatchupFeedback) {
    const matchup = matchupsById.get(item.matchup_id);
    const sectionKey = getFeedbackSectionKey(item.card_type);

    if (!supabase || !matchup || !sectionKey) {
      setTargetedStatus({
        error: !sectionKey
          ? "This feedback item is not attached to a regeneratable card."
          : "Matchup row is not ready for regeneration.",
        isLoading: false,
        success: null,
      });
      return;
    }

    setRegeneratingFeedbackId(item.id);
    setTargetedStatus({ error: null, isLoading: true, success: null });

    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();
    const accessToken = sessionData.session?.access_token;

    if (sessionError || !accessToken) {
      setRegeneratingFeedbackId(null);
      setTargetedStatus({
        error: sessionError?.message ?? "Admin session is not ready.",
        isLoading: false,
        success: null,
      });
      return;
    }

    const result = await generateLeagueMatchupDraftSection({
      accessToken,
      matchupId: matchup.id,
      sectionKey,
    });

    if (!result.ok) {
      setRegeneratingFeedbackId(null);
      setTargetedStatus({
        error: result.error,
        isLoading: false,
        success: null,
      });
      return;
    }

    await onRefresh();
    setRegeneratingFeedbackId(null);
    setTargetedStatus({
      error: null,
      isLoading: false,
      success: `${getCardTypeLabel(item.card_type)} regenerated as a draft.`,
    });
  }

  function editAffectedMatchup(item: AdminLeagueMatchupFeedback) {
    const matchup = matchupsById.get(item.matchup_id);

    if (!matchup) {
      setTargetedStatus({
        error: "The linked matchup row was not found.",
        isLoading: false,
        success: null,
      });
      return;
    }

    onStartEdit(matchup);
    setTargetedStatus({
      error: null,
      isLoading: false,
      success: `${getCardTypeLabel(item.card_type)} is ready in the edit form above.`,
    });
  }

  return (
    <Card className="border-white/10 bg-[#10182b]/90 text-white shadow-xl shadow-black/15">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <CardTitle className="font-mono text-xl">
              Matchup feedback
            </CardTitle>
            <p className="mt-2 text-sm text-zinc-400">
              Review user reports before changing generated matchup guidance.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            {(["open", "reviewing", "resolved", "dismissed"] as const).map(
              (status) => (
                <span
                  className="rounded-md border border-white/10 bg-black/15 px-2 py-1 text-zinc-300"
                  key={status}
                >
                  {titleCase(status)} {countsByStatus[status]}
                </span>
              )
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-5">
          <label className="grid gap-2">
            <span className="text-xs font-medium uppercase tracking-[0.12em] text-zinc-500">
              Status
            </span>
            <select
              className={`${fieldClassName} h-10`}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as LeagueMatchupFeedbackStatusFilter
                )
              }
              value={statusFilter}
            >
              <option className={selectOptionClassName} value="all">
                All
              </option>
              <option className={selectOptionClassName} value="open">
                Open
              </option>
              <option className={selectOptionClassName} value="reviewing">
                Reviewing
              </option>
              <option className={selectOptionClassName} value="resolved">
                Resolved
              </option>
              <option className={selectOptionClassName} value="dismissed">
                Dismissed
              </option>
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-xs font-medium uppercase tracking-[0.12em] text-zinc-500">
              Lane
            </span>
            <select
              className={`${fieldClassName} h-10`}
              onChange={(event) =>
                setLaneFilter(event.target.value as LeagueMatchupRoleFilter)
              }
              value={laneFilter}
            >
              <option className={selectOptionClassName} value="all">
                All lanes
              </option>
              {leagueRoles.map((role) => (
                <option className={selectOptionClassName} key={role} value={role}>
                  {getRoleLabel(role)}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-xs font-medium uppercase tracking-[0.12em] text-zinc-500">
              Card type
            </span>
            <select
              className={`${fieldClassName} h-10`}
              onChange={(event) => setCardFilter(event.target.value)}
              value={cardFilter}
            >
              <option className={selectOptionClassName} value="all">
                All cards
              </option>
              {getUniqueFeedbackValues(feedback, "card_type").map((value) => (
                <option className={selectOptionClassName} key={value} value={value}>
                  {getCardTypeLabel(value)}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-xs font-medium uppercase tracking-[0.12em] text-zinc-500">
              Reason
            </span>
            <select
              className={`${fieldClassName} h-10`}
              onChange={(event) => setReasonFilter(event.target.value)}
              value={reasonFilter}
            >
              <option className={selectOptionClassName} value="all">
                All reasons
              </option>
              {getUniqueFeedbackValues(feedback, "reason").map((value) => (
                <option className={selectOptionClassName} key={value} value={value}>
                  {getFeedbackReasonLabel(value)}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-xs font-medium uppercase tracking-[0.12em] text-zinc-500">
              Champion
            </span>
            <input
              className={`${fieldClassName} h-10`}
              onChange={(event) => setChampionFilter(event.target.value)}
              placeholder="Search names"
              value={championFilter}
            />
          </label>
        </div>

        {targetedStatus.error || editStatus.error ? (
          <p className="mt-4 rounded-md border border-rose-400/20 bg-rose-500/10 p-3 text-sm text-rose-100">
            {targetedStatus.error ?? editStatus.error}
          </p>
        ) : null}
        {targetedStatus.success || editStatus.success ? (
          <p className="mt-4 rounded-md border border-emerald-400/20 bg-emerald-500/10 p-3 text-sm text-emerald-100">
            {targetedStatus.success ?? editStatus.success}
          </p>
        ) : null}

        {groups.length > 0 ? (
          <div className="mt-5 space-y-4">
            {groups.map((group) => (
              <div
                className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.025]"
                key={group.id}
              >
                <div className="border-b border-white/10 px-4 py-3">
                  <p className="font-semibold text-white">{group.title}</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {group.items.length} feedback item
                    {group.items.length === 1 ? "" : "s"}
                  </p>
                </div>
                <ul className="divide-y divide-white/10">
                  {group.items.map((item) => {
                    const matchup = matchupsById.get(item.matchup_id);
                    const currentText = getFeedbackCardText(matchup, item.card_type);
                    const isRegenerating = regeneratingFeedbackId === item.id;

                    return (
                      <li className="p-4" key={item.id}>
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex flex-wrap gap-2 text-xs">
                              <span className="rounded-md border border-cyan-300/20 bg-cyan-400/10 px-2 py-1 text-cyan-100">
                                {getRoleLabel(item.lane)}
                              </span>
                              <span className="rounded-md border border-violet-300/20 bg-violet-500/10 px-2 py-1 text-violet-100">
                                {getCardTypeLabel(item.card_type)}
                              </span>
                              <span className="rounded-md border border-white/10 bg-black/15 px-2 py-1 text-zinc-300">
                                {titleCase(item.status)}
                              </span>
                            </div>
                            <p className="mt-3 font-medium text-white">
                              {item.player_champion} vs {item.enemy_champion}
                            </p>
                            <p className="mt-1 text-xs text-zinc-500">
                              {getFeedbackTypeLabel(item.feedback_type)}
                              {item.reason
                                ? ` · ${getFeedbackReasonLabel(item.reason)}`
                                : ""}{" "}
                              · {formatFeedbackDate(item.created_at)}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Button
                              className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
                              disabled={editStatus.isLoading || targetedStatus.isLoading}
                              onClick={() => onUpdateFeedbackStatus(item, "reviewing")}
                              size="sm"
                              type="button"
                              variant="ghost"
                            >
                              <Clock3 className="size-3.5" aria-hidden="true" />
                              Reviewing
                            </Button>
                            <Button
                              className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
                              disabled={editStatus.isLoading || targetedStatus.isLoading}
                              onClick={() => editAffectedMatchup(item)}
                              size="sm"
                              type="button"
                              variant="ghost"
                            >
                              <Pencil className="size-3.5" aria-hidden="true" />
                              Edit text
                            </Button>
                            <Button
                              className="border-violet-300/20 bg-violet-500/10 text-violet-100 hover:bg-violet-500/20"
                              disabled={
                                editStatus.isLoading ||
                                targetedStatus.isLoading ||
                                isRegenerating
                              }
                              onClick={() => regenerateAffectedCard(item)}
                              size="sm"
                              type="button"
                              variant="ghost"
                            >
                              <RefreshCw
                                className={`size-3.5 ${
                                  isRegenerating ? "animate-spin" : ""
                                }`}
                                aria-hidden="true"
                              />
                              {isRegenerating ? "Regenerating" : "Regenerate card"}
                            </Button>
                            <Button
                              className="border-emerald-300/20 bg-emerald-500/10 text-emerald-100 hover:bg-emerald-500/20"
                              disabled={editStatus.isLoading || targetedStatus.isLoading}
                              onClick={() => onUpdateFeedbackStatus(item, "resolved")}
                              size="sm"
                              type="button"
                              variant="ghost"
                            >
                              <CheckCircle2 className="size-3.5" aria-hidden="true" />
                              Resolve
                            </Button>
                            <Button
                              className="border-rose-300/20 bg-rose-500/10 text-rose-100 hover:bg-rose-500/20"
                              disabled={editStatus.isLoading || targetedStatus.isLoading}
                              onClick={() => onUpdateFeedbackStatus(item, "dismissed")}
                              size="sm"
                              type="button"
                              variant="ghost"
                            >
                              Dismiss
                            </Button>
                          </div>
                        </div>

                        <div className="mt-4 grid gap-3 lg:grid-cols-2">
                          <div className="rounded-md border border-white/10 bg-black/15 p-3">
                            <p className="text-xs font-medium uppercase tracking-[0.12em] text-zinc-500">
                              Current generated text
                            </p>
                            <p className="mt-2 line-clamp-5 text-sm leading-6 text-zinc-300">
                              {currentText || "No saved text for this card yet."}
                            </p>
                          </div>
                          <div className="rounded-md border border-white/10 bg-black/15 p-3">
                            <p className="text-xs font-medium uppercase tracking-[0.12em] text-zinc-500">
                              User feedback
                            </p>
                            <p className="mt-2 text-sm leading-6 text-zinc-300">
                              {item.message?.trim() || "No extra details provided."}
                            </p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-5 rounded-lg border border-white/10 bg-white/[0.03] p-6 text-sm text-zinc-400">
            No matchup feedback matches these filters yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function LeagueMatchupBulkGenerationQueue({
  champions,
  isDisabled,
  matchups,
  onActiveChange,
  onGenerateQueueItem,
  onRefresh,
}: {
  champions: AdminLeagueChampion[];
  isDisabled: boolean;
  matchups: AdminLeagueMatchup[];
  onActiveChange: (isActive: boolean) => void;
  onGenerateQueueItem: (
    item: LeagueMatchupBatchPlanItem
  ) => Promise<LeagueMatchupQueueItemResult>;
  onRefresh: () => Promise<boolean>;
}) {
  const [queueRole, setQueueRole] = useState<AdminLeagueMatchup["role"]>("mid");
  const [queueMode, setQueueMode] =
    useState<LeagueMatchupQueueMode>("missing-only");
  const [queueMessage, setQueueMessage] = useState<{
    text: string;
    type: "error" | "success";
  } | null>(null);
  const [queueDebugMessages, setQueueDebugMessages] = useState<
    { id: string; text: string; type: "error" | "info" | "success" }[]
  >([]);
  const [queueState, setQueueState] = useState<LeagueMatchupQueueState>(() =>
    createEmptyQueueState("missing-only", "mid")
  );
  const isProcessingRef = useRef(false);
  const matchupsRef = useRef(matchups);
  const queueDebugMessageIdRef = useRef(0);
  const queueStateRef = useRef(queueState);

  const roleChampions = useMemo(
    () =>
      sortChampionsForRole(
        champions.filter((champion) => isChampionInRole(champion, queueRole)),
        queueRole
      ),
    [champions, queueRole]
  );
  const championsById = useMemo(
    () => new Map(champions.map((champion) => [champion.id, champion] as const)),
    [champions]
  );
  const previewItems = useMemo(
    () => buildLaneQueueItems(roleChampions, matchups, queueMode, queueRole),
    [matchups, queueMode, queueRole, roleChampions]
  );
  const stats = getQueueStats(queueState);
  const failedItems = queueState.items.filter((item) => item.status === "failed");
  const activeItem = queueState.items.find((item) => item.status === "running");
  const queueRoleLabel = getRoleLabel(queueRole);
  const queueLaneLabel = `${queueRoleLabel} lane`;
  const canStart =
    !isDisabled &&
    queueState.status === "idle" &&
    queueState.items.length === 0 &&
    previewItems.length > 0;
  const canResume =
    !isDisabled &&
    queueState.status !== "running" &&
    queueState.items.some((item) => item.status === "pending");
  const canRetryFailed =
    !isDisabled && queueState.status !== "running" && failedItems.length > 0;

  useEffect(() => {
    matchupsRef.current = matchups;
  }, [matchups]);

  useEffect(() => {
    queueStateRef.current = queueState;
  }, [queueState]);

  useEffect(() => {
    const animationFrameId = window.requestAnimationFrame(() => {
      const storageKey = getMatchupQueueStorageKey(queueRole);
      const storedValue =
        window.localStorage.getItem(storageKey) ??
        (queueRole === "mid"
          ? window.localStorage.getItem(legacyMidMatchupQueueStorageKey)
          : null);

      if (!storedValue) {
        const emptyState = createEmptyQueueState("missing-only", queueRole);
        setQueueMode(emptyState.mode);
        queueStateRef.current = emptyState;
        setQueueState(emptyState);
        return;
      }

      const restoredState = parseStoredQueueState(storedValue, queueRole);

      if (!restoredState) {
        window.localStorage.removeItem(storageKey);
        if (queueRole === "mid") {
          window.localStorage.removeItem(legacyMidMatchupQueueStorageKey);
        }
        const emptyState = createEmptyQueueState("missing-only", queueRole);
        setQueueMode(emptyState.mode);
        queueStateRef.current = emptyState;
        setQueueState(emptyState);
        return;
      }

      const normalizedState =
        restoredState.status === "running"
          ? { ...restoredState, status: "paused" as const }
          : restoredState;

      setQueueMode(normalizedState.mode);
      queueStateRef.current = normalizedState;
      window.localStorage.setItem(storageKey, JSON.stringify(normalizedState));
      if (queueRole === "mid") {
        window.localStorage.removeItem(legacyMidMatchupQueueStorageKey);
      }
      setQueueState(normalizedState);
    });

    return () => window.cancelAnimationFrame(animationFrameId);
  }, [queueRole]);

  useEffect(() => {
    const isActive = queueState.status === "running";
    onActiveChange(isActive);

    return () => onActiveChange(false);
  }, [onActiveChange, queueState.status]);

  function commitQueueState(nextState: LeagueMatchupQueueState) {
    queueStateRef.current = nextState;
    persistQueueState(nextState);
    setQueueState(nextState);
  }

  function persistQueueState(nextState: LeagueMatchupQueueState) {
    const storageKey = getMatchupQueueStorageKey(nextState.role);

    if (nextState.status === "idle" && nextState.items.length === 0) {
      window.localStorage.removeItem(storageKey);
      if (nextState.role === "mid") {
        window.localStorage.removeItem(legacyMidMatchupQueueStorageKey);
      }
      return;
    }

    window.localStorage.setItem(storageKey, JSON.stringify(nextState));
    if (nextState.role === "mid") {
      window.localStorage.removeItem(legacyMidMatchupQueueStorageKey);
    }
  }

  function updateQueueState(
    updater: (currentState: LeagueMatchupQueueState) => LeagueMatchupQueueState
  ) {
    commitQueueState(updater(queueStateRef.current));
  }

  function addQueueDebugMessage(
    type: "error" | "info" | "success",
    text: string
  ) {
    queueDebugMessageIdRef.current += 1;
    const messageId = `queue-debug-${queueDebugMessageIdRef.current}`;

    setQueueDebugMessages((currentMessages) => [
      {
        id: messageId,
        text,
        type,
      },
      ...currentMessages,
    ].slice(0, 8));
  }

  function startQueue() {
    const items = buildLaneQueueItems(
      roleChampions,
      matchupsRef.current,
      queueMode,
      queueRole
    );
    const skippedExistingDraftCount =
      queueMode === "missing-only"
        ? Math.max(
            buildLaneQueueItems(
              roleChampions,
              matchupsRef.current,
              "regenerate-all",
              queueRole
            ).length - items.length,
            0
          )
        : 0;

    if (items.length === 0) {
      setQueueMessage({
        text:
          queueMode === "missing-only"
            ? `No missing ${queueLaneLabel} matchup drafts found.`
            : `No ${queueLaneLabel} champion pairs are available to generate.`,
        type: "error",
      });
      return;
    }

    const now = getQueueTimestamp();
    const nextState = {
      createdAt: now,
      items,
      mode: queueMode,
      role: queueRole,
      status: "running" as const,
      updatedAt: now,
    };

    setQueueMessage(null);
    setQueueDebugMessages([]);
    if (skippedExistingDraftCount > 0) {
      addQueueDebugMessage(
        "info",
        `${skippedExistingDraftCount} existing saved draft${
          skippedExistingDraftCount === 1 ? "" : "s"
        } skipped by missing-only mode.`
      );
    }
    commitQueueState(nextState);
    void processQueue();
  }

  function pauseQueue() {
    updateQueueState((currentState) => ({
      ...currentState,
      status: "paused",
      updatedAt: Date.now(),
    }));
  }

  function resumeQueue() {
    setQueueMessage(null);
    updateQueueState((currentState) => ({
      ...currentState,
      status: "running",
      updatedAt: Date.now(),
    }));
    void processQueue();
  }

  function stopQueue() {
    updateQueueState((currentState) => ({
      ...currentState,
      items: currentState.items.map((item) =>
        item.status === "running" ? { ...item, status: "pending" } : item
      ),
      status: "stopped",
      updatedAt: Date.now(),
    }));
    addQueueDebugMessage(
      "info",
      "Queue stopped. Progress was saved and remaining pending items were preserved."
    );
    void onRefresh();
  }

  function retryFailedItems() {
    setQueueMessage(null);
    updateQueueState((currentState) => ({
      ...currentState,
      items: currentState.items.map((item) =>
        item.status === "failed"
          ? {
              ...item,
              completedAt: null,
              durationMs: null,
              error: null,
              status: "pending",
            }
          : item
      ),
      status: "running",
      updatedAt: Date.now(),
    }));
    void processQueue();
  }

  function clearQueue() {
    const nextState = createEmptyQueueState(queueMode, queueRole);

    setQueueMessage(null);
    setQueueDebugMessages([]);
    commitQueueState(nextState);
  }

  function updateQueueRole(nextRole: AdminLeagueMatchup["role"]) {
    if (queueState.status === "running") {
      return;
    }

    setQueueMessage(null);
    setQueueDebugMessages([]);
    setQueueRole(nextRole);
  }

  async function processQueue() {
    if (isProcessingRef.current) {
      return;
    }

    isProcessingRef.current = true;

    try {
      while (queueStateRef.current.status === "running") {
        const currentState = queueStateRef.current;
        const nextItemIndex = currentState.items.findIndex(
          (item) => item.status === "pending"
        );

        if (nextItemIndex === -1) {
          const finalStats = getQueueStats(currentState);
          const didRefresh = await onRefresh();

          updateQueueState((state) => ({
            ...state,
            status: "complete",
            updatedAt: Date.now(),
          }));
          addQueueDebugMessage(
            didRefresh ? "success" : "error",
            didRefresh
              ? "Admin matchup list refreshed after queue completion."
              : "Queue completed, but the admin matchup list could not refresh."
          );
          setQueueMessage({
            text:
              finalStats.failed > 0
                ? `Queue completed with ${finalStats.failed} failed matchup${
                    finalStats.failed === 1 ? "" : "s"
                  }.`
                : `Queue completed. ${finalStats.generated} draft${
                    finalStats.generated === 1 ? "" : "s"
                  } generated.`,
            type: finalStats.failed > 0 ? "error" : "success",
          });
          return;
        }

        const nextItem = currentState.items[nextItemIndex];
        const startedAt = Date.now();
        const nextItemLabel = getQueueItemLabel(nextItem, championsById);

        addQueueDebugMessage("info", `Generating ${nextItemLabel}.`);
        updateQueueItem(nextItem.id, {
          error: null,
          status: "running",
        });

        const result = await onGenerateQueueItem(
          getFreshQueuePlanItem(nextItem, matchupsRef.current)
        );
        const completedAt = Date.now();

        if (result.ok) {
          addQueueDebugMessage(
            "success",
            result.skipped
              ? `Skipped ${nextItemLabel}; an existing saved draft was confirmed as matchup #${result.matchupId}.`
              : `Saved ${nextItemLabel} as matchup #${result.matchupId}.`
          );
          updateQueueItem(nextItem.id, {
            completedAt,
            durationMs: completedAt - startedAt,
            error: result.profileWarning ?? null,
            matchupId: result.matchupId,
            status: "generated",
          });
        } else {
          addQueueDebugMessage(
            "error",
            `Save failed for ${nextItemLabel}: ${result.error}`
          );
          updateQueueItem(nextItem.id, {
            completedAt,
            durationMs: completedAt - startedAt,
            error: result.error || `Could not generate ${nextItemLabel}.`,
            status: "failed",
          });
        }
      }
    } finally {
      isProcessingRef.current = false;
    }
  }

  function updateQueueItem(
    itemId: string,
    patch: Partial<LeagueMatchupQueueItem>
  ) {
    updateQueueState((currentState) => ({
      ...currentState,
      items: currentState.items.map((item) =>
        item.id === itemId ? { ...item, ...patch } : item
      ),
      updatedAt: Date.now(),
    }));
  }

  return (
    <Card className="border-cyan-300/15 bg-[#10182b]/90 text-white shadow-xl shadow-black/15">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="font-mono text-xl">
              {queueRoleLabel} lane bulk generation queue
            </CardTitle>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
              Generate missing {queueLaneLabel} matchup drafts one at a time
              with pause, resume, stop, retry, and refresh-safe progress.
            </p>
          </div>
          <span className="rounded-md border border-cyan-300/20 bg-cyan-400/10 px-2 py-1 text-xs text-cyan-100">
            Admin only
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <QueueStat label="Generated" value={stats.generated} />
          <QueueStat label="Total" value={stats.total} />
          <QueueStat label="Remaining" value={stats.remaining} />
          <QueueStat label="Failed" value={stats.failed} />
          <QueueStat
            label="ETA"
            value={stats.etaMs ? formatDuration(stats.etaMs) : "Pending"}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-4 rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <div>
              <p className="font-semibold text-white">Queue lane and mode</p>
              <p className="mt-1 text-xs text-zinc-500">
                {roleChampions.length} {queueLaneLabel} champions available for
                directional matchup generation.
              </p>
            </div>

            <label className="grid gap-2 text-sm text-zinc-300">
              Lane
              <select
                className={fieldClassName}
                disabled={queueState.status === "running"}
                onChange={(event) =>
                  updateQueueRole(event.target.value as AdminLeagueMatchup["role"])
                }
                value={queueRole}
              >
                {leagueRoles.map((role) => (
                  <option className={selectOptionClassName} key={role} value={role}>
                    {getRoleLabel(role)}
                  </option>
                ))}
              </select>
              {queueState.status === "running" ? (
                <span className="text-xs text-zinc-500">
                  Stop or finish the running queue before switching lanes.
                </span>
              ) : null}
            </label>

            <div className="grid gap-2">
              <label className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/10 p-3 text-sm text-zinc-300">
                <input
                  checked={queueMode === "missing-only"}
                  className="size-4 accent-violet-500"
                  disabled={queueState.status === "running"}
                  onChange={() => setQueueMode("missing-only")}
                  type="radio"
                />
                Generate missing only
              </label>
              <label className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/10 p-3 text-sm text-zinc-300">
                <input
                  checked={queueMode === "regenerate-all"}
                  className="size-4 accent-violet-500"
                  disabled={queueState.status === "running"}
                  onChange={() => setQueueMode("regenerate-all")}
                  type="radio"
                />
                Regenerate all
              </label>
            </div>

            <div className="rounded-md border border-white/10 bg-black/15 p-3 text-sm text-zinc-300">
              <p>
                {previewItems.length} matchup
                {previewItems.length === 1 ? "" : "s"} will be queued with the
                current mode.
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Existing saved drafts are skipped unless regenerate all is
                selected.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-violet-300/15 bg-violet-500/[0.06] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="flex items-center gap-2 font-semibold text-white">
                  <Clock3 className="size-4 text-violet-200" aria-hidden="true" />
                  Queue controls
                </p>
                <p className="mt-1 text-sm text-zinc-300">
                  Status: {titleCase(queueState.status)}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  className="h-10 bg-violet-500/80 px-4 text-white hover:bg-violet-500"
                  disabled={!canStart}
                  onClick={startQueue}
                  type="button"
                >
                  <Play className="size-4" aria-hidden="true" />
                  Start
                </Button>
                <Button
                  className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
                  disabled={queueState.status !== "running"}
                  onClick={pauseQueue}
                  type="button"
                  variant="ghost"
                >
                  <Pause className="size-4" aria-hidden="true" />
                  Pause
                </Button>
                <Button
                  className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
                  disabled={!canResume}
                  onClick={resumeQueue}
                  type="button"
                  variant="ghost"
                >
                  <Play className="size-4" aria-hidden="true" />
                  Resume
                </Button>
                <Button
                  className="border-rose-300/20 bg-rose-500/10 text-rose-100 hover:bg-rose-500/20"
                  disabled={queueState.status !== "running"}
                  onClick={stopQueue}
                  type="button"
                  variant="ghost"
                >
                  <Square className="size-4" aria-hidden="true" />
                  Stop
                </Button>
              </div>
            </div>

            {activeItem ? (
              <p className="mt-4 rounded-md border border-cyan-300/20 bg-cyan-400/10 p-3 text-sm text-cyan-100">
                Generating {getQueueItemLabel(activeItem, championsById)}
              </p>
            ) : null}

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/30">
              <div
                className="h-full rounded-full bg-cyan-300 transition-[width] duration-300"
                style={{
                  width:
                    stats.total === 0
                      ? "0%"
                      : `${Math.round((stats.processed / stats.total) * 100)}%`,
                }}
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
                disabled={!canRetryFailed}
                onClick={retryFailedItems}
                size="sm"
                type="button"
                variant="ghost"
              >
                <RefreshCw className="size-3.5" aria-hidden="true" />
                Retry failed
              </Button>
              <Button
                className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
                disabled={queueState.status === "running" || stats.total === 0}
                onClick={clearQueue}
                size="sm"
                type="button"
                variant="ghost"
              >
                Clear saved queue
              </Button>
            </div>

            {queueMessage ? (
              <p
                className={cn(
                  "mt-4 rounded-md border p-3 text-sm",
                  queueMessage.type === "error"
                    ? "border-rose-400/20 bg-rose-500/10 text-rose-100"
                    : "border-emerald-400/20 bg-emerald-500/10 text-emerald-100"
                )}
              >
                {queueMessage.text}
              </p>
            ) : null}

            {queueDebugMessages.length > 0 ? (
              <div className="mt-4 rounded-md border border-white/10 bg-black/15 p-3">
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-zinc-500">
                  Queue debug
                </p>
                <ol className="mt-2 space-y-1 text-xs">
                  {queueDebugMessages.map((message) => (
                    <li
                      className={cn(
                        message.type === "error"
                          ? "text-rose-100"
                          : message.type === "success"
                            ? "text-emerald-100"
                            : "text-zinc-300"
                      )}
                      key={message.id}
                    >
                      {message.text}
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}
          </div>
        </div>

        {failedItems.length > 0 ? (
          <div className="rounded-lg border border-rose-300/20 bg-rose-500/[0.06] p-4">
            <p className="font-semibold text-rose-100">Failed matchups</p>
            <ol className="mt-3 max-h-64 space-y-2 overflow-auto pr-1 text-sm">
              {failedItems.map((item) => (
                <li
                  className="rounded-md border border-rose-300/15 bg-black/15 p-3"
                  key={item.id}
                >
                  <p className="font-medium text-white">
                    {getQueueItemLabel(item, championsById)}
                  </p>
                  <p className="mt-1 text-rose-100">
                    {item.error ?? "Generation failed."}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function QueueStat({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-zinc-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
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

function groupFeedbackForAdmin(feedback: AdminLeagueMatchupFeedback[]) {
  const groups = new Map<
    string,
    { id: string; items: AdminLeagueMatchupFeedback[]; title: string }
  >();

  for (const item of feedback) {
    const id = `${item.matchup_id}:${item.lane}:${item.card_type}:${item.reason ?? "general"}:${item.status}`;
    const existingGroup = groups.get(id);
    const title = `${item.player_champion} vs ${item.enemy_champion} · ${getRoleLabel(
      item.lane
    )} · ${getCardTypeLabel(item.card_type)} · ${
      item.reason ? getFeedbackReasonLabel(item.reason) : getFeedbackTypeLabel(item.feedback_type)
    } · ${titleCase(item.status)}`;

    if (existingGroup) {
      existingGroup.items.push(item);
    } else {
      groups.set(id, { id, items: [item], title });
    }
  }

  return Array.from(groups.values());
}

function getFeedbackCountsByStatus(feedback: AdminLeagueMatchupFeedback[]) {
  return {
    dismissed: feedback.filter((item) => item.status === "dismissed").length,
    open: feedback.filter((item) => item.status === "open").length,
    resolved: feedback.filter((item) => item.status === "resolved").length,
    reviewing: feedback.filter((item) => item.status === "reviewing").length,
  };
}

function getUniqueFeedbackValues<
  TKey extends "card_type" | "reason"
>(feedback: AdminLeagueMatchupFeedback[], key: TKey) {
  return Array.from(
    new Set(
      feedback
        .map((item) => item[key])
        .filter((value): value is NonNullable<AdminLeagueMatchupFeedback[TKey]> =>
          Boolean(value)
        )
    )
  ).sort();
}

function getFeedbackSectionKey(cardType: string): MatchupDraftSectionKey | null {
  const sectionKeys: MatchupDraftSectionKey[] = [
    "danger_windows",
    "early_game",
    "overview",
    "power_spikes",
    "trading_pattern",
    "win_conditions",
  ];

  return sectionKeys.includes(cardType as MatchupDraftSectionKey)
    ? (cardType as MatchupDraftSectionKey)
    : null;
}

function getFeedbackCardText(
  matchup: AdminLeagueMatchup | undefined,
  cardType: string
) {
  const sectionKey = getFeedbackSectionKey(cardType);

  return sectionKey && matchup ? matchup[sectionKey] : null;
}

function getCardTypeLabel(value: string) {
  return value
    .split("_")
    .map((part) => titleCase(part))
    .join(" ");
}

function getFeedbackReasonLabel(value: string) {
  switch (value) {
    case "ability_formatting_issue":
      return "Ability formatting issue";
    case "incorrect_advice":
      return "Incorrect advice";
    case "missing_information":
      return "Missing information";
    case "too_generic":
      return "Too generic";
    case "wrong_champion_perspective":
      return "Wrong champion perspective";
    case "other":
      return "Other";
    default:
      return getCardTypeLabel(value);
  }
}

function getFeedbackTypeLabel(
  value: AdminLeagueMatchupFeedback["feedback_type"]
) {
  switch (value) {
    case "helpful":
      return "Helpful";
    case "not_helpful":
      return "Not helpful";
    case "report_issue":
      return "Reported issue";
  }
}

function formatFeedbackDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
  }).format(new Date(value));
}

function getMatchupKey(
  championAId: string,
  championBId: string,
  role: AdminLeagueMatchup["role"]
) {
  return `${role}:${championAId}:${championBId}`;
}

function getLaneMatchupGroups({
  champions,
  matchups,
  roleFilter,
  sortMode,
}: {
  champions: AdminLeagueChampion[];
  matchups: AdminLeagueMatchup[];
  roleFilter: LeagueMatchupRoleFilter;
  sortMode: LeagueMatchupSortMode;
}): LaneMatchupGroup[] {
  const roles = roleFilter === "all" ? leagueRoles : [roleFilter];

  return roles.map((role) => {
    const roleMatchups = matchups.filter((matchup) => matchup.role === role);
    const championGroups = getChampionMatchupGroupsForRole({
      champions,
      matchups: roleMatchups,
      role,
      sortMode,
    });
    const reviewedCount = roleMatchups.filter(
      (matchup) => matchup.generation_status === "reviewed"
    ).length;

    return {
      championCount: championGroups.length,
      championGroups,
      draftCount: roleMatchups.length - reviewedCount,
      reviewedCount,
      role,
      title: getLaneGroupLabel(role),
      totalCount: roleMatchups.length,
    };
  });
}

function getChampionMatchupGroupsForRole({
  champions,
  matchups,
  role,
  sortMode,
}: {
  champions: AdminLeagueChampion[];
  matchups: AdminLeagueMatchup[];
  role: AdminLeagueMatchup["role"];
  sortMode: LeagueMatchupSortMode;
}): ChampionMatchupGroup[] {
  const championsById = new Map(
    champions.map((champion) => [champion.id, champion] as const)
  );
  const filteredApprovableDraftIdsByChampion = new Map<string, Set<number>>();
  const matchupsBySourceChampion = new Map<string, AdminLeagueMatchup[]>();

  for (const matchup of matchups) {
    matchupsBySourceChampion.set(matchup.champion_a_id, [
      ...(matchupsBySourceChampion.get(matchup.champion_a_id) ?? []),
      matchup,
    ]);

    if (
      matchup.generation_status === "draft" &&
      hasMatchupDraftContent(matchup)
    ) {
      for (const championId of [matchup.champion_a_id, matchup.champion_b_id]) {
        const draftIds =
          filteredApprovableDraftIdsByChampion.get(championId) ?? new Set<number>();

        draftIds.add(matchup.id);
        filteredApprovableDraftIdsByChampion.set(championId, draftIds);
      }
    }
  }

  const sourceChampionIds = new Set(matchups.map((matchup) => matchup.champion_a_id));

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
      const missingCount = Math.max(
        champions.filter(
          (championOption) =>
            championOption.id !== championId && isChampionInRole(championOption, role)
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
        approvableDraftIds: Array.from(
          filteredApprovableDraftIdsByChampion.get(championId) ?? []
        ),
        draftCount,
        id: `${role}:${championId}`,
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

function getLaneGroupLabel(role: AdminLeagueMatchup["role"]) {
  return role === "adc" ? "Bot / ADC" : getRoleLabel(role);
}

function getDefaultCollapsedLaneGroups(roleFilter: LeagueMatchupRoleFilter) {
  return Object.fromEntries(
    leagueRoles.map((role) => [
      role,
      roleFilter === "all" ? role !== "mid" : role !== roleFilter,
    ])
  ) as Record<AdminLeagueMatchup["role"], boolean>;
}

function getMatchupContentState(matchup: AdminLeagueMatchup) {
  const hasContent = hasMatchupDraftContent(matchup);

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

function hasMatchupDraftContent(matchup: AdminLeagueMatchup) {
  return [
    matchup.overview,
    matchup.early_game,
    matchup.trading_pattern,
    matchup.power_spikes,
    matchup.danger_windows,
    matchup.win_conditions,
  ].some((value) => Boolean(value?.trim()));
}

function createEmptyQueueState(
  mode: LeagueMatchupQueueMode,
  role: AdminLeagueMatchup["role"]
): LeagueMatchupQueueState {
  const now = getQueueTimestamp();

  return {
    createdAt: now,
    items: [],
    mode,
    role,
    status: "idle",
    updatedAt: now,
  };
}

function getQueueTimestamp() {
  return Date.now();
}

function getMatchupQueueStorageKey(role: AdminLeagueMatchup["role"]) {
  return `${matchupQueueStorageKeyPrefix}.${role}`;
}

function buildLaneQueueItems(
  roleChampions: AdminLeagueChampion[],
  matchups: AdminLeagueMatchup[],
  mode: LeagueMatchupQueueMode,
  role: AdminLeagueMatchup["role"]
): LeagueMatchupQueueItem[] {
  const existingMatchupsByKey = new Map(
    matchups.map((matchup) => [
      getMatchupKey(matchup.champion_a_id, matchup.champion_b_id, matchup.role),
      matchup,
    ])
  );
  const items: LeagueMatchupQueueItem[] = [];

  for (const championA of roleChampions) {
    for (const championB of roleChampions) {
      if (championA.id === championB.id) {
        continue;
      }

      const key = getMatchupKey(championA.id, championB.id, role);
      const existingMatchup = existingMatchupsByKey.get(key);

      if (
        mode === "missing-only" &&
        existingMatchup &&
        hasMatchupDraftContent(existingMatchup)
      ) {
        continue;
      }

      items.push({
        championAId: championA.id,
        championBId: championB.id,
        completedAt: null,
        durationMs: null,
        error: null,
        existingMatchupId: existingMatchup?.id ?? null,
        id: key,
        matchupId: existingMatchup?.id ?? null,
        role,
        status: "pending",
      });
    }
  }

  return items;
}

function getFreshQueuePlanItem(
  item: LeagueMatchupQueueItem,
  matchups: AdminLeagueMatchup[]
): LeagueMatchupBatchPlanItem {
  const freshMatchup = matchups.find(
    (matchup) =>
      matchup.champion_a_id === item.championAId &&
      matchup.champion_b_id === item.championBId &&
      matchup.role === item.role
  );

  return {
    championAId: item.championAId,
    championBId: item.championBId,
    existingMatchupId:
      freshMatchup?.id ?? item.matchupId ?? item.existingMatchupId ?? null,
    role: item.role,
  };
}

function getQueueItemLabel(
  item: LeagueMatchupBatchPlanItem,
  championsById: Map<string, AdminLeagueChampion>
) {
  const championA = championsById.get(item.championAId)?.name ?? item.championAId;
  const championB = championsById.get(item.championBId)?.name ?? item.championBId;

  return `${championA} vs ${championB}`;
}

function getQueueStats(queueState: LeagueMatchupQueueState) {
  const generated = queueState.items.filter(
    (item) => item.status === "generated"
  ).length;
  const failed = queueState.items.filter((item) => item.status === "failed").length;
  const processed = generated + failed;
  const remaining = Math.max(queueState.items.length - processed, 0);
  const completedDurations = queueState.items
    .map((item) => item.durationMs)
    .filter((duration): duration is number => typeof duration === "number");
  const averageDurationMs =
    completedDurations.length > 0
      ? completedDurations.reduce((sum, duration) => sum + duration, 0) /
        completedDurations.length
      : 0;

  return {
    etaMs: averageDurationMs > 0 ? averageDurationMs * remaining : null,
    failed,
    generated,
    processed,
    remaining,
    total: queueState.items.length,
  };
}

function formatDuration(durationMs: number) {
  const totalSeconds = Math.max(Math.round(durationMs / 1_000), 1);
  const hours = Math.floor(totalSeconds / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }

  return `${seconds}s`;
}

function parseStoredQueueState(
  value: string,
  fallbackRole: AdminLeagueMatchup["role"]
): LeagueMatchupQueueState | null {
  try {
    const parsedValue: unknown = JSON.parse(value);

    if (!parsedValue || typeof parsedValue !== "object") {
      return null;
    }

    const candidate = parsedValue as Partial<LeagueMatchupQueueState>;

    if (
      !Array.isArray(candidate.items) ||
      !candidate.mode ||
      !candidate.status ||
      typeof candidate.createdAt !== "number" ||
      typeof candidate.updatedAt !== "number"
    ) {
      return null;
    }

    if (
      candidate.mode !== "missing-only" &&
      candidate.mode !== "regenerate-all"
    ) {
      return null;
    }

    if (!isQueueStatus(candidate.status)) {
      return null;
    }

    const role = isLeagueMatchupRole(candidate.role)
      ? candidate.role
      : fallbackRole;

    if (role !== fallbackRole) {
      return null;
    }

    const items = candidate.items
      .map((item) => parseStoredQueueItem(item, role))
      .filter((item): item is LeagueMatchupQueueItem => Boolean(item));

    return {
      createdAt: candidate.createdAt,
      items,
      mode: candidate.mode,
      role,
      status: candidate.status,
      updatedAt: candidate.updatedAt,
    };
  } catch {
    return null;
  }
}

function parseStoredQueueItem(
  value: unknown,
  fallbackRole: AdminLeagueMatchup["role"]
): LeagueMatchupQueueItem | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Partial<LeagueMatchupQueueItem>;
  const role = isLeagueMatchupRole(candidate.role)
    ? candidate.role
    : fallbackRole;

  if (
    typeof candidate.championAId !== "string" ||
    typeof candidate.championBId !== "string" ||
    typeof candidate.id !== "string" ||
    role !== fallbackRole ||
    !candidate.status ||
    !isQueueItemStatus(candidate.status)
  ) {
    return null;
  }

  return {
    championAId: candidate.championAId,
    championBId: candidate.championBId,
    completedAt:
      typeof candidate.completedAt === "number" ? candidate.completedAt : null,
    durationMs: typeof candidate.durationMs === "number" ? candidate.durationMs : null,
    error: typeof candidate.error === "string" ? candidate.error : null,
    existingMatchupId:
      typeof candidate.existingMatchupId === "number"
        ? candidate.existingMatchupId
        : null,
    id: candidate.id,
    matchupId: typeof candidate.matchupId === "number" ? candidate.matchupId : null,
    role,
    status: candidate.status === "running" ? "pending" : candidate.status,
  };
}

function isLeagueMatchupRole(
  value: unknown
): value is AdminLeagueMatchup["role"] {
  return (
    typeof value === "string" &&
    leagueRoles.includes(value as AdminLeagueMatchup["role"])
  );
}

function isQueueStatus(value: string): value is LeagueMatchupQueueStatus {
  return ["complete", "idle", "paused", "running", "stopped"].includes(value);
}

function isQueueItemStatus(value: string): value is LeagueMatchupQueueItemStatus {
  return ["failed", "generated", "pending", "running"].includes(value);
}
