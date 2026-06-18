import type { LeagueRole } from "./roles";
import type { RiotScanJobView, RiotScanSummary } from "./riot-scan-jobs";
import type {
  SeedCandidateLifecycleState,
  SeedCandidateRankBracket,
} from "./riot-seed-candidate-lifecycle";

export type RiotCollectionRankBracket = Exclude<SeedCandidateRankBracket, "unknown">;
export type RiotCollectionRole = LeagueRole | "any";
export type RiotCollectionStatus =
  | "aggregating"
  | "cancelled"
  | "completed"
  | "completed-partial"
  | "discovering-seeds"
  | "failed"
  | "paused"
  | "queued"
  | "scanning"
  | "selecting-seeds";

export type RiotCollectionStopReason =
  | "aggregation-failed"
  | "api-budget-reached"
  | "cancelled-by-admin"
  | "discovery-disabled"
  | "discovery-exhausted"
  | "error-budget-reached"
  | "manual-pause"
  | "no-new-data"
  | "no-ready-seeds"
  | "rate-limited"
  | "runtime-limit-reached"
  | "target-reached";

export type RiotCollectionTarget = 50 | 100 | 200;

export type RiotCollectionJobProgress = {
  activeScanJobId?: number | null;
  activeScanProgress?: RiotScanSummary | null;
  activeScanProgressAt?: string | null;
  lastAdvancedAt?: string;
  lastMessage?: string;
  recordedScanJobIds?: number[];
  safetyLimits?: RiotCollectionSafetyLimits;
};

export type RiotCollectionSafetyLimits = {
  maxIdentifierLookupsPerJob: number;
  maxLadderEntriesPerJob: number;
  maxLadderPagesPerJob: number;
  maxNewCandidatesPerJob: number;
  maxSeedBatchSize: number;
};

export type RiotCollectionDiscoveryDiagnostics = {
  api: {
    failures: number;
    rateLimited: boolean;
    requestCount: number;
    retryCount: number;
  };
  candidates: {
    created: number;
    enriched: number;
    existingMatched: number;
    persistenceFailures: number;
    rankSnapshotFailures: number;
    rankSnapshotsInserted: number;
    reused: number;
  };
  candidateIds: string[];
  entriesFetched: number;
  identifiers: {
    directPuuids: number;
    failed: number;
    lookupsAttempted: number;
    missing: number;
    resolved: number;
  };
  invocation: {
    collectionJobId: number;
    event: "ladder-discovery-started";
    rankBracket: RiotCollectionRankBracket;
    readySeedsBeforeDiscovery: number;
    remainingTargetMatches: number;
    role: RiotCollectionRole;
  } | null;
  lifecycle: Record<SeedCandidateLifecycleState, number> & {
    eligibleSeedsProduced: number;
  };
  pagesFetched: number;
  reasonCodes: string[];
  sourcesAttempted: number;
};

export type RiotCollectionJobView = {
  api_requests_used: number;
  automatic_seed_discovery: boolean;
  cancelled_at: string | null;
  completed_at: string | null;
  created_at: string;
  current_patch_only: boolean;
  duplicate_match_ids: number;
  error_count: number;
  failed_at: string | null;
  focus_champion_id: string | null;
  id: number;
  latest_scan_job: RiotScanJobView | null;
  new_matchup_observations: number;
  platform: string;
  progress: RiotCollectionJobProgress;
  queue_type: string;
  rank_bracket: RiotCollectionRankBracket;
  regional_route: string;
  resolved_patch: string | null;
  role: RiotCollectionRole;
  scan_batches_completed: number;
  scan_batches_started: number;
  seeds_discovered: number;
  seeds_used: number;
  started_at: string | null;
  stat_rows_updated: number;
  status: RiotCollectionStatus;
  stop_detail: string | null;
  stop_reason: RiotCollectionStopReason | null;
  summary: Record<string, unknown>;
  target_unique_matches: RiotCollectionTarget;
  unique_matches_processed: number;
  updated_at: string;
  warning_count: number;
};

export type StartRiotCollectionJobInput = {
  accessToken: string;
  automaticSeedDiscovery: boolean;
  currentPatchOnly: boolean;
  focusChampionId?: string | null;
  platform?: string;
  rankBracket: RiotCollectionRankBracket;
  regionalRoute?: string;
  role: RiotCollectionRole;
  targetUniqueMatches: RiotCollectionTarget;
};

export type RiotCollectionJobResult =
  | {
      job: RiotCollectionJobView;
      ok: true;
    }
  | {
      error: string;
      ok: false;
    };

export type RiotCollectionJobsResult =
  | {
      jobs: RiotCollectionJobView[];
      ok: true;
    }
  | {
      error: string;
      ok: false;
    };

export type RiotCollectionInventoryResult =
  | {
      inventory: {
        estimatedAdditionalSeedsNeeded: string;
        readySeeds: number;
      };
      ok: true;
    }
  | {
      error: string;
      ok: false;
    };

export type RiotCollectionLadderSource =
  | {
      route: "high-tier";
      tier: "CHALLENGER" | "GRANDMASTER" | "MASTER";
    }
  | {
      divisions: readonly ["IV", "III", "II", "I"];
      route: "tier-division";
      tier: "BRONZE" | "DIAMOND" | "EMERALD" | "GOLD" | "IRON" | "PLATINUM" | "SILVER";
    };

export const riotCollectionStatuses = [
  "queued",
  "discovering-seeds",
  "selecting-seeds",
  "scanning",
  "aggregating",
  "completed",
  "completed-partial",
  "failed",
  "cancelled",
  "paused",
] as const satisfies readonly RiotCollectionStatus[];

export const riotCollectionTerminalStatuses = [
  "cancelled",
  "completed",
  "completed-partial",
  "failed",
] as const satisfies readonly RiotCollectionStatus[];

export const riotCollectionRankBrackets = [
  "iron-silver",
  "gold-emerald",
  "diamond",
  "master-plus",
] as const satisfies readonly RiotCollectionRankBracket[];

export const riotCollectionTargets = [
  50, 100, 200,
] as const satisfies readonly RiotCollectionTarget[];

export const defaultRiotCollectionSafetyLimits = {
  maxIdentifierLookupsPerJob: 150,
  maxLadderEntriesPerJob: 500,
  maxLadderPagesPerJob: 5,
  maxNewCandidatesPerJob: 100,
  maxSeedBatchSize: 20,
} as const satisfies RiotCollectionSafetyLimits;

export const riotCollectionDiscoveryReasonLabels = {
  "api-failure": "One or more Riot ladder API requests failed.",
  "identifier-resolution-failed": "Ladder players were found, but PUUID resolution failed.",
  "missing-riot-api-key": "Missing Riot API configuration.",
  "no-eligible-seeds": "Ladder candidates were stored, but none were eligible for the next scan.",
  "no-ladder-entries": "Ladder discovery returned no entries from the requested pages.",
  "no-ladder-sources": "No ladder sources are configured for the selected rank bracket.",
  "no-ready-seeds-after-discovery":
    "Discovery finished, but selection found no ready unused seeds.",
  "persistence-failed": "Ladder players were resolved, but candidate persistence failed.",
  "rate-limited": "Riot rate limit reached; resume later.",
} as const;

const standardDivisions = ["IV", "III", "II", "I"] as const;

export const riotCollectionLadderSourcesByBracket = {
  diamond: [{ divisions: standardDivisions, route: "tier-division", tier: "DIAMOND" }],
  "gold-emerald": [
    { divisions: standardDivisions, route: "tier-division", tier: "GOLD" },
    { divisions: standardDivisions, route: "tier-division", tier: "PLATINUM" },
    { divisions: standardDivisions, route: "tier-division", tier: "EMERALD" },
  ],
  "iron-silver": [
    { divisions: standardDivisions, route: "tier-division", tier: "IRON" },
    { divisions: standardDivisions, route: "tier-division", tier: "BRONZE" },
    { divisions: standardDivisions, route: "tier-division", tier: "SILVER" },
  ],
  "master-plus": [
    { route: "high-tier", tier: "MASTER" },
    { route: "high-tier", tier: "GRANDMASTER" },
    { route: "high-tier", tier: "CHALLENGER" },
  ],
} as const satisfies Record<RiotCollectionRankBracket, readonly RiotCollectionLadderSource[]>;

export const riotCollectionStatusLabels = {
  aggregating: "Aggregating",
  cancelled: "Cancelled",
  completed: "Completed",
  "completed-partial": "Completed partially",
  "discovering-seeds": "Discovering seeds",
  failed: "Failed",
  paused: "Paused",
  queued: "Queued",
  scanning: "Scanning",
  "selecting-seeds": "Selecting seeds",
} as const satisfies Record<RiotCollectionStatus, string>;

export const riotCollectionStopReasonLabels = {
  "aggregation-failed": "Aggregation failed; review the child scan before continuing.",
  "api-budget-reached": "The configured Riot API budget was reached.",
  "cancelled-by-admin": "Cancelled by an administrator.",
  "discovery-disabled": "No eligible seeds remained and automatic discovery is disabled.",
  "discovery-exhausted": "Automatic discovery did not find more eligible seeds.",
  "error-budget-reached": "The collection stopped after too many errors.",
  "manual-pause": "Paused by an administrator.",
  "no-new-data": "The last batch did not add new target matches.",
  "no-ready-seeds": "No eligible seeds remain for this rank bracket.",
  "rate-limited": "Riot rate limit reached; resume later.",
  "runtime-limit-reached": "The runtime safety limit was reached.",
  "target-reached": "The target unique-match count was reached.",
} as const satisfies Record<RiotCollectionStopReason, string>;

export function isRiotCollectionTerminalStatus(status: RiotCollectionStatus) {
  return riotCollectionTerminalStatuses.includes(
    status as (typeof riotCollectionTerminalStatuses)[number],
  );
}

export function getRiotCollectionProgressPercent({
  targetUniqueMatches,
  uniqueMatchesProcessed,
}: {
  targetUniqueMatches: number;
  uniqueMatchesProcessed: number;
}) {
  if (targetUniqueMatches <= 0) {
    return 0;
  }

  return Math.min(Math.round((uniqueMatchesProcessed / targetUniqueMatches) * 100), 100);
}

export function normalizeCollectionScanSummary(summary: RiotScanSummary | null | undefined) {
  return {
    duplicates: Number(summary?.observationDuplicatesSkipped ?? 0),
    newObservations: Number(summary?.observationsInserted ?? 0),
    statRowsUpdated: Number(summary?.statsRowsUpdated ?? 0),
    uniqueMatchIds: Number(summary?.uniqueMatchIds ?? 0),
  };
}

export function getAdaptiveRiotCollectionSeedBatchSize({
  maxSeedBatchSize = defaultRiotCollectionSafetyLimits.maxSeedBatchSize,
  seedsUsed,
  targetUniqueMatches,
  uniqueMatchesProcessed,
}: {
  maxSeedBatchSize?: number;
  seedsUsed: number;
  targetUniqueMatches: number;
  uniqueMatchesProcessed: number;
}) {
  const remainingTargetMatches = Math.max(targetUniqueMatches - uniqueMatchesProcessed, 1);
  const observedMatchesPerSeed = seedsUsed > 0 ? uniqueMatchesProcessed / seedsUsed : 0;
  const estimatedMatchesPerSeed =
    Number.isFinite(observedMatchesPerSeed) && observedMatchesPerSeed > 0
      ? Math.min(Math.max(observedMatchesPerSeed, 1), 20)
      : 4;
  const adaptiveSize = Math.ceil(remainingTargetMatches / estimatedMatchesPerSeed);

  return Math.min(Math.max(adaptiveSize, 1), maxSeedBatchSize);
}

export function createEmptyRiotCollectionDiscoveryDiagnostics(
  invocation: RiotCollectionDiscoveryDiagnostics["invocation"] = null,
): RiotCollectionDiscoveryDiagnostics {
  return {
    api: {
      failures: 0,
      rateLimited: false,
      requestCount: 0,
      retryCount: 0,
    },
    candidates: {
      created: 0,
      enriched: 0,
      existingMatched: 0,
      persistenceFailures: 0,
      rankSnapshotFailures: 0,
      rankSnapshotsInserted: 0,
      reused: 0,
    },
    candidateIds: [],
    entriesFetched: 0,
    identifiers: {
      directPuuids: 0,
      failed: 0,
      lookupsAttempted: 0,
      missing: 0,
      resolved: 0,
    },
    invocation,
    lifecycle: {
      "cooling-down": 0,
      failed: 0,
      "low-signal": 0,
      "needs-rank-enrichment": 0,
      observed: 0,
      "ready-to-scan": 0,
      "recently-scanned": 0,
      rejected: 0,
      eligibleSeedsProduced: 0,
    },
    pagesFetched: 0,
    reasonCodes: [],
    sourcesAttempted: 0,
  };
}

export function getRiotCollectionDiscoveryStopDetail(
  diagnostics: RiotCollectionDiscoveryDiagnostics | null | undefined,
) {
  if (!diagnostics) {
    return "Discovery diagnostics are unavailable.";
  }

  if (diagnostics.api.rateLimited) {
    return "Discovery paused because the Riot API rate limit was reached.";
  }

  if (diagnostics.entriesFetched === 0) {
    return `Ladder discovery returned no entries from ${diagnostics.pagesFetched} requested ${diagnostics.pagesFetched === 1 ? "page" : "pages"}.`;
  }

  if (diagnostics.identifiers.resolved === 0) {
    return `${diagnostics.entriesFetched} ladder ${diagnostics.entriesFetched === 1 ? "player was" : "players were"} found, but no PUUIDs could be resolved.`;
  }

  if (diagnostics.candidates.created + diagnostics.candidates.reused === 0) {
    return `${diagnostics.identifiers.resolved} PUUIDs were resolved, but no seed candidates could be persisted.`;
  }

  if (diagnostics.lifecycle.eligibleSeedsProduced === 0) {
    return `${diagnostics.candidates.created} candidates were created and ${diagnostics.candidates.reused} existing candidates were refreshed, but none were eligible for the next scan.`;
  }

  return `${diagnostics.lifecycle.eligibleSeedsProduced} eligible ${diagnostics.lifecycle.eligibleSeedsProduced === 1 ? "seed was" : "seeds were"} produced, but seed selection still found no unused candidate.`;
}
