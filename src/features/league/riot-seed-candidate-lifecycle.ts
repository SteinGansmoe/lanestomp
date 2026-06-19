import type { RiotSeedCandidateView } from "./riot-scan-jobs";

export const MIN_SEED_OBSERVATIONS = 2;
export const DEFAULT_SEED_SCAN_COOLDOWN_DAYS = 7;
export const RECENTLY_SCANNED_WINDOW_HOURS = 48;
export const MAX_CONSECUTIVE_SCAN_FAILURES = 3;
export const RANK_SNAPSHOT_STALE_DAYS = 30;

export type SeedCandidateLifecycleState =
  | "cooling-down"
  | "failed"
  | "low-signal"
  | "needs-rank-enrichment"
  | "observed"
  | "ready-to-scan"
  | "recently-scanned"
  | "rejected";

export type SeedCandidateLifecycleReasonCode =
  | "consecutive-failures"
  | "cooldown-active"
  | "manual-rejection"
  | "missing-rank"
  | "rank-refresh-failed"
  | "ready"
  | "recently-scanned"
  | "retry-backoff"
  | "scan-running"
  | "stale-rank"
  | "too-few-observations"
  | "unsupported-rank-bracket";

export type SeedCandidateRankBracket =
  | "diamond"
  | "gold-emerald"
  | "iron-silver"
  | "master-plus"
  | "unknown";

export type SeedCandidateLifecycle = {
  isSelectableForScan: boolean;
  lastScannedAt: string | null;
  nextEligibleAt: string | null;
  rankBracket: SeedCandidateRankBracket;
  reasonCodes: SeedCandidateLifecycleReasonCode[];
  state: SeedCandidateLifecycleState;
};

export type SeedCandidateLifecycleContext = {
  now?: Date | string;
};

export const seedCandidateLifecycleStates = [
  "ready-to-scan",
  "recently-scanned",
  "cooling-down",
  "needs-rank-enrichment",
  "failed",
  "low-signal",
  "observed",
  "rejected",
] as const satisfies readonly SeedCandidateLifecycleState[];

export const seedCandidateLifecycleLabels = {
  "cooling-down": "Cooling down",
  failed: "Failed",
  "low-signal": "Low signal",
  "needs-rank-enrichment": "Needs rank enrichment",
  observed: "Observed",
  "ready-to-scan": "Ready to scan",
  "recently-scanned": "Recently scanned",
  rejected: "Rejected",
} as const satisfies Record<SeedCandidateLifecycleState, string>;

export const seedCandidateLifecycleReasonLabels = {
  "consecutive-failures": "Maximum consecutive failures reached",
  "cooldown-active": "Scan cooldown is active",
  "manual-rejection": "Manually rejected",
  "missing-rank": "Rank enrichment required",
  "rank-refresh-failed": "Rank refresh failed",
  ready: "Ready",
  "recently-scanned": "Scanned inside the recent window",
  "retry-backoff": "Retry backoff is active",
  "scan-running": "Already queued or running",
  "stale-rank": "Rank snapshot is stale",
  "too-few-observations": "Too few observations",
  "unsupported-rank-bracket": "Rank bracket is not scan eligible",
} as const satisfies Record<SeedCandidateLifecycleReasonCode, string>;

const rankBracketByTier = new Map<string, SeedCandidateRankBracket>([
  ["CHALLENGER", "master-plus"],
  ["GRANDMASTER", "master-plus"],
  ["MASTER", "master-plus"],
  ["DIAMOND", "diamond"],
  ["EMERALD", "gold-emerald"],
  ["PLATINUM", "gold-emerald"],
  ["GOLD", "gold-emerald"],
  ["SILVER", "iron-silver"],
  ["BRONZE", "iron-silver"],
  ["IRON", "iron-silver"],
]);

export function deriveSeedCandidateLifecycle(
  candidate: Pick<
    RiotSeedCandidateView,
    | "consecutive_scan_failures"
    | "last_scanned_at"
    | "last_successful_scan_at"
    | "manually_rejected_at"
    | "next_eligible_scan_at"
    | "next_retry_at"
    | "observed_games"
    | "rank_enrichment_status"
    | "rank_last_success_at"
    | "rank_next_eligible_at"
    | "rank_tier"
    | "source"
    | "status"
  >,
  context: SeedCandidateLifecycleContext = {},
): SeedCandidateLifecycle {
  const now = normalizeNow(context.now);
  const rankBracket = getSeedCandidateRankBracket(candidate);
  const reasonCodes: SeedCandidateLifecycleReasonCode[] = [];
  const lastScannedAt = candidate.last_successful_scan_at ?? candidate.last_scanned_at ?? null;
  const nextEligibleAt = candidate.next_retry_at ?? candidate.next_eligible_scan_at ?? null;
  const isRunning = candidate.status === "active" || candidate.status === "queued";
  const hasEnoughSignal = Number(candidate.observed_games ?? 0) >= MIN_SEED_OBSERVATIONS;
  const isProvisionalLadderSeed = candidate.source === "ladder_import";
  const hasUsableRank = candidate.rank_enrichment_status === "ranked" && rankBracket !== "unknown";
  const rankIsStale =
    hasUsableRank && isOlderThanDays(candidate.rank_last_success_at, now, RANK_SNAPSHOT_STALE_DAYS);
  const recentlyScanned = isWithinHours(
    candidate.last_successful_scan_at,
    now,
    RECENTLY_SCANNED_WINDOW_HOURS,
  );
  const cooldownActive = isFuture(candidate.next_eligible_scan_at, now);
  const retryBackoffActive = isFuture(candidate.next_retry_at, now);
  const exceededFailureThreshold =
    Number(candidate.consecutive_scan_failures ?? 0) >= MAX_CONSECUTIVE_SCAN_FAILURES;

  if (isRunning) {
    reasonCodes.push("scan-running");
  }

  if (candidate.manually_rejected_at) {
    reasonCodes.push("manual-rejection");
    return lifecycle("rejected", false);
  }

  if (exceededFailureThreshold || candidate.status === "failed") {
    reasonCodes.push("consecutive-failures");

    if (retryBackoffActive) {
      reasonCodes.push("retry-backoff");
    }

    return lifecycle("failed", false);
  }

  if (!hasEnoughSignal && !isProvisionalLadderSeed) {
    reasonCodes.push("too-few-observations");
    return lifecycle("low-signal", false);
  }

  if (recentlyScanned) {
    reasonCodes.push("recently-scanned");
    return lifecycle("recently-scanned", false);
  }

  if (cooldownActive) {
    reasonCodes.push("cooldown-active");
    return lifecycle("cooling-down", false);
  }

  if (retryBackoffActive) {
    reasonCodes.push("retry-backoff");
    return lifecycle("failed", false);
  }

  if (!hasUsableRank || candidate.rank_enrichment_status === "failed") {
    reasonCodes.push(
      candidate.rank_enrichment_status === "failed" ? "rank-refresh-failed" : "missing-rank",
    );
    return lifecycle("needs-rank-enrichment", false);
  }

  if (rankIsStale) {
    reasonCodes.push("stale-rank");
    return lifecycle("needs-rank-enrichment", false);
  }

  if (!hasEnoughSignal) {
    reasonCodes.push("too-few-observations");
  }

  reasonCodes.push("ready");
  return lifecycle("ready-to-scan", !isRunning);

  function lifecycle(
    state: SeedCandidateLifecycleState,
    isSelectableForScan: boolean,
  ): SeedCandidateLifecycle {
    return {
      isSelectableForScan,
      lastScannedAt,
      nextEligibleAt,
      rankBracket,
      reasonCodes,
      state,
    };
  }
}

export function getSeedCandidateRankBracket(
  candidate: Pick<RiotSeedCandidateView, "rank_enrichment_status" | "rank_tier">,
): SeedCandidateRankBracket {
  if (candidate.rank_enrichment_status !== "ranked") {
    return "unknown";
  }

  const tier = String(candidate.rank_tier ?? "")
    .trim()
    .toUpperCase();

  return rankBracketByTier.get(tier) ?? "unknown";
}

export function getSeedScanCooldownEligibleAt(
  scannedAt: Date | string,
  cooldownDays = DEFAULT_SEED_SCAN_COOLDOWN_DAYS,
) {
  const date = typeof scannedAt === "string" ? new Date(scannedAt) : scannedAt;

  return new Date(date.getTime() + cooldownDays * 24 * 60 * 60 * 1000).toISOString();
}

export function getSeedScanRetryEligibleAt(failedAt: Date | string, consecutiveFailures: number) {
  const date = typeof failedAt === "string" ? new Date(failedAt) : failedAt;
  const hours = consecutiveFailures <= 1 ? 1 : consecutiveFailures === 2 ? 6 : 24;

  return new Date(date.getTime() + hours * 60 * 60 * 1000).toISOString();
}

function isWithinHours(value: string | null | undefined, now: Date, hours: number) {
  const timestamp = getTimestamp(value);

  return timestamp !== null && now.getTime() - timestamp < hours * 60 * 60 * 1000;
}

function isOlderThanDays(value: string | null | undefined, now: Date, days: number) {
  const timestamp = getTimestamp(value);

  return timestamp !== null && now.getTime() - timestamp > days * 24 * 60 * 60 * 1000;
}

function isFuture(value: string | null | undefined, now: Date) {
  const timestamp = getTimestamp(value);

  return timestamp !== null && timestamp > now.getTime();
}

function getTimestamp(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const timestamp = new Date(value).getTime();

  return Number.isFinite(timestamp) ? timestamp : null;
}

function normalizeNow(value: Date | string | undefined) {
  if (value instanceof Date) {
    return value;
  }

  if (value) {
    const parsed = new Date(value);

    if (Number.isFinite(parsed.getTime())) {
      return parsed;
    }
  }

  return new Date();
}
