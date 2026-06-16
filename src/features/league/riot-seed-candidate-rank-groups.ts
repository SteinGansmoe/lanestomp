import type {
  RiotSeedCandidateFilters,
  RiotSeedCandidateRankEnrichmentStatus,
  RiotSeedCandidateSort,
  RiotSeedCandidateStatus,
  RiotSeedCandidateView,
} from "./riot-scan-jobs";
import type { LeagueRole } from "./roles";

export type RiotSeedCandidateRankGroupId =
  | "diamond"
  | "gold-emerald"
  | "iron-silver"
  | "master-plus"
  | "unranked-unknown";

export type RiotSeedCandidateSortDirection = "asc" | "desc";

export type RiotSeedCandidateRankGroupDefinition = {
  description: string;
  id: RiotSeedCandidateRankGroupId;
  label: string;
  rankStatuses: RiotSeedCandidateRankEnrichmentStatus[];
  tiers: string[];
};

export type RiotSeedCandidateGroupPageRequest = {
  page: number;
  pageSize: number;
  rankGroup: RiotSeedCandidateRankGroupId;
  sort: RiotSeedCandidateSort;
  sortDirection: RiotSeedCandidateSortDirection;
};

export type PaginatedSeedCandidates = {
  candidates: RiotSeedCandidateView[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

export type RiotSeedCandidateGroupedFilters = RiotSeedCandidateFilters & {
  minObservedGames?: number;
  minPrimaryChampionShare?: number;
  minPrimaryRoleShare?: number;
  primaryRole?: LeagueRole | "all";
  status?: RiotSeedCandidateStatus | "all";
};

export const defaultRiotSeedCandidatePageSize = 25;
export const riotSeedCandidatePageSizes = [25, 50, 100] as const;

export const riotSeedCandidateRankGroups = [
  {
    description: "Challenger, Grandmaster and Master candidates.",
    id: "master-plus",
    label: "Master+",
    rankStatuses: ["ranked"],
    tiers: ["CHALLENGER", "GRANDMASTER", "MASTER"],
  },
  {
    description: "Diamond candidates.",
    id: "diamond",
    label: "Diamond",
    rankStatuses: ["ranked"],
    tiers: ["DIAMOND"],
  },
  {
    description: "Emerald, Platinum and Gold candidates.",
    id: "gold-emerald",
    label: "Gold-Emerald",
    rankStatuses: ["ranked"],
    tiers: ["EMERALD", "PLATINUM", "GOLD"],
  },
  {
    description: "Silver, Bronze and Iron candidates.",
    id: "iron-silver",
    label: "Iron-Silver",
    rankStatuses: ["ranked"],
    tiers: ["SILVER", "BRONZE", "IRON"],
  },
  {
    description: "Unranked candidates, pending rank lookups and failed rank lookups.",
    id: "unranked-unknown",
    label: "Unranked / Unknown",
    rankStatuses: ["failed", "not_found", "pending", "unranked"],
    tiers: [],
  },
] as const satisfies readonly RiotSeedCandidateRankGroupDefinition[];

export const riotSeedCandidateRankGroupIds = riotSeedCandidateRankGroups.map(
  (group) => group.id,
);

export const riotSeedCandidateRankGroupsById = new Map(
  riotSeedCandidateRankGroups.map((group) => [group.id, group] as const),
);

const rankTierSortValues = new Map(
  [
    "CHALLENGER",
    "GRANDMASTER",
    "MASTER",
    "DIAMOND",
    "EMERALD",
    "PLATINUM",
    "GOLD",
    "SILVER",
    "BRONZE",
    "IRON",
  ].map((tier, index) => [tier, index] as const),
);

const rankDivisionSortValues = new Map(
  ["I", "II", "III", "IV"].map((division, index) => [division, index] as const),
);

export function getRiotSeedCandidateRankGroup(
  candidate: Pick<RiotSeedCandidateView, "rank_enrichment_status" | "rank_tier">,
): RiotSeedCandidateRankGroupId {
  const tier = normalizeRankTier(candidate.rank_tier);
  const status = candidate.rank_enrichment_status;

  if (tier) {
    const group = riotSeedCandidateRankGroups.find((rankGroup) =>
      (rankGroup.tiers as readonly string[]).includes(tier),
    );

    if (group) {
      return group.id;
    }
  }

  if (status === "ranked") {
    return "unranked-unknown";
  }

  return "unranked-unknown";
}

export function normalizeRiotSeedCandidatePage(value: number) {
  return Number.isInteger(value) && value > 0 ? value : 1;
}

export function normalizeRiotSeedCandidatePageSize(value: number) {
  return riotSeedCandidatePageSizes.includes(value as (typeof riotSeedCandidatePageSizes)[number])
    ? value
    : defaultRiotSeedCandidatePageSize;
}

export function getRiotSeedCandidateTotalPages(totalCount: number, pageSize: number) {
  return Math.max(1, Math.ceil(Math.max(totalCount, 0) / Math.max(pageSize, 1)));
}

export function getRiotSeedCandidateRange({
  page,
  pageSize,
  totalCount,
}: {
  page: number;
  pageSize: number;
  totalCount: number;
}) {
  if (totalCount <= 0) {
    return {
      from: 0,
      to: 0,
    };
  }

  const from = (page - 1) * pageSize + 1;

  return {
    from,
    to: Math.min(from + pageSize - 1, totalCount),
  };
}

export function createDefaultRiotSeedCandidateGroupRequest(
  rankGroup: RiotSeedCandidateRankGroupId,
): RiotSeedCandidateGroupPageRequest {
  const sort = getDefaultRiotSeedCandidateGroupSort(rankGroup);

  return {
    page: 1,
    pageSize: defaultRiotSeedCandidatePageSize,
    rankGroup,
    sort,
    sortDirection: getDefaultRiotSeedCandidateSortDirection(sort),
  };
}

export function getDefaultRiotSeedCandidateGroupSort(
  rankGroup: RiotSeedCandidateRankGroupId,
): RiotSeedCandidateSort {
  return rankGroup === "unranked-unknown" ? "observed_games" : "rank_tier";
}

export function getDefaultRiotSeedCandidateSortDirection(
  sort: RiotSeedCandidateSort,
): RiotSeedCandidateSortDirection {
  return sort === "rank_tier" ? "asc" : "desc";
}

export function sortRiotSeedCandidateRows(
  candidates: RiotSeedCandidateView[],
  {
    sort,
    sortDirection,
  }: {
    sort: RiotSeedCandidateSort;
    sortDirection: RiotSeedCandidateSortDirection;
  },
) {
  return [...candidates].sort((left, right) => {
    const directionMultiplier = sortDirection === "asc" ? 1 : -1;

    if (sort === "rank_tier") {
      const rankSort = getRankCandidateSortValue(left) - getRankCandidateSortValue(right);

      if (rankSort !== 0) {
        return sortDirection === "asc" ? rankSort : -rankSort;
      }
    } else {
      const fieldSort = compareCandidateSortField(left, right, sort);

      if (fieldSort !== 0) {
        return fieldSort * directionMultiplier;
      }
    }

    const lpSort =
      Number(left.rank_league_points ?? -1) - Number(right.rank_league_points ?? -1);

    if (lpSort !== 0) {
      return -lpSort;
    }

    if (left.observed_games !== right.observed_games) {
      return right.observed_games - left.observed_games;
    }

    return left.id.localeCompare(right.id);
  });
}

export function toggleRiotSeedCandidateSelection(
  selectedIds: Set<string>,
  candidateId: string,
) {
  const nextSelection = new Set(selectedIds);

  if (nextSelection.has(candidateId)) {
    nextSelection.delete(candidateId);
  } else {
    nextSelection.add(candidateId);
  }

  return nextSelection;
}

export function selectVisibleRiotSeedCandidates(
  selectedIds: Set<string>,
  visibleCandidateIds: string[],
) {
  return new Set([...selectedIds, ...visibleCandidateIds]);
}

export function pruneRiotSeedCandidateSelection(
  selectedIds: Set<string>,
  validCandidateIds: string[],
) {
  const validIds = new Set(validCandidateIds);

  return new Set([...selectedIds].filter((candidateId) => validIds.has(candidateId)));
}

export function isRiotSeedCandidateBulkSelectionWithinLimit(
  selectedIds: Set<string>,
  limit: number,
) {
  return selectedIds.size <= limit;
}

function compareCandidateSortField(
  left: RiotSeedCandidateView,
  right: RiotSeedCandidateView,
  sort: RiotSeedCandidateSort,
) {
  switch (sort) {
    case "created_at":
      return compareNullableDates(left.created_at, right.created_at);
    case "last_scanned_at":
      return compareNullableDates(left.last_scanned_at, right.last_scanned_at);
    case "last_seen_at":
      return compareNullableDates(left.last_seen_at, right.last_seen_at);
    case "primary_champion_share":
      return compareNullableNumbers(left.primary_champion_share, right.primary_champion_share);
    case "primary_role_share":
      return compareNullableNumbers(left.primary_role_share, right.primary_role_share);
    case "rank_last_success_at":
      return compareNullableDates(left.rank_last_success_at, right.rank_last_success_at);
    case "rank_league_points":
      return compareNullableNumbers(left.rank_league_points, right.rank_league_points);
    case "observed_games":
    case "rank_tier":
    default:
      return compareNullableNumbers(left.observed_games, right.observed_games);
  }
}

function compareNullableDates(left: string | null, right: string | null) {
  return new Date(left ?? 0).getTime() - new Date(right ?? 0).getTime();
}

function compareNullableNumbers(left: number | null, right: number | null) {
  return Number(left ?? -1) - Number(right ?? -1);
}

function getRankCandidateSortValue(
  candidate: Pick<RiotSeedCandidateView, "rank_division" | "rank_tier">,
) {
  const tierSortValue = rankTierSortValues.get(normalizeRankTier(candidate.rank_tier) ?? "");
  const divisionSortValue = rankDivisionSortValues.get(candidate.rank_division ?? "");

  if (tierSortValue === undefined) {
    return Number.MAX_SAFE_INTEGER;
  }

  return tierSortValue * 10 + (divisionSortValue ?? 0);
}

function normalizeRankTier(value: string | null) {
  const tier = String(value ?? "")
    .trim()
    .toUpperCase();

  return tier || null;
}
