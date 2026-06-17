import type { LeagueRole } from "./roles";
import type { RiotScanJobView, RiotScanSummary } from "./riot-scan-jobs";
import type { SeedCandidateRankBracket } from "./riot-seed-candidate-lifecycle";

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
      divisions: readonly ["I", "II", "III", "IV"];
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

const standardDivisions = ["I", "II", "III", "IV"] as const;

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
