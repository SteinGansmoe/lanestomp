import Image from "next/image";
import Link from "next/link";
import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  Pencil,
  Plus,
  RefreshCw,
  RotateCcw,
  Save,
  Search,
  Square,
  Trash2,
  X,
} from "lucide-react";

import {
  batchSaveCounterRankingV2MechanicalReviews,
  getCounterPickManagementMetrics,
  getCounterRankingV2MechanicalReviews,
  saveCounterRankingV2MechanicalReview,
  type BatchCounterRankingV2MechanicalReviewAction,
} from "@/src/app/admin/league/counter-picks/actions";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import type { CounterPickManagementMetrics } from "@/src/features/league/counter-pick-management-metrics";
import { fetchCounterPickStatsByEnemyAndRole } from "@/src/features/league/counter-pick-stats";
import {
  compareCounterPickStatistics,
  publicCounterPickMinimumRankedGames,
  toPublicCounterPickResult,
} from "@/src/features/league/counter-pick-statistics";
import {
  counterRankingV2SupportedChampionIds,
  counterRankingV2AdjustmentReasons,
  counterRankingV2ReviewStatuses,
  counterRankingV2TraitDefinitionsById,
  createObservedCounterRankingV2Snapshot,
  calculateCounterRankingV2FinalMechanicalScore,
  counterRankingV2DefaultAdjustmentReason,
  counterRankingV2DefaultReviewStatus,
  clampCounterRankingV2ManualAdjustment,
  filterCounterRankingV2RowsByReviewFilter,
  generateCounterRankingV2MechanicalSuggestionsForRole,
  getCounterRankingV2MechanicalReasons,
  getCounterRankingV2ChampionProfile,
  getCounterRankingV2AutomationSummary,
  getCounterRankingV2PublicPreviewRows,
  getCounterRankingV2ReviewProgressSummary,
  hasCounterRankingV2WeakMechanicalSignal,
  isCounterRankingV2ReviewPublicEligible,
  isCounterRankingV2ReviewStatusPublicEligible,
  isCounterRankingV2SupportedChampion,
  sortCounterRankingV2RowsByReviewPriority,
  useReviewedMechanicalCountersPublicly,
  type CounterRankingV2AdjustmentReason,
  type CounterRankingV2AutomationConfidence,
  type CounterRankingV2AutomationStatus,
  type CounterRankingV2AutomationSummary,
  type CounterRankingV2ComparisonRow,
  type CounterRankingV2FitStatus,
  type CounterRankingV2FactorImpactLevel,
  type CounterRankingV2MechanicalReview,
  type CounterRankingV2ObservedRankSnapshot,
  type CounterRankingV2ProfileStatus,
  type CounterRankingV2PublicPreviewRow,
  type CounterRankingV2ReviewFilter,
  type CounterRankingV2ReviewProgressSummary,
  type CounterRankingV2ReviewStatus,
  type CounterRankingV2SuggestedStrength,
  type CounterRankingV2TraitId,
} from "@/src/features/league/counter-ranking-v2";
import { isChampionInRole, sortChampionsForRole } from "@/src/features/league/champion-roles";
import { getChampionCombatProfile } from "@/src/features/league/champion-knowledge";
import { getChampionIconPath } from "@/src/features/league/champions";
import { leagueRoles, type LeagueRole } from "@/src/features/league/roles";
import { cn } from "@/src/lib/utils";
import { supabase } from "@/src/lib/supabase";
import { fieldClassName, selectOptionClassName } from "../constants";
import type {
  AdminLeagueChampion,
  FormStatus,
  LeagueCounterPick,
  LeagueCounterPickType,
} from "../types";
import { RiotMatchScannerPanel } from "./riot-match-scanner-panel";

type CounterPickStatusFilter = LeagueCounterPick["generation_status"] | "all";
type CounterPickTypeFilter = LeagueCounterPickType | "all";
type CounterPickAdminView = "collect" | "editorial" | "overview" | "shadow-ranking";
type CounterPickEditForm = {
  counter_strength: string;
  counter_type: LeagueCounterPickType;
  reason: string;
};
type CounterPickCreateForm = CounterPickEditForm & {
  counter_champion_id: string;
};
type CounterRankingV2ReviewForm = {
  adjustmentReason: CounterRankingV2AdjustmentReason;
  adminReviewNote: string;
  manualAdjustment: string;
  publicEligible: boolean;
  reviewStatus: CounterRankingV2ReviewStatus;
};
type CounterRankingV2ShadowReviewFilterOption = {
  filter: CounterRankingV2ReviewFilter;
  label: string;
};

const emptyCreateForm: CounterPickCreateForm = {
  counter_champion_id: "",
  counter_strength: "",
  counter_type: "best_counter",
  reason: "",
};
const counterRankingV2ShadowReviewFilterOptions = [
  { filter: "all", label: "All" },
  { filter: "auto_approval_candidate", label: "Auto approval candidate" },
  { filter: "auto_suggested", label: "Auto suggested" },
  { filter: "auto_approved", label: "Auto approved" },
  { filter: "needs_review", label: "Needs review automation" },
  { filter: "manual_approved", label: "Manual approved" },
  { filter: "manual_rejected", label: "Manual rejected" },
  { filter: "unreviewed", label: "Unreviewed" },
  { filter: "verified_strong_counter", label: "Verified strong counter" },
  { filter: "verified_soft_counter", label: "Verified soft counter" },
  { filter: "needs_more_data", label: "Needs more data" },
  { filter: "incorrect_suggestion", label: "Incorrect suggestion" },
  { filter: "public_eligible", label: "Public eligible" },
  { filter: "low_sample", label: "Low sample" },
] as const satisfies readonly CounterRankingV2ShadowReviewFilterOption[];

export function AdminLeagueCounterPicksSection({
  champions,
  counterPicks,
  onRefresh,
  view = "editorial",
}: {
  champions: AdminLeagueChampion[];
  counterPicks: LeagueCounterPick[];
  onRefresh: () => Promise<boolean>;
  view?: CounterPickAdminView;
}) {
  const [championSearch, setChampionSearch] = useState("");
  const [counterSearch, setCounterSearch] = useState("");
  const [selectedChampionId, setSelectedChampionId] = useState("");
  const [selectedRole, setSelectedRole] = useState<LeagueRole>("mid");
  const [statusFilter, setStatusFilter] = useState<CounterPickStatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<CounterPickTypeFilter>("all");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(() => new Set());
  const [editingCounterPickId, setEditingCounterPickId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<CounterPickEditForm>({
    counter_strength: "",
    counter_type: "best_counter",
    reason: "",
  });
  const [createForm, setCreateForm] = useState<CounterPickCreateForm>(emptyCreateForm);
  const [createStatus, setCreateStatus] = useState<FormStatus>({
    error: null,
    isLoading: false,
    success: null,
  });
  const [editStatus, setEditStatus] = useState<FormStatus>({
    error: null,
    isLoading: false,
    success: null,
  });
  const [bulkStatus, setBulkStatus] = useState<FormStatus>({
    error: null,
    isLoading: false,
    success: null,
  });
  const [managementMetrics, setManagementMetrics] = useState<CounterPickManagementMetrics | null>(
    null,
  );
  const [metricsStatus, setMetricsStatus] = useState<FormStatus>({
    error: null,
    isLoading: true,
    success: null,
  });
  const [counterRankingV2ObservedByChampionId, setCounterRankingV2ObservedByChampionId] = useState<
    Map<string, CounterRankingV2ObservedRankSnapshot>
  >(() => new Map());
  const [counterRankingV2ReviewsByCandidateId, setCounterRankingV2ReviewsByCandidateId] = useState<
    Map<string, CounterRankingV2MechanicalReview>
  >(() => new Map());
  const [counterRankingV2Status, setCounterRankingV2Status] = useState<FormStatus>({
    error: null,
    isLoading: false,
    success: null,
  });
  const [counterRankingV2ReviewStatus, setCounterRankingV2ReviewStatus] = useState<FormStatus>({
    error: null,
    isLoading: false,
    success: null,
  });
  const [savingCounterRankingV2ReviewKey, setSavingCounterRankingV2ReviewKey] = useState<
    string | null
  >(null);
  const [hasResolvedInitialSelection, setHasResolvedInitialSelection] = useState(false);
  const hasInitializedSelection = useRef(false);

  const championsById = useMemo(
    () => new Map(champions.map((champion) => [champion.id, champion] as const)),
    [champions],
  );
  const counterRankingV2ChampionsById = useMemo(
    () =>
      new Map(
        champions.map((champion) => [
          normalizeCounterRankingV2ChampionId(champion.id),
          champion,
        ] as const),
      ),
    [champions],
  );
  const roleSortedChampions = useMemo(
    () => sortChampionsForRole(champions, selectedRole),
    [champions, selectedRole],
  );
  const championOptions = useMemo(() => {
    const query = championSearch.trim().toLowerCase();

    return roleSortedChampions.filter((champion) => {
      const matchesQuery =
        !query ||
        champion.name.toLowerCase().includes(query) ||
        champion.id.toLowerCase().includes(query);

      return matchesQuery && isChampionInRole(champion, selectedRole, { includeOffMeta: true });
    });
  }, [championSearch, roleSortedChampions, selectedRole]);
  const counterRankingV2DefaultChampionId = useMemo(
    () =>
      counterRankingV2SupportedChampionIds.find((championId) =>
        counterRankingV2ChampionsById.has(championId),
      ) ?? "",
    [counterRankingV2ChampionsById],
  );
  const defaultSelectedChampionId =
    view === "shadow-ranking"
      ? hasResolvedInitialSelection
        ? counterRankingV2DefaultChampionId
        : ""
      : (roleSortedChampions.find((champion) =>
          isChampionInRole(champion, selectedRole, { includeOffMeta: true }),
        )?.id ?? "");
  const effectiveSelectedChampionId = selectedChampionId
    ? (getChampionIdFromOptionMap(counterRankingV2ChampionsById, selectedChampionId) ??
      (championsById.has(selectedChampionId) ? selectedChampionId : defaultSelectedChampionId))
    : defaultSelectedChampionId;
  const selectedChampion = effectiveSelectedChampionId
    ? championsById.get(effectiveSelectedChampionId)
    : null;
  const championSelectOptions = useMemo(
    () => includeSelectedChampionOption(championOptions, selectedChampion),
    [championOptions, selectedChampion],
  );
  const hasSelectedCounterRankingV2Profile = effectiveSelectedChampionId
    ? isCounterRankingV2SupportedChampion(effectiveSelectedChampionId)
    : false;
  const selectedChampionCombatProfile = useMemo(
    () =>
      effectiveSelectedChampionId ? getChampionCombatProfile(effectiveSelectedChampionId) : null,
    [effectiveSelectedChampionId],
  );
  const createCounterChampionOptions = useMemo(
    () => champions.filter((champion) => champion.id !== effectiveSelectedChampionId),
    [champions, effectiveSelectedChampionId],
  );
  const effectiveCreateCounterChampionId = createCounterChampionOptions.some(
    (champion) => champion.id === createForm.counter_champion_id,
  )
    ? createForm.counter_champion_id
    : (createCounterChampionOptions[0]?.id ?? "");
  const visibleCounterPicks = useMemo(
    () =>
      sortCounterPicksForAdmin(
        counterPicks.filter((counterPick) => {
          const counterChampion = championsById.get(counterPick.counter_champion_id);
          const query = counterSearch.trim().toLowerCase();
          const matchesCounterSearch =
            !query ||
            counterPick.counter_champion_id.toLowerCase().includes(query) ||
            Boolean(counterChampion?.name.toLowerCase().includes(query));

          return (
            counterPick.champion_id === effectiveSelectedChampionId &&
            counterPick.role === selectedRole &&
            (statusFilter === "all" || counterPick.generation_status === statusFilter) &&
            (typeFilter === "all" || counterPick.counter_type === typeFilter) &&
            matchesCounterSearch
          );
        }),
      ),
    [
      championsById,
      counterPicks,
      counterSearch,
      effectiveSelectedChampionId,
      selectedRole,
      statusFilter,
      typeFilter,
    ],
  );
  const allVisibleIds = useMemo(
    () => visibleCounterPicks.map((counterPick) => counterPick.id),
    [visibleCounterPicks],
  );
  const selectedVisibleIds = allVisibleIds.filter((id) => selectedIds.has(id));
  const draftVisibleIds = visibleCounterPicks
    .filter((counterPick) => counterPick.generation_status === "draft")
    .map((counterPick) => counterPick.id);
  const draftSelectedIds = visibleCounterPicks
    .filter((counterPick) => selectedIds.has(counterPick.id))
    .filter((counterPick) => counterPick.generation_status === "draft")
    .map((counterPick) => counterPick.id);
  const reviewedVisibleCount = visibleCounterPicks.filter(
    (counterPick) => counterPick.generation_status === "reviewed",
  ).length;
  const counterRankingV2Rows = useMemo(
    () =>
      effectiveSelectedChampionId && hasSelectedCounterRankingV2Profile
        ? sortCounterRankingV2RowsByReviewPriority(
            generateCounterRankingV2MechanicalSuggestionsForRole({
              enemyChampionId: effectiveSelectedChampionId,
              observedByChampionId: counterRankingV2ObservedByChampionId,
              reviewsByCandidateId: counterRankingV2ReviewsByCandidateId,
              role: selectedRole,
            }),
          )
        : [],
    [
      counterRankingV2ObservedByChampionId,
      counterRankingV2ReviewsByCandidateId,
      effectiveSelectedChampionId,
      hasSelectedCounterRankingV2Profile,
      selectedRole,
    ],
  );

  useEffect(() => {
    void loadManagementMetrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (hasInitializedSelection.current || champions.length === 0) {
      return;
    }

    hasInitializedSelection.current = true;

    if (typeof window !== "undefined") {
      const query = new URLSearchParams(window.location.search);
      const requestedChampionId =
        query.get("champion") ?? query.get("enemyChampion") ?? query.get("enemy");
      const requestedRole = normalizeRoleForAdmin(query.get("role"));
      const normalizedRequestedChampion = requestedChampionId
        ? getChampionIdFromOptionMap(counterRankingV2ChampionsById, requestedChampionId)
        : null;

      if (requestedRole) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedRole(requestedRole);
      }

      if (normalizedRequestedChampion) {
        setSelectedChampionId(normalizedRequestedChampion);
        setHasResolvedInitialSelection(true);
        return;
      }
    }

    if (view === "shadow-ranking" && counterRankingV2DefaultChampionId) {
      setSelectedChampionId(counterRankingV2DefaultChampionId);
      setHasResolvedInitialSelection(true);
      return;
    }

    if (defaultSelectedChampionId) {
      setSelectedChampionId(defaultSelectedChampionId);
    }

    setHasResolvedInitialSelection(true);
  }, [
    champions.length,
    counterRankingV2ChampionsById,
    counterRankingV2DefaultChampionId,
    defaultSelectedChampionId,
    view,
  ]);

  useEffect(() => {
    void loadCounterRankingV2ObservedStats();
    void loadCounterRankingV2Reviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveSelectedChampionId, selectedRole]);

  async function getAccessToken() {
    if (!supabase) {
      return {
        error: "Supabase is not configured.",
        ok: false as const,
      };
    }

    const { data, error } = await supabase.auth.getSession();
    const accessToken = data.session?.access_token;

    if (error || !accessToken) {
      return {
        error: "Admin session is not ready.",
        ok: false as const,
      };
    }

    return {
      accessToken,
      ok: true as const,
    };
  }

  async function loadManagementMetrics() {
    const tokenResult = await getAccessToken();

    if (!tokenResult.ok) {
      setMetricsStatus({ error: tokenResult.error, isLoading: false, success: null });
      return;
    }

    setMetricsStatus((currentStatus) => ({
      error: null,
      isLoading: true,
      success: currentStatus.success,
    }));

    const result = await getCounterPickManagementMetrics({
      accessToken: tokenResult.accessToken,
    });

    if (!result.ok) {
      setMetricsStatus({ error: result.error, isLoading: false, success: null });
      return;
    }

    setManagementMetrics(result.metrics);
    setMetricsStatus({ error: null, isLoading: false, success: "Metrics refreshed." });
  }

  async function loadCounterRankingV2ObservedStats() {
    if (!effectiveSelectedChampionId || !hasSelectedCounterRankingV2Profile) {
      setCounterRankingV2ObservedByChampionId(new Map());
      setCounterRankingV2Status({ error: null, isLoading: false, success: null });
      return;
    }

    setCounterRankingV2Status({ error: null, isLoading: true, success: null });

    const result = await fetchCounterPickStatsByEnemyAndRole({
      enemyChampionId: effectiveSelectedChampionId,
      rankBracket: "all",
      role: selectedRole,
    });

    if (result.error) {
      setCounterRankingV2ObservedByChampionId(new Map());
      setCounterRankingV2Status({ error: result.error, isLoading: false, success: null });
      return;
    }

    const publicResults = result.stats
      .map((stat) => toPublicCounterPickResult(stat, effectiveSelectedChampionId))
      .filter((row) => row !== null)
      .sort((left, right) => compareCounterPickStatistics(left.statistics, right.statistics, "desc"));
    const observedByChampionId = new Map(
      publicResults.map((resultRow, index) => [
        normalizeCounterRankingV2ChampionId(resultRow.listedChampionId),
        createObservedCounterRankingV2Snapshot({
          games: resultRow.statistics.games,
          rank: index + 1,
          winRate: resultRow.statistics.winRate,
        }),
      ]),
    );

    setCounterRankingV2ObservedByChampionId(observedByChampionId);
    setCounterRankingV2Status({
      error: null,
      isLoading: false,
      success: `${publicResults.length} observed rows loaded.`,
    });
  }

  async function loadCounterRankingV2Reviews() {
    if (!effectiveSelectedChampionId || !hasSelectedCounterRankingV2Profile) {
      setCounterRankingV2ReviewsByCandidateId(new Map());
      setCounterRankingV2ReviewStatus({ error: null, isLoading: false, success: null });
      return;
    }

    const tokenResult = await getAccessToken();

    if (!tokenResult.ok) {
      setCounterRankingV2ReviewsByCandidateId(new Map());
      setCounterRankingV2ReviewStatus({
        error: tokenResult.error,
        isLoading: false,
        success: null,
      });
      return;
    }

    setCounterRankingV2ReviewStatus({ error: null, isLoading: true, success: null });

    const result = await getCounterRankingV2MechanicalReviews({
      accessToken: tokenResult.accessToken,
      enemyChampionId: effectiveSelectedChampionId,
      role: selectedRole,
    });

    if (!result.ok) {
      setCounterRankingV2ReviewsByCandidateId(new Map());
      setCounterRankingV2ReviewStatus({ error: result.error, isLoading: false, success: null });
      return;
    }

    setCounterRankingV2ReviewsByCandidateId(
      new Map(
        result.reviews.map((review) => [
          normalizeCounterRankingV2ChampionId(review.counterChampionId),
          review,
        ] as const),
      ),
    );
    setCounterRankingV2ReviewStatus({
      error: null,
      isLoading: false,
      success: result.reviews.length > 0 ? `${result.reviews.length} review rows loaded.` : null,
    });
  }

  async function saveCounterRankingV2Review(
    row: CounterRankingV2ComparisonRow,
    form: CounterRankingV2ReviewForm,
  ) {
    const tokenResult = await getAccessToken();

    if (!tokenResult.ok) {
      setCounterRankingV2ReviewStatus({
        error: tokenResult.error,
        isLoading: false,
        success: null,
      });
      return;
    }

    const manualAdjustment = Number(form.manualAdjustment);

    if (!Number.isFinite(manualAdjustment)) {
      setCounterRankingV2ReviewStatus({
        error: "Manual adjustment must be a finite number.",
        isLoading: false,
        success: null,
      });
      return;
    }

    setSavingCounterRankingV2ReviewKey(row.candidateChampionId);
    setCounterRankingV2ReviewStatus({ error: null, isLoading: true, success: null });

    const canonicalCounterChampionId =
      counterRankingV2ChampionsById.get(normalizeCounterRankingV2ChampionId(row.candidateChampionId))
        ?.id ?? row.candidateChampionId;
    const canonicalEnemyChampionId =
      counterRankingV2ChampionsById.get(
        normalizeCounterRankingV2ChampionId(row.mechanicalResult.enemyChampionId),
      )?.id ?? row.mechanicalResult.enemyChampionId;

    const result = await saveCounterRankingV2MechanicalReview({
      accessToken: tokenResult.accessToken,
      adjustmentReason: form.adjustmentReason,
      adminReviewNote: form.adminReviewNote,
      counterChampionId: canonicalCounterChampionId,
      enemyChampionId: canonicalEnemyChampionId,
      manualAdjustment,
      publicEligible: form.publicEligible,
      reviewStatus: form.reviewStatus,
      role: selectedRole,
    });

    setSavingCounterRankingV2ReviewKey(null);

    if (!result.ok) {
      setCounterRankingV2ReviewStatus({ error: result.error, isLoading: false, success: null });
      return;
    }

    setCounterRankingV2ReviewsByCandidateId((currentReviews) => {
      const nextReviews = new Map(currentReviews);

      nextReviews.set(normalizeCounterRankingV2ChampionId(result.review.counterChampionId), result.review);
      return nextReviews;
    });
    setCounterRankingV2ReviewStatus({
      error: null,
      isLoading: false,
      success: "Mechanical review saved.",
    });
  }

  async function batchSaveCounterRankingV2Reviews({
    action,
    publicEligible,
    rows,
  }: {
    action: BatchCounterRankingV2MechanicalReviewAction;
    publicEligible: boolean;
    rows: CounterRankingV2ComparisonRow[];
  }) {
    if (rows.length === 0) {
      setCounterRankingV2ReviewStatus({
        error: "Select at least one auto-approval candidate first.",
        isLoading: false,
        success: null,
      });
      return;
    }

    const tokenResult = await getAccessToken();

    if (!tokenResult.ok) {
      setCounterRankingV2ReviewStatus({
        error: tokenResult.error,
        isLoading: false,
        success: null,
      });
      return;
    }

    setSavingCounterRankingV2ReviewKey("batch");
    setCounterRankingV2ReviewStatus({ error: null, isLoading: true, success: null });

    const canonicalEnemyChampionId =
      counterRankingV2ChampionsById.get(
        normalizeCounterRankingV2ChampionId(rows[0]?.mechanicalResult.enemyChampionId ?? ""),
      )?.id ??
      rows[0]?.mechanicalResult.enemyChampionId ??
      effectiveSelectedChampionId;
    const canonicalCounterChampionIds = rows.map(
      (row) =>
        counterRankingV2ChampionsById.get(normalizeCounterRankingV2ChampionId(row.candidateChampionId))
          ?.id ?? row.candidateChampionId,
    );

    const result = await batchSaveCounterRankingV2MechanicalReviews({
      accessToken: tokenResult.accessToken,
      action,
      counterChampionIds: canonicalCounterChampionIds,
      enemyChampionId: canonicalEnemyChampionId,
      publicEligible,
      role: selectedRole,
    });

    setSavingCounterRankingV2ReviewKey(null);

    if (!result.ok) {
      setCounterRankingV2ReviewStatus({ error: result.error, isLoading: false, success: null });
      return;
    }

    setCounterRankingV2ReviewsByCandidateId((currentReviews) => {
      const nextReviews = new Map(currentReviews);

      for (const review of result.reviews) {
        nextReviews.set(normalizeCounterRankingV2ChampionId(review.counterChampionId), review);
      }

      return nextReviews;
    });
    setCounterRankingV2ReviewStatus({
      error: null,
      isLoading: false,
      success: `${result.reviews.length} mechanical reviews updated by batch action.`,
    });
  }

  function startEditingCounterPick(counterPick: LeagueCounterPick) {
    setEditingCounterPickId(counterPick.id);
    setEditStatus({ error: null, isLoading: false, success: null });
    setEditForm({
      counter_strength: counterPick.counter_strength ?? "",
      counter_type: counterPick.counter_type,
      reason: counterPick.reason ?? "",
    });
  }

  function stopEditingCounterPick() {
    setEditingCounterPickId(null);
    setEditStatus({ error: null, isLoading: false, success: null });
  }

  function toggleSelectedId(counterPickId: number) {
    setSelectedIds((currentIds) => {
      const nextIds = new Set(currentIds);

      if (nextIds.has(counterPickId)) {
        nextIds.delete(counterPickId);
      } else {
        nextIds.add(counterPickId);
      }

      return nextIds;
    });
  }

  function toggleAllVisible() {
    setSelectedIds((currentIds) => {
      const hasAllVisibleSelected =
        allVisibleIds.length > 0 && allVisibleIds.every((id) => currentIds.has(id));
      const nextIds = new Set(currentIds);

      for (const id of allVisibleIds) {
        if (hasAllVisibleSelected) {
          nextIds.delete(id);
        } else {
          nextIds.add(id);
        }
      }

      return nextIds;
    });
  }

  async function refreshAfterMutation(success: string, setStatus: (status: FormStatus) => void) {
    const didRefresh = await onRefresh();
    await loadManagementMetrics();

    setStatus({
      error: didRefresh ? null : "Saved, but the refreshed admin data could not be loaded.",
      isLoading: false,
      success: didRefresh ? success : null,
    });
  }

  async function handleCreateCounterPick(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      setCreateStatus({ error: "Supabase is not configured.", isLoading: false, success: null });
      return;
    }

    if (!effectiveSelectedChampionId || !effectiveCreateCounterChampionId) {
      setCreateStatus({
        error: "Select a champion, role, and counter champion.",
        isLoading: false,
        success: null,
      });
      return;
    }

    if (effectiveSelectedChampionId === effectiveCreateCounterChampionId) {
      setCreateStatus({
        error: "A champion cannot counter itself.",
        isLoading: false,
        success: null,
      });
      return;
    }

    setCreateStatus({ error: null, isLoading: true, success: null });

    const { error } = await supabase.from("league_counter_picks").upsert(
      {
        champion_id: effectiveSelectedChampionId,
        counter_champion_id: effectiveCreateCounterChampionId,
        counter_strength: nullableTrim(createForm.counter_strength),
        counter_type: createForm.counter_type,
        generation_status: "draft",
        reason: nullableTrim(createForm.reason),
        role: selectedRole,
      },
      {
        onConflict: "champion_id,counter_champion_id,role,counter_type",
      },
    );

    if (error) {
      setCreateStatus({ error: error.message, isLoading: false, success: null });
      return;
    }

    setCreateForm({
      ...emptyCreateForm,
      counter_champion_id: createCounterChampionOptions[0]?.id ?? "",
    });
    await refreshAfterMutation("Counter pick draft saved.", setCreateStatus);
  }

  async function handleSaveCounterPick(counterPick: LeagueCounterPick) {
    if (!supabase) {
      setEditStatus({ error: "Supabase is not configured.", isLoading: false, success: null });
      return;
    }

    setEditStatus({ error: null, isLoading: true, success: null });

    const { error } = await supabase
      .from("league_counter_picks")
      .update({
        counter_strength: nullableTrim(editForm.counter_strength),
        counter_type: editForm.counter_type,
        reason: nullableTrim(editForm.reason),
      })
      .eq("id", counterPick.id);

    if (error) {
      setEditStatus({ error: error.message, isLoading: false, success: null });
      return;
    }

    setEditingCounterPickId(null);
    await refreshAfterMutation("Counter pick updated.", setEditStatus);
  }

  async function updateCounterPickStatus(
    counterPick: LeagueCounterPick,
    generationStatus: LeagueCounterPick["generation_status"],
  ) {
    if (!supabase) {
      setBulkStatus({ error: "Supabase is not configured.", isLoading: false, success: null });
      return;
    }

    setBulkStatus({ error: null, isLoading: true, success: null });

    const { error } = await supabase
      .from("league_counter_picks")
      .update({ generation_status: generationStatus })
      .eq("id", counterPick.id);

    if (error) {
      setBulkStatus({ error: error.message, isLoading: false, success: null });
      return;
    }

    await refreshAfterMutation(
      generationStatus === "reviewed"
        ? "Counter pick reviewed."
        : "Counter pick reverted to draft.",
      setBulkStatus,
    );
  }

  async function approveCounterPickIds(counterPickIds: number[], label: string) {
    if (!supabase || counterPickIds.length === 0) {
      return;
    }

    setBulkStatus({ error: null, isLoading: true, success: null });

    const { error } = await supabase
      .from("league_counter_picks")
      .update({ generation_status: "reviewed" })
      .in("id", counterPickIds);

    if (error) {
      setBulkStatus({ error: error.message, isLoading: false, success: null });
      return;
    }

    await refreshAfterMutation(label, setBulkStatus);
  }

  async function deleteCounterPickIds(counterPickIds: number[], label: string) {
    if (!supabase || counterPickIds.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      `Delete ${counterPickIds.length} counter pick${counterPickIds.length === 1 ? "" : "s"}?`,
    );

    if (!confirmed) {
      return;
    }

    setBulkStatus({ error: null, isLoading: true, success: null });

    const { error } = await supabase.from("league_counter_picks").delete().in("id", counterPickIds);

    if (error) {
      setBulkStatus({ error: error.message, isLoading: false, success: null });
      return;
    }

    setSelectedIds(new Set());
    setEditingCounterPickId(null);
    await refreshAfterMutation(label, setBulkStatus);
  }

  if (view === "overview") {
    return (
      <div className="space-y-6">
        <CounterPickManagementMetricsPanel
          error={metricsStatus.error}
          isLoading={metricsStatus.isLoading}
          metrics={managementMetrics}
          onRefresh={() => void loadManagementMetrics()}
        />
        <CounterPickOverviewOperationsPanel
          guideCount={counterPicks.length}
          isLoading={metricsStatus.isLoading}
          metrics={managementMetrics}
        />
        <CounterPickAdminLinks />
      </div>
    );
  }

  if (view === "collect") {
    return (
      <div className="space-y-6">
        <CounterPickManagementMetricsPanel
          error={metricsStatus.error}
          isLoading={metricsStatus.isLoading}
          metrics={managementMetrics}
          onRefresh={() => void loadManagementMetrics()}
        />
        <RiotMatchScannerPanel champions={champions} onScanTerminal={loadManagementMetrics} />
      </div>
    );
  }

  if (view === "shadow-ranking") {
    return (
      <div className="space-y-6">
        <Card className="border-white/10 bg-[#10182b]/90 text-white shadow-xl shadow-black/15">
          <CardHeader>
            <div>
              <CardTitle className="font-mono text-xl">Counter review target</CardTitle>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
                Find counters against the selected champion and role by comparing observed public
                rank against Counter Ranking V2 mechanical fit.
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
              <label className="block space-y-2">
                <span className="text-sm text-zinc-300">Search champions</span>
                <div className="relative">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500"
                    aria-hidden="true"
                  />
                  <Input
                    className="h-10 border-white/10 bg-white/5 pl-9 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-violet-400/70 focus-visible:ring-violet-400/20"
                    onChange={(event) => setChampionSearch(event.target.value)}
                    placeholder="Vex, Yone, Yasuo..."
                    type="search"
                    value={championSearch}
                  />
                </div>
              </label>

              <label className="block space-y-2">
                <span className="text-sm text-zinc-300">Find counters against</span>
                <select
                  className={`${fieldClassName} h-10`}
                  onChange={(event) => {
                    const nextChampion = championsById.get(event.target.value);

                    setSelectedChampionId(event.target.value);
                    setChampionSearch(nextChampion?.name ?? "");
                  }}
                  value={effectiveSelectedChampionId}
                >
                  {championSelectOptions.map((champion) => (
                    <option className={selectOptionClassName} key={champion.id} value={champion.id}>
                      {champion.name} ({formatCounterRankingV2ProfileAvailability(champion.id)})
                    </option>
                  ))}
                </select>
              </label>

              <label className="block space-y-2">
                <span className="text-sm text-zinc-300">Role</span>
                <select
                  className={`${fieldClassName} h-10`}
                  onChange={(event) => setSelectedRole(event.target.value as LeagueRole)}
                  value={selectedRole}
                >
                  {leagueRoles.map((role) => (
                    <option className={selectOptionClassName} key={role} value={role}>
                      {getRoleLabel(role)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <p className="text-sm leading-6 text-zinc-400">
              Every candidate below is evaluated as a champion picked into the selected target.
            </p>
          </CardContent>
        </Card>

        <CounterRankingV2ShadowPanel
          championsById={counterRankingV2ChampionsById}
          enemyChampionId={effectiveSelectedChampionId}
          isLoading={counterRankingV2Status.isLoading}
          onBatchSaveReview={batchSaveCounterRankingV2Reviews}
          onSaveReview={saveCounterRankingV2Review}
          reviewStatus={counterRankingV2ReviewStatus}
          rows={counterRankingV2Rows}
          savingReviewKey={savingCounterRankingV2ReviewKey}
          selectedRole={selectedRole}
          statusError={counterRankingV2Status.error}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CounterPickManagementMetricsPanel
        error={metricsStatus.error}
        isLoading={metricsStatus.isLoading}
        metrics={managementMetrics}
        onRefresh={() => void loadManagementMetrics()}
      />

      <Card className="border-white/10 bg-[#10182b]/90 text-white shadow-xl shadow-black/15">
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <CardTitle className="font-mono text-xl">Counter Pick workspace</CardTitle>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
                Manage draft and reviewed recommendations for a selected champion and role.
              </p>
            </div>
            <Button
              className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
              onClick={() => void onRefresh()}
              type="button"
              variant="ghost"
            >
              <RefreshCw className="size-4" aria-hidden="true" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
            <label className="block space-y-2">
              <span className="text-sm text-zinc-300">Search champions</span>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500"
                  aria-hidden="true"
                />
                <Input
                  className="h-10 border-white/10 bg-white/5 pl-9 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-violet-400/70 focus-visible:ring-violet-400/20"
                  onChange={(event) => setChampionSearch(event.target.value)}
                  placeholder="Fizz, Ahri, Aatrox..."
                  type="search"
                  value={championSearch}
                />
              </div>
            </label>

            <label className="block space-y-2">
              <span className="text-sm text-zinc-300">Champion</span>
              <select
                className={`${fieldClassName} h-10`}
                onChange={(event) => {
                  setSelectedChampionId(event.target.value);
                  setChampionSearch(championsById.get(event.target.value)?.name ?? "");
                  setSelectedIds(new Set());
                  setEditingCounterPickId(null);
                }}
                value={effectiveSelectedChampionId}
              >
                {championSelectOptions.map((champion) => (
                  <option className={selectOptionClassName} key={champion.id} value={champion.id}>
                    {champion.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm text-zinc-300">Role</span>
              <select
                className={`${fieldClassName} h-10`}
                onChange={(event) => {
                  setSelectedRole(event.target.value as LeagueRole);
                  setSelectedIds(new Set());
                  setEditingCounterPickId(null);
                }}
                value={selectedRole}
              >
                {leagueRoles.map((role) => (
                  <option className={selectOptionClassName} key={role} value={role}>
                    {getRoleLabel(role)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {selectedChampion ? (
            <div className="flex flex-wrap items-center gap-3 rounded-lg border border-violet-300/15 bg-violet-500/[0.06] p-3">
              <Image
                alt=""
                className="size-10 rounded-md bg-white/10 object-cover"
                height={40}
                src={getChampionIconPath(selectedChampion)}
                width={40}
              />
              <div>
                <p className="text-sm font-semibold text-white">{selectedChampion.name}</p>
                <p className="text-xs text-zinc-400">{getRoleLabel(selectedRole)} counter board</p>
              </div>
            </div>
          ) : (
            <EmptyState tone="warning" text="No champion is available for this role filter." />
          )}
        </CardContent>
      </Card>

      {selectedChampionCombatProfile ? (
        <CombatProfileCounterRelationships
          championName={selectedChampionCombatProfile.name}
          counteredBy={selectedChampionCombatProfile.counteredBy}
          counters={selectedChampionCombatProfile.counters}
        />
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card className="border-white/10 bg-[#10182b]/90 text-white shadow-xl shadow-black/15">
          <CardHeader>
            <CardTitle className="font-mono text-xl">Create draft</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleCreateCounterPick}>
              <label className="block space-y-2">
                <span className="text-sm text-zinc-300">Counter champion</span>
                <select
                  className={`${fieldClassName} h-10`}
                  disabled={createStatus.isLoading}
                  onChange={(event) =>
                    setCreateForm((currentForm) => ({
                      ...currentForm,
                      counter_champion_id: event.target.value,
                    }))
                  }
                  required
                  value={effectiveCreateCounterChampionId}
                >
                  {createCounterChampionOptions.map((champion) => (
                    <option className={selectOptionClassName} key={champion.id} value={champion.id}>
                      {champion.name}
                    </option>
                  ))}
                </select>
              </label>

              <CounterPickEditableFields
                disabled={createStatus.isLoading}
                form={createForm}
                onChange={setCreateForm}
              />

              <StatusMessage status={createStatus} />

              <Button
                className="h-10 bg-violet-500/80 px-4 text-white hover:bg-violet-500"
                disabled={createStatus.isLoading || !effectiveSelectedChampionId}
                type="submit"
              >
                <Plus className="size-4" aria-hidden="true" />
                {createStatus.isLoading ? "Saving..." : "Create draft"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-[#10182b]/90 text-white shadow-xl shadow-black/15">
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <CardTitle className="font-mono text-xl">Counter picks</CardTitle>
                <p className="mt-2 text-sm text-zinc-400">
                  {visibleCounterPicks.length} visible, {reviewedVisibleCount} reviewed.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
                  disabled={allVisibleIds.length === 0 || bulkStatus.isLoading}
                  onClick={toggleAllVisible}
                  type="button"
                  variant="ghost"
                >
                  {allVisibleIds.length > 0 && allVisibleIds.every((id) => selectedIds.has(id)) ? (
                    <CheckSquare className="size-4" aria-hidden="true" />
                  ) : (
                    <Square className="size-4" aria-hidden="true" />
                  )}
                  Select visible
                </Button>
                <Button
                  className="border-emerald-300/20 bg-emerald-500/10 text-emerald-100 hover:bg-emerald-500/20"
                  disabled={draftSelectedIds.length === 0 || bulkStatus.isLoading}
                  onClick={() =>
                    void approveCounterPickIds(draftSelectedIds, "Selected counter picks reviewed.")
                  }
                  type="button"
                  variant="ghost"
                >
                  <CheckCircle2 className="size-4" aria-hidden="true" />
                  Approve selected
                </Button>
                <Button
                  className="border-emerald-300/20 bg-emerald-500/10 text-emerald-100 hover:bg-emerald-500/20"
                  disabled={draftVisibleIds.length === 0 || bulkStatus.isLoading}
                  onClick={() =>
                    void approveCounterPickIds(draftVisibleIds, "Visible counter picks reviewed.")
                  }
                  type="button"
                  variant="ghost"
                >
                  <CheckSquare className="size-4" aria-hidden="true" />
                  Approve all visible
                </Button>
                <Button
                  className="border-rose-300/20 bg-rose-500/10 text-rose-100 hover:bg-rose-500/20"
                  disabled={selectedVisibleIds.length === 0 || bulkStatus.isLoading}
                  onClick={() =>
                    void deleteCounterPickIds(selectedVisibleIds, "Selected counter picks deleted.")
                  }
                  type="button"
                  variant="ghost"
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                  Delete selected
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 md:grid-cols-3">
              <label className="block space-y-2 md:col-span-3">
                <span className="text-sm text-zinc-300">Search counter champions</span>
                <Input
                  className="h-10 border-white/10 bg-white/5 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-violet-400/70 focus-visible:ring-violet-400/20"
                  onChange={(event) => {
                    setCounterSearch(event.target.value);
                    setSelectedIds(new Set());
                  }}
                  placeholder="Filter visible counters..."
                  type="search"
                  value={counterSearch}
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm text-zinc-300">Status</span>
                <select
                  className={`${fieldClassName} h-10`}
                  onChange={(event) => {
                    setStatusFilter(event.target.value as CounterPickStatusFilter);
                    setSelectedIds(new Set());
                  }}
                  value={statusFilter}
                >
                  <option className={selectOptionClassName} value="all">
                    All
                  </option>
                  <option className={selectOptionClassName} value="draft">
                    Draft
                  </option>
                  <option className={selectOptionClassName} value="reviewed">
                    Reviewed
                  </option>
                </select>
              </label>

              <label className="block space-y-2">
                <span className="text-sm text-zinc-300">Counter type</span>
                <select
                  className={`${fieldClassName} h-10`}
                  onChange={(event) => {
                    setTypeFilter(event.target.value as CounterPickTypeFilter);
                    setSelectedIds(new Set());
                  }}
                  value={typeFilter}
                >
                  <option className={selectOptionClassName} value="all">
                    All
                  </option>
                  <option className={selectOptionClassName} value="best_counter">
                    Best Counter
                  </option>
                  <option className={selectOptionClassName} value="countered_by">
                    Countered By
                  </option>
                </select>
              </label>

              <div className="flex items-end">
                <Button
                  className="h-10 w-full border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
                  onClick={() => {
                    setCounterSearch("");
                    setStatusFilter("all");
                    setTypeFilter("all");
                    setSelectedIds(new Set());
                  }}
                  type="button"
                  variant="ghost"
                >
                  <X className="size-4" aria-hidden="true" />
                  Clear filters
                </Button>
              </div>
            </div>

            <StatusMessage status={bulkStatus} />

            {counterPicks.length === 0 ? (
              <EmptyState text="No counter picks exist yet. Create the first draft for a champion and role." />
            ) : visibleCounterPicks.length === 0 ? (
              <EmptyState text="No counter picks match the current filters." />
            ) : (
              <div className="space-y-3">
                {visibleCounterPicks.map((counterPick) => (
                  <CounterPickRow
                    championsById={championsById}
                    counterPick={counterPick}
                    editForm={editForm}
                    editStatus={editStatus}
                    isEditing={editingCounterPickId === counterPick.id}
                    isSelected={selectedIds.has(counterPick.id)}
                    key={counterPick.id}
                    onCancelEdit={stopEditingCounterPick}
                    onDelete={(id) => void deleteCounterPickIds([id], "Counter pick deleted.")}
                    onEditChange={setEditForm}
                    onSave={handleSaveCounterPick}
                    onStartEdit={startEditingCounterPick}
                    onToggleReviewed={updateCounterPickStatus}
                    onToggleSelected={toggleSelectedId}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function CounterPickEditableFields<TForm extends CounterPickEditForm>({
  disabled,
  form,
  onChange,
}: {
  disabled: boolean;
  form: TForm;
  onChange: (form: TForm) => void;
}) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm text-zinc-300">Counter type</span>
          <select
            className={`${fieldClassName} h-10`}
            disabled={disabled}
            onChange={(event) =>
              onChange({
                ...form,
                counter_type: event.target.value as LeagueCounterPickType,
              })
            }
            value={form.counter_type}
          >
            <option className={selectOptionClassName} value="best_counter">
              Best Counter
            </option>
            <option className={selectOptionClassName} value="countered_by">
              Countered By
            </option>
          </select>
        </label>

        <label className="block space-y-2">
          <span className="text-sm text-zinc-300">Counter strength</span>
          <Input
            className="h-10 border-white/10 bg-white/5 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-violet-400/70 focus-visible:ring-violet-400/20"
            disabled={disabled}
            onChange={(event) =>
              onChange({
                ...form,
                counter_strength: event.target.value,
              })
            }
            placeholder="Strong, situational, skill matchup..."
            value={form.counter_strength}
          />
        </label>
      </div>

      <label className="block space-y-2">
        <span className="text-sm text-zinc-300">Reason</span>
        <textarea
          className={`${fieldClassName} min-h-28 py-2 leading-6`}
          disabled={disabled}
          onChange={(event) =>
            onChange({
              ...form,
              reason: event.target.value,
            })
          }
          placeholder="Why this counter pick matters in lane..."
          value={form.reason}
        />
      </label>
    </>
  );
}

function CombatProfileCounterRelationships({
  championName,
  counteredBy,
  counters,
}: {
  championName: string;
  counteredBy?: readonly { champion: string; reasons: readonly string[] }[];
  counters?: readonly { champion: string; reasons: readonly string[] }[];
}) {
  return (
    <Card className="border-white/10 bg-[#10182b]/90 text-white shadow-xl shadow-black/15">
      <CardHeader>
        <CardTitle className="font-mono text-xl">Combat profile counter notes</CardTitle>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Static combat-profile relationships for {championName}. Add bullets in the champion
          profile files and they will appear here for Counter Pick review.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 lg:grid-cols-2">
          <CombatProfileRelationshipList
            emptyText="No champions are listed as matchups this champion counters yet."
            relationships={counters}
            title={`${championName} counters`}
          />
          <CombatProfileRelationshipList
            emptyText="No champions are listed as counters into this champion yet."
            relationships={counteredBy}
            title={`${championName} is countered by`}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function CombatProfileRelationshipList({
  emptyText,
  relationships,
  title,
}: {
  emptyText: string;
  relationships?: readonly { champion: string; reasons: readonly string[] }[];
  title: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      {relationships && relationships.length > 0 ? (
        <ul className="mt-4 space-y-4">
          {relationships.map((relationship) => (
            <li
              className="rounded-md border border-white/10 bg-black/15 p-3"
              key={relationship.champion}
            >
              <p className="text-sm font-semibold text-violet-100">{relationship.champion}</p>
              {relationship.reasons.length > 0 ? (
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-zinc-300">
                  {relationship.reasons.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-zinc-500">No reasons added yet.</p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 rounded-md border border-white/10 bg-black/15 p-3 text-sm text-zinc-500">
          {emptyText}
        </p>
      )}
    </div>
  );
}

function CounterRankingV2ShadowPanel({
  championsById,
  enemyChampionId,
  isLoading,
  onBatchSaveReview,
  onSaveReview,
  reviewStatus,
  rows,
  savingReviewKey,
  selectedRole,
  statusError,
}: {
  championsById: Map<string, AdminLeagueChampion>;
  enemyChampionId: string;
  isLoading: boolean;
  onBatchSaveReview: (input: {
    action: BatchCounterRankingV2MechanicalReviewAction;
    publicEligible: boolean;
    rows: CounterRankingV2ComparisonRow[];
  }) => Promise<void>;
  onSaveReview: (row: CounterRankingV2ComparisonRow, form: CounterRankingV2ReviewForm) => void;
  reviewStatus: FormStatus;
  rows: CounterRankingV2ComparisonRow[];
  savingReviewKey: string | null;
  selectedRole: LeagueRole;
  statusError: string | null;
}) {
  const [reviewFilter, setReviewFilter] = useState<CounterRankingV2ReviewFilter>("all");
  const [batchPublicEligible, setBatchPublicEligible] = useState(false);
  const [selectedAutoApprovalCandidateIds, setSelectedAutoApprovalCandidateIds] = useState<
    Set<string>
  >(() => new Set());
  const enemyChampion = championsById.get(normalizeCounterRankingV2ChampionId(enemyChampionId));
  const enemyProfile = enemyChampionId ? getCounterRankingV2ChampionProfile(enemyChampionId) : null;
  const hasSupportedEnemy = enemyChampionId
    ? isCounterRankingV2SupportedChampion(enemyChampionId)
    : false;
  const reviewTargetLabel = enemyChampion
    ? `${enemyChampion.name} ${getRoleLabel(selectedRole)}`
    : `selected target ${getRoleLabel(selectedRole)}`;
  const reviewTargetValue = enemyChampion ? reviewTargetLabel : "None";
  const hasObservedStats = rows.some((row) => row.observed !== null);
  const hasReviewRows = rows.some((row) => row.review !== null);
  const reviewProgressSummary = useMemo(
    () => getCounterRankingV2ReviewProgressSummary(rows),
    [rows],
  );
  const automationSummary = useMemo(
    () => getCounterRankingV2AutomationSummary(rows),
    [rows],
  );
  const publicPreviewRows = useMemo(
    () =>
      getCounterRankingV2PublicPreviewRows({
        minimumGames: publicCounterPickMinimumRankedGames,
        rows,
      }),
    [rows],
  );
  const filteredRows = useMemo(
    () =>
      filterCounterRankingV2RowsByReviewFilter({
        filter: reviewFilter,
        minimumGames: publicCounterPickMinimumRankedGames,
        rows,
      }),
    [reviewFilter, rows],
  );
  const activeFilterLabel =
    counterRankingV2ShadowReviewFilterOptions.find((option) => option.filter === reviewFilter)
      ?.label ?? "All";
  const autoApprovalCandidateRows = useMemo(
    () =>
      rows.filter(
        (row) => row.automationSuggestion?.automationStatus === "auto_approval_candidate",
      ),
    [rows],
  );
  const selectedAutoApprovalRows = useMemo(
    () =>
      autoApprovalCandidateRows.filter((row) =>
        selectedAutoApprovalCandidateIds.has(row.candidateChampionId),
      ),
    [autoApprovalCandidateRows, selectedAutoApprovalCandidateIds],
  );
  const isBatchSaving = savingReviewKey === "batch";

  async function handleBatchReviewAction(action: BatchCounterRankingV2MechanicalReviewAction) {
    await onBatchSaveReview({
      action,
      publicEligible: batchPublicEligible,
      rows: selectedAutoApprovalRows,
    });
    setSelectedAutoApprovalCandidateIds(new Set());
    setBatchPublicEligible(false);
  }

  return (
    <Card className="border-cyan-300/15 bg-[#071321]/95 text-white shadow-xl shadow-black/15">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <CardTitle className="font-mono text-xl">
              Mechanical counters against {reviewTargetLabel}
            </CardTitle>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
              Internal-only comparison between current observed win-rate rank and deterministic
              mechanical matchup fit. Every candidate below is evaluated into {reviewTargetLabel}.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge className="border-cyan-300/20 bg-cyan-500/10 text-cyan-100">Shadow mode</Badge>
            <Badge className="border-white/10 bg-white/5 text-zinc-300">
              Sorted by review priority
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-5">
          <CounterRankingV2MetaCell
            label="Review target"
            value={reviewTargetValue}
          />
          <CounterRankingV2MetaCell
            label="Target profile"
            value={
              enemyProfile
                ? `${formatProfileStatus(enemyProfile.reviewStatus)} v${enemyProfile.version}`
                : "Missing"
            }
          />
          <CounterRankingV2MetaCell
            label="Observed data"
            value={
              !hasSupportedEnemy
                ? "Not loaded"
                : isLoading
                  ? "Loading"
                  : statusError
                    ? "Unavailable"
                    : hasObservedStats
                      ? "Loaded from current stats"
                      : "No observed stats"
            }
          />
          <CounterRankingV2MetaCell
            label="Review layer"
            value={
              !hasSupportedEnemy
                ? "Not loaded"
                : reviewStatus.isLoading
                ? "Loading"
                : reviewStatus.error
                  ? "Unavailable"
                  : hasReviewRows
                    ? "Loaded from review table"
                    : "No review rows yet"
            }
          />
          <CounterRankingV2MetaCell
            label="Public reviewed counters"
            value={useReviewedMechanicalCountersPublicly ? "Feature flag enabled" : "Disabled"}
          />
        </div>

        {statusError ? (
          <p className="rounded-md border border-amber-300/20 bg-amber-500/10 p-3 text-sm text-amber-100">
            {statusError}
          </p>
        ) : null}
        {reviewStatus.error ? (
          <p className="rounded-md border border-amber-300/20 bg-amber-500/10 p-3 text-sm text-amber-100">
            {reviewStatus.error}
          </p>
        ) : null}
        {reviewStatus.success ? (
          <p className="rounded-md border border-emerald-300/20 bg-emerald-500/10 p-3 text-sm text-emerald-100">
            {reviewStatus.success}
          </p>
        ) : null}

        {!hasSupportedEnemy ? (
          <EmptyState
            tone="warning"
            text="This champion does not have a Counter Ranking V2 profile yet."
          />
        ) : rows.length === 0 ? (
          <EmptyState text="No Counter Ranking V2 mechanical candidates into this target are available for this selection." />
        ) : (
          <>
            {!isLoading && !statusError && !hasObservedStats ? (
              <EmptyState text="No observed stats are available for this target and role yet." />
            ) : null}
            {!reviewStatus.isLoading && !reviewStatus.error && !hasReviewRows ? (
              <EmptyState text="No review rows have been saved for this target and role yet." />
            ) : null}
            <CounterRankingV2ReviewProgressSummaryPanel summary={reviewProgressSummary} />
            <CounterRankingV2AutomationSummaryPanel summary={automationSummary} />
            <CounterRankingV2BatchReviewPanel
              autoApprovalCandidateCount={autoApprovalCandidateRows.length}
              isBatchSaving={isBatchSaving}
              onAction={(action) => void handleBatchReviewAction(action)}
              onPublicEligibleChange={setBatchPublicEligible}
              onSelectAll={() =>
                setSelectedAutoApprovalCandidateIds(
                  new Set(autoApprovalCandidateRows.map((row) => row.candidateChampionId)),
                )
              }
              onSelectionChange={setSelectedAutoApprovalCandidateIds}
              publicEligible={batchPublicEligible}
              selectedCount={selectedAutoApprovalRows.length}
              selectedIds={selectedAutoApprovalCandidateIds}
            />
            <CounterRankingV2PublicPreviewPanel
              championsById={championsById}
              previewRows={publicPreviewRows}
              targetLabel={reviewTargetLabel}
            />
            <p className="text-sm font-semibold text-zinc-100">
              Mechanical candidates into {reviewTargetLabel}
            </p>
            <div className="rounded-lg border border-white/10 bg-black/15 p-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-semibold text-zinc-100">Review filters</p>
                <p className="text-xs text-zinc-500">
                  {activeFilterLabel}: {filteredRows.length} of {rows.length} counter candidates
                </p>
              </div>
              <div
                aria-label="Counter Ranking V2 review filters"
                className="mt-3 flex flex-wrap gap-2"
                role="group"
              >
                {counterRankingV2ShadowReviewFilterOptions.map((option) => {
                  const isActiveFilter = option.filter === reviewFilter;

                  return (
                    <button
                      aria-pressed={isActiveFilter}
                      className={cn(
                        "rounded-md border px-3 py-2 text-xs font-semibold transition-colors",
                        isActiveFilter
                          ? "border-cyan-300/30 bg-cyan-500/15 text-cyan-100"
                          : "border-white/10 bg-white/5 text-zinc-300 hover:border-cyan-300/20 hover:bg-white/10",
                      )}
                      key={option.filter}
                      onClick={() => setReviewFilter(option.filter)}
                      type="button"
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {filteredRows.length === 0 ? (
              <EmptyState text="No mechanical candidates match this filter." />
            ) : (
              <CounterRankingV2ShadowRows
                championsById={championsById}
                isLoadingObserved={isLoading}
                key={`${enemyChampionId}-${selectedRole}-${reviewFilter}`}
                onAutoApprovalSelectionToggle={(candidateId) =>
                  setSelectedAutoApprovalCandidateIds((currentIds) => {
                    const nextIds = new Set(currentIds);

                    if (nextIds.has(candidateId)) {
                      nextIds.delete(candidateId);
                    } else {
                      nextIds.add(candidateId);
                    }

                    return nextIds;
                  })
                }
                onSaveReview={onSaveReview}
                rows={filteredRows}
                savingReviewKey={savingReviewKey}
                selectedAutoApprovalCandidateIds={selectedAutoApprovalCandidateIds}
                targetLabel={reviewTargetLabel}
              />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

function CounterRankingV2ShadowRows({
  championsById,
  isLoadingObserved,
  onAutoApprovalSelectionToggle,
  onSaveReview,
  rows,
  savingReviewKey,
  selectedAutoApprovalCandidateIds,
  targetLabel,
}: {
  championsById: Map<string, AdminLeagueChampion>;
  isLoadingObserved: boolean;
  onAutoApprovalSelectionToggle: (candidateId: string) => void;
  onSaveReview: (row: CounterRankingV2ComparisonRow, form: CounterRankingV2ReviewForm) => void;
  rows: CounterRankingV2ComparisonRow[];
  savingReviewKey: string | null;
  selectedAutoApprovalCandidateIds: Set<string>;
  targetLabel: string;
}) {
  const [expandedCandidateId, setExpandedCandidateId] = useState<string | null>(
    () => rows[0]?.candidateChampionId ?? null,
  );

  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <CounterRankingV2ShadowRow
          candidate={championsById.get(row.candidateChampionId) ?? null}
          isExpanded={expandedCandidateId === row.candidateChampionId}
          isLoadingObserved={isLoadingObserved}
          isSelectedForAutoApproval={selectedAutoApprovalCandidateIds.has(row.candidateChampionId)}
          key={`${row.candidateChampionId}-${row.review?.updatedAt ?? "new"}`}
          onAutoApprovalSelectionToggle={() =>
            onAutoApprovalSelectionToggle(row.candidateChampionId)
          }
          onSaveReview={onSaveReview}
          onToggle={() =>
            setExpandedCandidateId((currentCandidateId) =>
              currentCandidateId === row.candidateChampionId ? null : row.candidateChampionId,
            )
          }
          row={row}
          savingReviewKey={savingReviewKey}
          targetLabel={targetLabel}
        />
      ))}
    </div>
  );
}

function CounterRankingV2MetaCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
      <p className="text-xs uppercase text-zinc-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-zinc-100">{value}</p>
    </div>
  );
}

function CounterRankingV2ReviewProgressSummaryPanel({
  summary,
}: {
  summary: CounterRankingV2ReviewProgressSummary;
}) {
  const progressItems = [
    { label: "Total counter candidates", value: summary.total },
    { label: "Reviewed counter candidates", value: summary.reviewed },
    { label: "Unreviewed counter candidates", value: summary.unreviewed },
    { label: "Verified strong counters", value: summary.verifiedStrongCounters },
    { label: "Verified soft counters", value: summary.verifiedSoftCounters },
    { label: "Needs more data", value: summary.needsMoreData },
    { label: "Incorrect suggestions", value: summary.incorrectSuggestions },
    { label: "Public eligible", value: summary.publicEligible },
  ] as const;

  return (
    <div className="rounded-lg border border-cyan-300/15 bg-cyan-500/[0.06] p-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-cyan-100">Review progress</p>
        <p className="text-xs text-zinc-500">Selected target and role</p>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {progressItems.map((item) => (
          <div className="rounded-md border border-white/10 bg-black/15 p-3" key={item.label}>
            <p className="text-xs uppercase text-zinc-500">{item.label}</p>
            <p className="mt-1 text-lg font-semibold text-zinc-100">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CounterRankingV2AutomationSummaryPanel({
  summary,
}: {
  summary: CounterRankingV2AutomationSummary;
}) {
  const automationItems = [
    { label: "Generated suggestions", value: summary.generatedSuggestions },
    { label: "Auto approval candidates", value: summary.autoApprovalCandidates },
    { label: "Auto suggested", value: summary.autoSuggested },
    { label: "Needs review", value: summary.needsReview },
    { label: "Manually approved", value: summary.manualApproved },
    { label: "Manually rejected", value: summary.manualRejected },
  ] as const;

  return (
    <div className="rounded-lg border border-sky-300/15 bg-sky-500/[0.05] p-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-sky-100">Automation suggestions</p>
        <p className="text-xs text-zinc-500">Generated from mechanical profiles only</p>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        {automationItems.map((item) => (
          <div className="rounded-md border border-white/10 bg-black/15 p-3" key={item.label}>
            <p className="text-xs uppercase text-zinc-500">{item.label}</p>
            <p className="mt-1 text-lg font-semibold text-zinc-100">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CounterRankingV2BatchReviewPanel({
  autoApprovalCandidateCount,
  isBatchSaving,
  onAction,
  onPublicEligibleChange,
  onSelectAll,
  onSelectionChange,
  publicEligible,
  selectedCount,
  selectedIds,
}: {
  autoApprovalCandidateCount: number;
  isBatchSaving: boolean;
  onAction: (action: BatchCounterRankingV2MechanicalReviewAction) => void;
  onPublicEligibleChange: (value: boolean) => void;
  onSelectAll: () => void;
  onSelectionChange: (ids: Set<string>) => void;
  publicEligible: boolean;
  selectedCount: number;
  selectedIds: Set<string>;
}) {
  const hasSelection = selectedCount > 0;

  return (
    <div className="rounded-lg border border-white/10 bg-black/15 p-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-zinc-100">Auto-approval batch review</p>
          <p className="mt-1 text-xs text-zinc-500">
            {selectedCount} selected of {autoApprovalCandidateCount} safe candidates
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
            disabled={autoApprovalCandidateCount === 0 || isBatchSaving}
            onClick={onSelectAll}
            type="button"
            variant="ghost"
          >
            <CheckSquare className="size-4" aria-hidden="true" />
            Select candidates
          </Button>
          <Button
            className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
            disabled={selectedIds.size === 0 || isBatchSaving}
            onClick={() => onSelectionChange(new Set())}
            type="button"
            variant="ghost"
          >
            <Square className="size-4" aria-hidden="true" />
            Clear
          </Button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-zinc-300">
          <input
            checked={publicEligible}
            className="size-4 accent-cyan-300"
            disabled={!hasSelection || isBatchSaving}
            onChange={(event) => onPublicEligibleChange(event.target.checked)}
            type="checkbox"
          />
          Public eligible on approve
        </label>
        <Button
          className="border-emerald-300/20 bg-emerald-500/10 text-emerald-100 hover:bg-emerald-500/20"
          disabled={!hasSelection || isBatchSaving}
          onClick={() => onAction("approve")}
          type="button"
          variant="ghost"
        >
          <CheckCircle2 className="size-4" aria-hidden="true" />
          Approve selected
        </Button>
        <Button
          className="border-amber-300/20 bg-amber-500/10 text-amber-100 hover:bg-amber-500/20"
          disabled={!hasSelection || isBatchSaving}
          onClick={() => onAction("needs_review")}
          type="button"
          variant="ghost"
        >
          <Pencil className="size-4" aria-hidden="true" />
          Needs review
        </Button>
        <Button
          className="border-rose-300/20 bg-rose-500/10 text-rose-100 hover:bg-rose-500/20"
          disabled={!hasSelection || isBatchSaving}
          onClick={() => onAction("reject")}
          type="button"
          variant="ghost"
        >
          <X className="size-4" aria-hidden="true" />
          Reject selected
        </Button>
      </div>
    </div>
  );
}

function CounterRankingV2PublicPreviewPanel({
  championsById,
  previewRows,
  targetLabel,
}: {
  championsById: Map<string, AdminLeagueChampion>;
  previewRows: CounterRankingV2PublicPreviewRow[];
  targetLabel: string;
}) {
  return (
    <div className="rounded-lg border border-emerald-300/15 bg-emerald-500/[0.05] p-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-emerald-100">
          Public preview: approved counters against {targetLabel}
        </p>
        <Badge className="border-emerald-300/20 bg-emerald-500/10 text-emerald-100">
          Preview only — public ordering unchanged
        </Badge>
      </div>

      {previewRows.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {previewRows.map((previewRow) => {
            const candidate = championsById.get(previewRow.candidateChampionId) ?? null;

            return (
              <li
                className="rounded-md border border-white/10 bg-black/15 p-3"
                key={previewRow.candidateChampionId}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    {candidate ? (
                      <Image
                        alt=""
                        className="size-10 rounded-md bg-white/10 object-cover"
                        height={40}
                        src={getChampionIconPath(candidate)}
                        width={40}
                      />
                    ) : (
                      <div className="size-10 rounded-md bg-white/10" />
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {candidate?.name ?? previewRow.candidateChampionId}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">
                        {formatCounterRankingV2ReviewStatus(previewRow.reviewStatus)}
                      </p>
                      <p className="mt-1 text-xs text-zinc-400">
                        {candidate?.name ?? previewRow.candidateChampionId} would appear as a
                        public counter against {targetLabel}.
                      </p>
                    </div>
                  </div>
                  {previewRow.isLowSampleDesignCounter ? (
                    <Badge className="border-amber-300/20 bg-amber-500/10 text-amber-100">
                      Low sample mechanical counter
                    </Badge>
                  ) : null}
                </div>

                <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  <CounterRankingV2Metric
                    label="Current public ranking"
                    value={
                      previewRow.currentPublicRank ? `#${previewRow.currentPublicRank}` : "Unranked"
                    }
                  />
                  <CounterRankingV2Metric
                    label="Final reviewed score"
                    value={String(previewRow.finalReviewedScore)}
                  />
                  <CounterRankingV2Metric
                    label="Observed games"
                    value={formatNullableNumber(previewRow.observedGames)}
                  />
                  <CounterRankingV2Metric label="Confidence" value={previewRow.confidenceLabel} />
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-3 rounded-md border border-white/10 bg-black/15 p-3 text-sm text-zinc-500">
          No approved mechanical counters against {targetLabel} are public-preview eligible yet.
        </p>
      )}
    </div>
  );
}

function CounterRankingV2ShadowRow({
  candidate,
  isExpanded,
  isLoadingObserved,
  isSelectedForAutoApproval,
  onAutoApprovalSelectionToggle,
  onSaveReview,
  onToggle,
  row,
  savingReviewKey,
  targetLabel,
}: {
  candidate: AdminLeagueChampion | null;
  isExpanded: boolean;
  isLoadingObserved: boolean;
  isSelectedForAutoApproval: boolean;
  onAutoApprovalSelectionToggle: () => void;
  onSaveReview: (row: CounterRankingV2ComparisonRow, form: CounterRankingV2ReviewForm) => void;
  onToggle: () => void;
  row: CounterRankingV2ComparisonRow;
  savingReviewKey: string | null;
  targetLabel: string;
}) {
  const result = row.mechanicalResult;
  const profile = getCounterRankingV2ChampionProfile(row.candidateChampionId);
  const automationSuggestion = row.automationSuggestion;
  const topReasons = getCounterRankingV2MechanicalReasons(result.factors);
  const hasWeakMechanicalSignal = hasCounterRankingV2WeakMechanicalSignal(result.factors);
  const [reviewForm, setReviewForm] = useState<CounterRankingV2ReviewForm>(() =>
    getCounterRankingV2ReviewForm(row.review),
  );
  const parsedAdjustment = Number(reviewForm.manualAdjustment);
  const previewAdjustment = clampCounterRankingV2ManualAdjustment(
    Number.isFinite(parsedAdjustment) ? parsedAdjustment : 0,
  );
  const finalScorePreview = calculateCounterRankingV2FinalMechanicalScore({
    calculatedMechanicalScore: result.score,
    manualAdjustment: previewAdjustment,
  });
  const isSavingReview = savingReviewKey === row.candidateChampionId;
  const hasCalculatedScore = result.status === "calculated";
  const observedGames = row.observed?.games ?? 0;
  const hasLowObservedSample =
    observedGames > 0 && observedGames < publicCounterPickMinimumRankedGames;
  const hasNoObservedData = !isLoadingObserved && observedGames === 0;
  const isReviewStatusPublicEligible = isCounterRankingV2ReviewStatusPublicEligible(
    reviewForm.reviewStatus,
  );
  const isPublicEligibleChecked = isReviewStatusPublicEligible && reviewForm.publicEligible;
  const isSavedPublicEligible = isCounterRankingV2ReviewPublicEligible(row.review);
  const isLowSampleDesignCounter = isSavedPublicEligible && hasLowObservedSample;
  const publicEligibilityHelperText =
    reviewForm.reviewStatus === "unreviewed"
      ? "Choose a reviewed status before enabling public eligibility."
      : reviewForm.reviewStatus === "incorrect_suggestion"
        ? "Incorrect suggestions cannot be public eligible."
        : isPublicEligibleChecked && hasLowObservedSample
          ? "This will be treated as a low-sample mechanical counter."
          : "Stored for shadow review. Public use requires the reviewed-counter feature flag.";
  const panelId = `counter-ranking-v2-review-${row.candidateChampionId}`;
  const isAutoApprovalCandidate =
    automationSuggestion?.automationStatus === "auto_approval_candidate";

  return (
    <div
      className={cn(
        "rounded-lg border bg-white/[0.03] transition-colors",
        isExpanded ? "border-cyan-300/25" : "border-white/10 hover:border-cyan-300/20",
      )}
    >
      {isAutoApprovalCandidate ? (
        <label className="flex items-center gap-3 border-b border-white/10 px-4 py-3 text-sm text-zinc-300">
          <input
            checked={isSelectedForAutoApproval}
            className="size-4 accent-cyan-300"
            onChange={onAutoApprovalSelectionToggle}
            type="checkbox"
          />
          <span className="font-semibold text-sky-100">Select for batch review</span>
          <span className="text-xs text-zinc-500">Safe auto-approval candidate</span>
        </label>
      ) : null}
      <button
        aria-controls={panelId}
        aria-expanded={isExpanded}
        className="w-full p-4 text-left"
        onClick={onToggle}
        type="button"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            {candidate ? (
              <Image
                alt=""
                className="size-11 rounded-md bg-white/10 object-cover"
                height={44}
                src={getChampionIconPath(candidate)}
                width={44}
              />
            ) : (
              <div className="size-11 rounded-md bg-white/10" />
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {candidate?.name ?? row.candidateChampionId} into {targetLabel}
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                {profile
                  ? `${formatProfileStatus(profile.reviewStatus)} profile v${profile.version}`
                  : "No profile"}
              </p>
            </div>
          </div>

          <span className="flex shrink-0 items-center gap-2 rounded-md border border-white/10 bg-black/15 px-3 py-2 text-xs font-semibold text-zinc-300">
            {isExpanded ? (
              <ChevronDown className="size-4 text-cyan-100" aria-hidden="true" />
            ) : (
              <ChevronRight className="size-4 text-cyan-100" aria-hidden="true" />
            )}
            {isExpanded ? "Collapse" : "Review"}
          </span>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-6">
          <CounterRankingV2Metric
            label="Observed rank"
            value={
              isLoadingObserved
                ? "Loading"
                : row.observed?.rank
                  ? `#${row.observed.rank}`
                  : "None"
            }
          />
          <CounterRankingV2Metric label="Games" value={formatNullableNumber(row.observed?.games)} />
          <CounterRankingV2Metric
            label="Confidence"
            value={row.observed?.confidence.shortLabel ?? "No data"}
          />
          <CounterRankingV2Metric
            label="Mechanical"
            value={
              result.status === "calculated"
                ? `#${row.mechanicalRank} / ${result.score}`
                : "Missing"
            }
          />
          <CounterRankingV2Metric
            label="Suggestion"
            value={
              automationSuggestion
                ? formatCounterRankingV2SuggestedStrength(automationSuggestion.suggestedStrength)
                : "Skipped"
            }
          />
          <CounterRankingV2Metric
            label="Adjustment"
            value={formatSignedAdjustment(previewAdjustment)}
          />
          <CounterRankingV2Metric
            label="Final reviewed"
            value={hasCalculatedScore ? String(finalScorePreview) : "Missing"}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Badge className="border-white/10 bg-white/5 text-zinc-300">
            {formatCounterRankingV2Status(result.status)}
          </Badge>
          <Badge className="border-violet-300/20 bg-violet-500/10 text-violet-100">
            {formatRankDelta(row.rankDelta)}
          </Badge>
          {automationSuggestion ? (
            <>
              <Badge className="border-sky-300/20 bg-sky-500/10 text-sky-100">
                {formatCounterRankingV2AutomationStatus(
                  automationSuggestion.automationStatus,
                )}
              </Badge>
              <Badge className="border-white/10 bg-white/5 text-zinc-300">
                {formatCounterRankingV2AutomationConfidence(
                  automationSuggestion.confidence,
                )}{" "}
                confidence
              </Badge>
            </>
          ) : null}
          {row.observed?.winRate !== null && row.observed?.winRate !== undefined ? (
            <Badge className="border-cyan-300/20 bg-cyan-500/10 text-cyan-100">
              {row.observed.winRate.toFixed(1)}% observed WR
            </Badge>
          ) : null}
          {row.review ? (
            <Badge className="border-emerald-300/20 bg-emerald-500/10 text-emerald-100">
              {formatCounterRankingV2ReviewStatus(row.review.reviewStatus)}
            </Badge>
          ) : (
            <Badge className="border-white/10 bg-white/5 text-zinc-400">No review row</Badge>
          )}
          {isSavedPublicEligible ? (
            <Badge className="border-emerald-300/20 bg-emerald-500/10 text-emerald-100">
              Public eligible
            </Badge>
          ) : (
            <Badge className="border-white/10 bg-white/5 text-zinc-400">
              Internal review only
            </Badge>
          )}
          {isLowSampleDesignCounter ? (
            <Badge className="border-amber-300/20 bg-amber-500/10 text-amber-100">
              Low sample mechanical counter
            </Badge>
          ) : hasLowObservedSample ? (
            <Badge className="border-amber-300/20 bg-amber-500/10 text-amber-100">
              Low sample size
            </Badge>
          ) : null}
          {hasNoObservedData ? (
            <Badge className="border-white/10 bg-white/5 text-zinc-400">No observed data</Badge>
          ) : null}
          {hasWeakMechanicalSignal ? (
            <Badge className="border-amber-300/20 bg-amber-500/10 text-amber-100">
              Weak signal
            </Badge>
          ) : null}
        </div>
      </button>

      {isExpanded ? (
        <div className="border-t border-white/10 p-4" id={panelId}>
          <div className="grid gap-3 md:grid-cols-3">
            <CounterRankingV2Metric
              label="Calculated mechanical score"
              value={hasCalculatedScore ? String(result.score) : "Missing"}
            />
            <CounterRankingV2Metric
              label="Manual adjustment"
              value={formatSignedAdjustment(previewAdjustment)}
            />
            <CounterRankingV2Metric
              label="Final reviewed score"
              value={hasCalculatedScore ? String(finalScorePreview) : "Missing"}
            />
          </div>

          {automationSuggestion ? (
            <div className="mt-4 rounded-md border border-sky-300/15 bg-sky-500/[0.05] p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="border-sky-300/20 bg-sky-500/10 text-sky-100">
                  {formatCounterRankingV2AutomationStatus(
                    automationSuggestion.automationStatus,
                  )}
                </Badge>
                <Badge className="border-white/10 bg-white/5 text-zinc-300">
                  {formatCounterRankingV2SuggestedStrength(
                    automationSuggestion.suggestedStrength,
                  )}
                </Badge>
                <Badge className="border-white/10 bg-white/5 text-zinc-300">
                  {formatCounterRankingV2AutomationConfidence(
                    automationSuggestion.confidence,
                  )}{" "}
                  confidence
                </Badge>
              </div>
              <ul className="mt-3 space-y-2">
                {automationSuggestion.reasons.map((reason) => (
                  <li className="text-sm leading-6 text-zinc-400" key={reason}>
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <form
            className="mt-4 grid gap-4 rounded-md border border-white/10 bg-black/15 p-4 lg:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault();
              onSaveReview(row, reviewForm);
            }}
          >
            <label className="block space-y-2">
              <span className="text-sm text-zinc-300">Review status</span>
              <select
                className={`${fieldClassName} h-10`}
                disabled={!hasCalculatedScore || isSavingReview}
                onChange={(event) =>
                  setReviewForm((currentForm) => ({
                    ...currentForm,
                    publicEligible:
                      event.target.value === "incorrect_suggestion" ||
                      event.target.value === "unreviewed"
                        ? false
                        : currentForm.publicEligible,
                    reviewStatus: event.target.value as CounterRankingV2ReviewStatus,
                  }))
                }
                value={reviewForm.reviewStatus}
              >
                {counterRankingV2ReviewStatuses.map((status) => (
                  <option className={selectOptionClassName} key={status} value={status}>
                    {formatCounterRankingV2ReviewStatus(status)}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm text-zinc-300">Adjustment reason</span>
              <select
                className={`${fieldClassName} h-10`}
                disabled={!hasCalculatedScore || isSavingReview}
                onChange={(event) =>
                  setReviewForm((currentForm) => ({
                    ...currentForm,
                    adjustmentReason: event.target.value as CounterRankingV2AdjustmentReason,
                  }))
                }
                value={reviewForm.adjustmentReason}
              >
                {counterRankingV2AdjustmentReasons.map((reason) => (
                  <option className={selectOptionClassName} key={reason} value={reason}>
                    {formatCounterRankingV2AdjustmentReason(reason)}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm text-zinc-300">Manual adjustment</span>
              <Input
                className="h-10 border-white/10 bg-white/5 text-zinc-100"
                disabled={!hasCalculatedScore || isSavingReview}
                max={30}
                min={-30}
                onChange={(event) =>
                  setReviewForm((currentForm) => ({
                    ...currentForm,
                    manualAdjustment: event.target.value,
                  }))
                }
                step={1}
                type="number"
                value={reviewForm.manualAdjustment}
              />
              <input
                aria-label="Manual adjustment slider"
                className="w-full accent-cyan-300"
                disabled={!hasCalculatedScore || isSavingReview}
                max={30}
                min={-30}
                onChange={(event) =>
                  setReviewForm((currentForm) => ({
                    ...currentForm,
                    manualAdjustment: event.target.value,
                  }))
                }
                step={1}
                type="range"
                value={Number.isFinite(parsedAdjustment) ? parsedAdjustment : 0}
              />
            </label>

            <label className="flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.03] p-3">
              <input
                checked={isPublicEligibleChecked}
                className="size-4 accent-cyan-300"
                disabled={
                  !hasCalculatedScore ||
                  isSavingReview ||
                  !isReviewStatusPublicEligible
                }
                onChange={(event) =>
                  setReviewForm((currentForm) => ({
                    ...currentForm,
                    publicEligible: event.target.checked,
                  }))
                }
                type="checkbox"
              />
              <span>
                <span className="block text-sm font-semibold text-zinc-100">Public eligible</span>
                <span className="block text-xs leading-5 text-zinc-500">
                  {publicEligibilityHelperText}
                </span>
              </span>
            </label>

            {isPublicEligibleChecked && hasLowObservedSample ? (
              <p className="rounded-md border border-amber-300/20 bg-amber-500/10 p-3 text-sm text-amber-100 lg:col-span-2">
                This will be treated as a low-sample mechanical counter.
              </p>
            ) : null}

            <label className="block space-y-2 lg:col-span-2">
              <span className="text-sm text-zinc-300">Admin review note</span>
              <textarea
                className={`${fieldClassName} min-h-24 py-2 leading-6`}
                disabled={!hasCalculatedScore || isSavingReview}
                onChange={(event) =>
                  setReviewForm((currentForm) => ({
                    ...currentForm,
                    adminReviewNote: event.target.value,
                  }))
                }
                placeholder="Why this mechanical suggestion should be trusted, adjusted, or rejected..."
                value={reviewForm.adminReviewNote}
              />
            </label>

            <div className="flex flex-wrap items-center justify-between gap-3 lg:col-span-2">
              <p className="text-xs leading-5 text-zinc-500">
                Raw calculated score stays model-owned. Saving only updates the review layer.
              </p>
              <Button
                className="border-cyan-300/20 bg-cyan-500/10 text-cyan-100 hover:bg-cyan-500/20"
                disabled={!hasCalculatedScore || isSavingReview}
                type="submit"
                variant="ghost"
              >
                <Save className="size-4" aria-hidden="true" />
                {isSavingReview ? "Saving..." : "Save review"}
              </Button>
            </div>
          </form>

          {hasWeakMechanicalSignal ? (
            <p className="mt-4 rounded-md border border-amber-300/20 bg-amber-500/10 p-3 text-sm leading-6 text-amber-100">
              Score is spread across small factors. Treat this suggestion as needing review.
            </p>
          ) : null}

          {topReasons.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {topReasons.map((reason) => (
                <li
                  className="rounded-md border border-white/10 bg-black/15 p-3 text-sm leading-6 text-zinc-300"
                  key={`${reason.factor.candidateStrength}-${reason.factor.enemyVulnerability}`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-zinc-100">{reason.title}</p>
                      <p className="mt-1 text-xs leading-5 text-zinc-500">
                        {reason.explanation}
                      </p>
                    </div>
                    <Badge
                      className={cn(
                        "shrink-0",
                        getCounterRankingV2ImpactBadgeClassName(reason.impactLevel),
                      )}
                    >
                      {formatCounterRankingV2ImpactLevel(reason.impactLevel)}
                    </Badge>
                  </div>
                  <details className="mt-3 text-xs text-zinc-500">
                    <summary className="cursor-pointer text-zinc-400">
                      Show calculation details
                    </summary>
                    <p className="mt-2">
                      {getTraitLabel(reason.factor.candidateStrength)} into{" "}
                      {getTraitLabel(reason.factor.enemyVulnerability)}. Raw contribution +
                      {reason.factor.contribution.toFixed(1)}.
                    </p>
                  </details>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 rounded-md border border-white/10 bg-black/15 p-3 text-sm text-zinc-500">
              No contributing mechanical factors are available for this candidate and selected
              target profile.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}

function CounterRankingV2Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-black/15 p-3">
      <p className="text-xs uppercase text-zinc-500">{label}</p>
      <p className="mt-1 font-semibold text-zinc-100">{value}</p>
    </div>
  );
}

function getCounterRankingV2ReviewForm(
  review: CounterRankingV2MechanicalReview | null,
): CounterRankingV2ReviewForm {
  return {
    adjustmentReason: review?.adjustmentReason ?? counterRankingV2DefaultAdjustmentReason,
    adminReviewNote: review?.adminReviewNote ?? "",
    manualAdjustment: String(review?.manualAdjustment ?? 0),
    publicEligible: review?.publicEligible ?? false,
    reviewStatus: review?.reviewStatus ?? counterRankingV2DefaultReviewStatus,
  };
}

function formatSignedAdjustment(adjustment: number) {
  if (!Number.isFinite(adjustment) || adjustment === 0) {
    return "0";
  }

  return adjustment > 0 ? `+${adjustment}` : String(adjustment);
}

function CounterPickRow({
  championsById,
  counterPick,
  editForm,
  editStatus,
  isEditing,
  isSelected,
  onCancelEdit,
  onDelete,
  onEditChange,
  onSave,
  onStartEdit,
  onToggleReviewed,
  onToggleSelected,
}: {
  championsById: Map<string, AdminLeagueChampion>;
  counterPick: LeagueCounterPick;
  editForm: CounterPickEditForm;
  editStatus: FormStatus;
  isEditing: boolean;
  isSelected: boolean;
  onCancelEdit: () => void;
  onDelete: (counterPickId: number) => void;
  onEditChange: (form: CounterPickEditForm) => void;
  onSave: (counterPick: LeagueCounterPick) => void;
  onStartEdit: (counterPick: LeagueCounterPick) => void;
  onToggleReviewed: (
    counterPick: LeagueCounterPick,
    generationStatus: LeagueCounterPick["generation_status"],
  ) => void;
  onToggleSelected: (counterPickId: number) => void;
}) {
  const counterChampion = championsById.get(counterPick.counter_champion_id);

  return (
    <div
      className={cn(
        "rounded-lg border p-4 transition",
        isSelected
          ? "border-violet-300/30 bg-violet-500/[0.08]"
          : "border-white/10 bg-white/[0.03]",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <button
            aria-label={isSelected ? "Deselect counter pick" : "Select counter pick"}
            className="mt-1 rounded-md border border-white/10 bg-white/5 p-1 text-zinc-300 transition hover:bg-white/10 hover:text-white"
            onClick={() => onToggleSelected(counterPick.id)}
            type="button"
          >
            {isSelected ? (
              <CheckSquare className="size-4" aria-hidden="true" />
            ) : (
              <Square className="size-4" aria-hidden="true" />
            )}
          </button>
          {counterChampion ? (
            <Image
              alt=""
              className="size-11 rounded-md bg-white/10 object-cover"
              height={44}
              src={getChampionIconPath(counterChampion)}
              width={44}
            />
          ) : (
            <div className="size-11 rounded-md bg-white/10" />
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              {counterChampion?.name ?? counterPick.counter_champion_id}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <CounterPickTypeBadge counterType={counterPick.counter_type} />
              <CounterPickStatusBadge status={counterPick.generation_status} />
              {counterPick.win_rate !== null ? (
                <Badge className="border-cyan-300/20 bg-cyan-500/10 text-cyan-100">
                  {counterPick.win_rate.toFixed(1)}% WR
                </Badge>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
            onClick={() =>
              counterPick.generation_status === "reviewed"
                ? onToggleReviewed(counterPick, "draft")
                : onToggleReviewed(counterPick, "reviewed")
            }
            size="sm"
            type="button"
            variant="ghost"
          >
            {counterPick.generation_status === "reviewed" ? (
              <RotateCcw className="size-3.5" aria-hidden="true" />
            ) : (
              <CheckCircle2 className="size-3.5" aria-hidden="true" />
            )}
            {counterPick.generation_status === "reviewed" ? "Revert" : "Review"}
          </Button>
          <Button
            className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
            onClick={() => onStartEdit(counterPick)}
            size="sm"
            type="button"
            variant="ghost"
          >
            <Pencil className="size-3.5" aria-hidden="true" />
            Edit
          </Button>
          <Button
            className="border-rose-300/20 bg-rose-500/10 text-rose-100 hover:bg-rose-500/20"
            onClick={() => onDelete(counterPick.id)}
            size="sm"
            type="button"
            variant="ghost"
          >
            <Trash2 className="size-3.5" aria-hidden="true" />
            Delete
          </Button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 text-xs text-zinc-400 md:grid-cols-3">
        <p>Updated {formatDateTime(counterPick.updated_at)}</p>
        <p>Strength {counterPick.counter_strength ?? "Not set"}</p>
        <p>Sample {counterPick.games !== null ? counterPick.games.toLocaleString() : "Not set"}</p>
      </div>

      {counterPick.reason ? (
        <p className="mt-3 text-sm leading-6 text-zinc-300">{counterPick.reason}</p>
      ) : null}

      {isEditing ? (
        <div className="mt-4 rounded-lg border border-violet-300/15 bg-violet-500/[0.06] p-4">
          <div className="space-y-4">
            <CounterPickEditableFields
              disabled={editStatus.isLoading}
              form={editForm}
              onChange={onEditChange}
            />
            <StatusMessage status={editStatus} />
            <div className="flex flex-wrap gap-2">
              <Button
                className="h-9 bg-violet-500/80 px-4 text-white hover:bg-violet-500"
                disabled={editStatus.isLoading}
                onClick={() => onSave(counterPick)}
                type="button"
              >
                <Save className="size-4" aria-hidden="true" />
                {editStatus.isLoading ? "Saving..." : "Save changes"}
              </Button>
              <Button
                className="h-9 border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
                disabled={editStatus.isLoading}
                onClick={onCancelEdit}
                type="button"
                variant="ghost"
              >
                <X className="size-4" aria-hidden="true" />
                Cancel
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function CounterPickManagementMetricsPanel({
  error,
  isLoading,
  metrics,
  onRefresh,
}: {
  error: string | null;
  isLoading: boolean;
  metrics: CounterPickManagementMetrics | null;
  onRefresh: () => void;
}) {
  return (
    <div className="space-y-4">
      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-mono text-lg font-semibold text-white">Riot data pipeline</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Stored Riot evidence and aggregate rows used by public Counter Pick stats.
            </p>
          </div>
          <Button
            className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
            disabled={isLoading}
            onClick={onRefresh}
            type="button"
            variant="ghost"
          >
            {isLoading ? (
              <RefreshCw className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <RefreshCw className="size-4" aria-hidden="true" />
            )}
            Refresh metrics
          </Button>
        </div>
        {error ? (
          <p className="rounded-md border border-rose-400/20 bg-rose-500/10 p-3 text-sm text-rose-100">
            {error}
          </p>
        ) : null}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <CounterPickMetricCard
            description="Validated Riot match-role observations"
            isLoading={isLoading && !metrics}
            label="Matchup observations"
            metric={metrics?.pipeline.matchupObservations ?? null}
          />
          <CounterPickMetricCard
            description="Aggregated champion, role, patch and rank rows"
            isLoading={isLoading && !metrics}
            label="Counter Pick stat rows"
            metric={metrics?.pipeline.counterPickStatRows ?? null}
          />
          <CounterPickMetricCard
            description="Sorted champion pair + role + patch"
            isLoading={isLoading && !metrics}
            label="Unique matchup groups"
            metric={metrics?.pipeline.uniqueMatchupGroups ?? null}
          />
          <LatestSuccessfulScanCard isLoading={isLoading && !metrics} metrics={metrics} />
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="font-mono text-lg font-semibold text-white">Editorial content</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Manually reviewed guide records from the editorial Counter Pick table.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <CounterPickMetricCard
            description="Rows in league_counter_picks"
            isLoading={isLoading && !metrics}
            label="Counter Pick guides"
            metric={metrics?.editorial.totalGuides ?? null}
          />
          <CounterPickMetricCard
            description="Guides marked reviewed"
            isLoading={isLoading && !metrics}
            label="Reviewed guides"
            metric={metrics?.editorial.reviewedGuides ?? null}
          />
          <CounterPickMetricCard
            description="Guides still in draft"
            isLoading={isLoading && !metrics}
            label="Draft guides"
            metric={metrics?.editorial.visibleDrafts ?? null}
          />
        </div>
      </section>
    </div>
  );
}

function CounterPickOverviewOperationsPanel({
  guideCount,
  isLoading,
  metrics,
}: {
  guideCount: number;
  isLoading: boolean;
  metrics: CounterPickManagementMetrics | null;
}) {
  const latestCollection = metrics?.operations.latestCollection.value;
  const latestCollectionError = metrics?.operations.latestCollection.error;

  return (
    <Card className="border-white/10 bg-[#10182b]/90 text-white shadow-xl shadow-black/15">
      <CardHeader>
        <CardTitle className="font-mono text-xl">Counter Pick overview</CardTitle>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
          Snapshot of stored data, collection activity, and the latest patch/rank coverage signal.
        </p>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <CounterPickMetricCard
          description="Stored Riot seed candidates available to collection jobs"
          isLoading={isLoading && !metrics}
          label="Seed candidates"
          metric={metrics?.operations.seedCandidates ?? null}
        />
        <CounterPickMetricCard
          description="Collection jobs currently queued, scanning, paused, or aggregating"
          isLoading={isLoading && !metrics}
          label="Active/recent scan status"
          metric={metrics?.operations.activeCollectionJobs ?? null}
        />
        <CounterPickStaticOverviewCard
          description="Loaded editorial Counter Pick records in this admin session"
          isLoading={false}
          label="Guide records"
          value={guideCount.toLocaleString()}
        />
        <CounterPickStaticOverviewCard
          description={
            latestCollectionError ??
            (latestCollection
              ? `${formatCollectionCoverage(latestCollection)} updated ${formatDateTime(
                  latestCollection.updatedAt,
                )}`
              : "No persisted collection job is available yet.")
          }
          isLoading={isLoading && !metrics}
          label="Patch / rank coverage"
          value={
            latestCollectionError
              ? "Unavailable"
              : latestCollection
                ? (latestCollection.resolvedPatch ?? latestCollection.rankBracket ?? "Recorded")
                : "Pending"
          }
        />
      </CardContent>
    </Card>
  );
}

function CounterPickAdminLinks() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <CounterPickAdminLinkCard
        description="Open Riot ID lookup, seed candidate selection, scan configuration, active progress, controls, and recent jobs."
        href="/admin/counter-picks/collect"
        label="Collect data"
      />
      <CounterPickAdminLinkCard
        description="Compare current observed win-rate ranks with Counter Ranking V2 mechanical fit in shadow mode."
        href="/admin/counter-picks/shadow-ranking"
        label="Shadow ranking"
      />
    </div>
  );
}

function CounterPickAdminLinkCard({
  description,
  href,
  label,
}: {
  description: string;
  href: string;
  label: string;
}) {
  return (
    <Card className="border-cyan-300/15 bg-[#071321]/95 p-5 text-white shadow-xl shadow-black/15">
      <div className="flex h-full flex-col items-start gap-4">
        <div>
          <h2 className="font-mono text-lg font-semibold text-white">{label}</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p>
        </div>
        <Button asChild className="mt-auto" size="sm" variant="outline">
          <Link href={href} transitionTypes={["admin-section"]}>
            Open
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}

function CounterPickStaticOverviewCard({
  description,
  isLoading,
  label,
  value,
}: {
  description: string;
  isLoading: boolean;
  label: string;
  value: string;
}) {
  return (
    <Card className="border-white/10 bg-[#10182b]/90 p-5 text-white shadow-xl shadow-black/15">
      <p className="font-mono text-3xl font-semibold text-violet-100">
        {isLoading ? "Loading" : value}
      </p>
      <p className="mt-1 text-sm font-medium text-zinc-200">{label}</p>
      <p className="mt-2 text-xs leading-5 text-zinc-500">{description}</p>
    </Card>
  );
}

function CounterPickMetricCard({
  description,
  isLoading,
  label,
  metric,
}: {
  description: string;
  isLoading: boolean;
  label: string;
  metric: CounterPickManagementMetrics["pipeline"]["matchupObservations"] | null;
}) {
  const isUnavailable = Boolean(metric?.error);
  const value = isLoading
    ? "Loading"
    : isUnavailable
      ? "Unavailable"
      : metric
        ? (metric.value?.toLocaleString() ?? "Unavailable")
        : "Pending";

  return (
    <Card className="border-white/10 bg-[#10182b]/90 p-5 text-white shadow-xl shadow-black/15">
      <p
        className={cn(
          "font-mono text-3xl font-semibold",
          isUnavailable ? "text-amber-100" : "text-violet-100",
        )}
      >
        {value}
      </p>
      <p className="mt-1 text-sm font-medium text-zinc-200">{label}</p>
      <p className="mt-2 text-xs leading-5 text-zinc-500">
        {isUnavailable ? metric?.error : description}
      </p>
    </Card>
  );
}

function LatestSuccessfulScanCard({
  isLoading,
  metrics,
}: {
  isLoading: boolean;
  metrics: CounterPickManagementMetrics | null;
}) {
  const latestScan = metrics?.latestSuccessfulScan.value;
  const error = metrics?.latestSuccessfulScan.error;
  const title = isLoading
    ? "Loading"
    : error
      ? "Unavailable"
      : latestScan
        ? `${formatNullableNumber(latestScan.uniqueMatches)} unique matches`
        : "No successful scans yet";

  return (
    <Card className="border-white/10 bg-[#10182b]/90 p-5 text-white shadow-xl shadow-black/15">
      <p
        className={cn(
          "font-mono text-2xl font-semibold",
          error ? "text-amber-100" : "text-violet-100",
        )}
      >
        {title}
      </p>
      <p className="mt-1 text-sm font-medium text-zinc-200">Latest successful scan</p>
      {latestScan ? (
        <div className="mt-2 space-y-1 text-xs leading-5 text-zinc-500">
          <p>Completed {formatDateTime(latestScan.completedAt)}</p>
          <p>
            {formatNullableNumber(latestScan.observationsInserted)} new observations ·{" "}
            {formatNullableNumber(latestScan.statRowsUpdated)} stat rows updated
          </p>
        </div>
      ) : (
        <p className="mt-2 text-xs leading-5 text-zinc-500">
          {error ?? "The persisted scan job table has no completed scan yet."}
        </p>
      )}
    </Card>
  );
}

function CounterPickTypeBadge({ counterType }: { counterType: LeagueCounterPickType }) {
  return (
    <Badge
      className={
        counterType === "best_counter"
          ? "border-emerald-300/20 bg-emerald-500/10 text-emerald-100"
          : "border-amber-300/20 bg-amber-500/10 text-amber-100"
      }
    >
      {counterType === "best_counter" ? "Best Counter" : "Countered By"}
    </Badge>
  );
}

function CounterPickStatusBadge({ status }: { status: LeagueCounterPick["generation_status"] }) {
  return (
    <Badge
      className={
        status === "reviewed"
          ? "border-cyan-300/20 bg-cyan-500/10 text-cyan-100"
          : "border-zinc-300/15 bg-white/5 text-zinc-300"
      }
    >
      {status === "reviewed" ? "Reviewed" : "Draft"}
    </Badge>
  );
}

function EmptyState({ text, tone = "default" }: { text: string; tone?: "default" | "warning" }) {
  return (
    <div
      className={cn(
        "rounded-lg border p-6 text-sm",
        tone === "warning"
          ? "border-amber-300/20 bg-amber-500/10 text-amber-100"
          : "border-white/10 bg-white/[0.03] text-zinc-400",
      )}
    >
      {text}
    </div>
  );
}

function StatusMessage({ status }: { status: FormStatus }) {
  if (status.error) {
    return (
      <p className="rounded-md border border-rose-400/20 bg-rose-500/10 p-3 text-sm text-rose-100">
        {status.error}
      </p>
    );
  }

  if (status.success) {
    return (
      <p className="rounded-md border border-emerald-400/20 bg-emerald-500/10 p-3 text-sm text-emerald-100">
        {status.success}
      </p>
    );
  }

  return null;
}

function sortCounterPicksForAdmin(counterPicks: LeagueCounterPick[]) {
  return [...counterPicks].sort((left, right) => {
    const typeOrder = left.counter_type.localeCompare(right.counter_type);

    if (typeOrder !== 0) {
      return typeOrder;
    }

    const leftWinRate = left.win_rate;
    const rightWinRate = right.win_rate;

    if (leftWinRate !== null && rightWinRate !== null && leftWinRate !== rightWinRate) {
      return left.counter_type === "best_counter"
        ? rightWinRate - leftWinRate
        : leftWinRate - rightWinRate;
    }

    if (leftWinRate !== null) {
      return -1;
    }

    if (rightWinRate !== null) {
      return 1;
    }

    return left.counter_champion_id.localeCompare(right.counter_champion_id);
  });
}

function nullableTrim(value: string) {
  const trimmedValue = value.trim();

  return trimmedValue ? trimmedValue : null;
}

function getRoleLabel(role: LeagueRole) {
  return role === "adc" ? "ADC" : role.charAt(0).toUpperCase() + role.slice(1);
}

function normalizeCounterRankingV2ChampionId(championId: string) {
  return championId.trim().toLowerCase();
}

function getChampionIdFromOptionMap(
  championsByNormalizedId: Map<string, AdminLeagueChampion>,
  championId: string,
) {
  return championsByNormalizedId.get(normalizeCounterRankingV2ChampionId(championId))?.id ?? null;
}

function includeSelectedChampionOption(
  championOptions: AdminLeagueChampion[],
  selectedChampion: AdminLeagueChampion | null | undefined,
) {
  if (!selectedChampion || championOptions.some((champion) => champion.id === selectedChampion.id)) {
    return championOptions;
  }

  return [selectedChampion, ...championOptions];
}

function normalizeRoleForAdmin(role: string | null) {
  if (!role) {
    return null;
  }

  const normalizedRole = role.trim().toLowerCase();

  if (normalizedRole === "bottom" || normalizedRole === "bot") {
    return "adc";
  }

  return leagueRoles.includes(normalizedRole as LeagueRole)
    ? (normalizedRole as LeagueRole)
    : null;
}

function getTraitLabel(traitId: string) {
  return (
    counterRankingV2TraitDefinitionsById.get(traitId as CounterRankingV2TraitId)?.label ?? traitId
  );
}

function formatCounterRankingV2ProfileAvailability(championId: string) {
  const profile = getCounterRankingV2ChampionProfile(championId);

  if (!profile) {
    return "No V2 profile";
  }

  return profile.reviewStatus === "reviewed"
    ? `Reviewed v${profile.version}`
    : `Needs review profile v${profile.version}`;
}

function formatProfileStatus(status: CounterRankingV2ProfileStatus) {
  switch (status) {
    case "reviewed":
      return "Reviewed";
    case "needs_review":
      return "Needs review";
    case "draft":
      return "Draft";
  }
}

function formatCounterRankingV2Status(status: CounterRankingV2FitStatus) {
  switch (status) {
    case "calculated":
      return "Mechanical fit calculated";
    case "incomplete_profile":
      return "Incomplete profile";
    case "missing_candidate_profile":
      return "Missing candidate profile";
    case "missing_enemy_profile":
      return "Missing target profile";
  }
}

function formatCounterRankingV2ImpactLevel(impactLevel: CounterRankingV2FactorImpactLevel) {
  switch (impactLevel) {
    case "high":
      return "High impact";
    case "medium":
      return "Medium impact";
    case "low":
      return "Low impact";
  }
}

function getCounterRankingV2ImpactBadgeClassName(
  impactLevel: CounterRankingV2FactorImpactLevel,
) {
  switch (impactLevel) {
    case "high":
      return "border-emerald-300/20 bg-emerald-500/10 text-emerald-100";
    case "medium":
      return "border-sky-300/20 bg-sky-500/10 text-sky-100";
    case "low":
      return "border-white/10 bg-white/5 text-zinc-300";
  }
}

function formatCounterRankingV2AutomationStatus(status: CounterRankingV2AutomationStatus) {
  switch (status) {
    case "auto_approval_candidate":
      return "Auto approval candidate";
    case "auto_approved":
      return "Auto approved";
    case "auto_suggested":
      return "Auto suggested";
    case "manual_approved":
      return "Manual approved";
    case "manual_rejected":
      return "Manual rejected";
    case "needs_review":
      return "Needs review";
  }
}

function formatCounterRankingV2SuggestedStrength(strength: CounterRankingV2SuggestedStrength) {
  switch (strength) {
    case "hard_counter":
      return "Hard counter";
    case "strong_counter":
      return "Strong counter";
    case "soft_counter":
      return "Soft counter";
    case "neutral":
      return "Neutral";
    case "poor_fit":
      return "Poor fit";
  }
}

function formatCounterRankingV2AutomationConfidence(
  confidence: CounterRankingV2AutomationConfidence,
) {
  switch (confidence) {
    case "high":
      return "High";
    case "medium":
      return "Medium";
    case "low":
      return "Low";
  }
}

function formatCounterRankingV2ReviewStatus(status: CounterRankingV2ReviewStatus) {
  switch (status) {
    case "unreviewed":
      return "Unreviewed";
    case "verified_strong_counter":
      return "Verified strong counter";
    case "verified_soft_counter":
      return "Verified soft counter";
    case "incorrect_suggestion":
      return "Incorrect suggestion";
    case "high_mastery_required":
      return "High mastery required";
    case "needs_more_data":
      return "Needs more data";
  }
}

function formatCounterRankingV2AdjustmentReason(reason: CounterRankingV2AdjustmentReason) {
  switch (reason) {
    case "auto_generated":
      return "Auto generated";
    case "patch_buff":
      return "Patch buff";
    case "patch_nerf":
      return "Patch nerf";
    case "meta_shift":
      return "Meta shift";
    case "practical_difficulty":
      return "Practical difficulty";
    case "data_disagreement":
      return "Data disagreement";
    case "manual_review":
      return "Manual review";
    case "other":
      return "Other";
  }
}

function formatCollectionCoverage(
  collection: NonNullable<CounterPickManagementMetrics["operations"]["latestCollection"]["value"]>,
) {
  const parts = [
    collection.platform,
    collection.role ? getRoleLabel(collection.role as LeagueRole) : null,
    collection.rankBracket,
    collection.status,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(" / ") : `Collection #${collection.id}`;
}

function formatRankDelta(rankDelta: number | null) {
  if (rankDelta === null) {
    return "No observed rank";
  }

  if (rankDelta === 0) {
    return "Ranks aligned";
  }

  return rankDelta > 0
    ? `Mechanical ${rankDelta} higher`
    : `Observed ${Math.abs(rankDelta)} higher`;
}

function formatDateTime(value: string | null | undefined) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatNullableNumber(value: number | null | undefined) {
  return typeof value === "number" ? value.toLocaleString() : "—";
}
