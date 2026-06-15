import { defaultPlatformRegion, normalizePlatformRegion } from "./riot-seed-candidates.mjs";
import {
  getRankSortWeight as getSharedRankSortWeight,
  normalizeRiotRankDivision,
  normalizeRiotRankTier,
} from "./riot-rank-brackets.mjs";

export const rankedSoloQueueType = "RANKED_SOLO_5x5";
export const rankRefreshCooldownHours = 24;
export const rankRefreshCooldownMs = rankRefreshCooldownHours * 60 * 60 * 1000;
export const maxAdminRankRefreshBatchSize = 20;
export const rankEnrichmentStatuses = [
  "pending",
  "queued",
  "running",
  "ranked",
  "unranked",
  "not_found",
  "rate_limited",
  "failed",
];

const rankCandidateSelect = [
  "id",
  "puuid",
  "platform_region",
  "rank_queue_type",
  "rank_tier",
  "rank_division",
  "rank_league_points",
  "rank_wins",
  "rank_losses",
  "rank_win_rate",
  "rank_hot_streak",
  "rank_veteran",
  "rank_fresh_blood",
  "rank_inactive",
  "ranked_at",
  "rank_last_attempted_at",
  "rank_last_success_at",
  "rank_next_eligible_at",
  "rank_enrichment_status",
  "rank_enrichment_error_code",
  "rank_enrichment_error_message",
  "rank_enrichment_attempts",
  "rank_enrichment_failures",
].join(", ");

export function calculateRankWinRate({ losses, wins }) {
  const normalizedWins = Number(wins ?? 0);
  const normalizedLosses = Number(losses ?? 0);
  const games = normalizedWins + normalizedLosses;

  if (!Number.isFinite(games) || games <= 0) {
    return null;
  }

  return Number((normalizedWins / games).toFixed(4));
}

export function normalizeRankTier(value) {
  return normalizeRiotRankTier(value);
}

export function normalizeRankDivision(value) {
  return normalizeRiotRankDivision(value);
}

export function selectRankedSoloDuoEntry(entries) {
  if (!Array.isArray(entries)) {
    return null;
  }

  return entries.find((entry) => entry?.queueType === rankedSoloQueueType) ?? null;
}

export function normalizeRankEntry(entry) {
  if (!entry) {
    return null;
  }

  const wins = toNullableInteger(entry.wins);
  const losses = toNullableInteger(entry.losses);

  return {
    division: normalizeRankDivision(entry.rank),
    freshBlood: toNullableBoolean(entry.freshBlood),
    hotStreak: toNullableBoolean(entry.hotStreak),
    inactive: toNullableBoolean(entry.inactive),
    leaguePoints: toNullableInteger(entry.leaguePoints),
    losses,
    queueType: String(entry.queueType ?? rankedSoloQueueType).trim() || rankedSoloQueueType,
    tier: normalizeRankTier(entry.tier),
    veteran: toNullableBoolean(entry.veteran),
    winRate: calculateRankWinRate({ losses, wins }),
    wins,
  };
}

export function isRankRefreshEligible(candidate, { force = false, now = new Date() } = {}) {
  if (force) {
    return true;
  }

  if (!candidate?.rank_next_eligible_at) {
    return true;
  }

  const nextEligibleAt = new Date(candidate.rank_next_eligible_at).getTime();

  return !Number.isFinite(nextEligibleAt) || nextEligibleAt <= now.getTime();
}

export function getRankSortWeight(candidate) {
  return getSharedRankSortWeight(candidate);
}

export function createRankSnapshotRow({ candidate, observedAt, rank, snapshotStatus }) {
  return {
    candidate_id: candidate.id,
    division: rank?.division ?? null,
    fresh_blood: rank?.freshBlood ?? null,
    hot_streak: rank?.hotStreak ?? null,
    inactive: rank?.inactive ?? null,
    league_points: rank?.leaguePoints ?? null,
    losses: rank?.losses ?? null,
    observed_at: observedAt,
    platform_region: normalizePlatformRegion(candidate.platform_region),
    queue_type: rank?.queueType ?? (snapshotStatus === "ranked" ? rankedSoloQueueType : null),
    snapshot_status: snapshotStatus,
    source: "riot_api",
    tier: rank?.tier ?? null,
    veteran: rank?.veteran ?? null,
    win_rate: rank?.winRate ?? null,
    wins: rank?.wins ?? null,
  };
}

export function areRankSnapshotsEquivalent(left, right) {
  if (!left || !right) {
    return false;
  }

  return [
    "division",
    "fresh_blood",
    "hot_streak",
    "inactive",
    "league_points",
    "losses",
    "platform_region",
    "queue_type",
    "snapshot_status",
    "tier",
    "veteran",
    "win_rate",
    "wins",
  ].every((field) => normalizeSnapshotValue(left[field]) === normalizeSnapshotValue(right[field]));
}

export async function enrichRiotSeedCandidateRank({
  candidateId,
  force = false,
  now = new Date(),
  repository,
  riot,
}) {
  const candidate = await repository.fetchCandidate(candidateId);

  if (!candidate) {
    return {
      candidateId,
      errorCode: "candidate_not_found",
      message: "Seed candidate was not found.",
      ok: false,
      snapshotInserted: false,
      status: "failed",
    };
  }

  if (!isRankRefreshEligible(candidate, { force, now })) {
    return {
      candidate,
      candidateId: candidate.id,
      ok: true,
      skipped: true,
      snapshotInserted: false,
      status: candidate.rank_enrichment_status ?? "pending",
    };
  }

  const attemptedAt = now.toISOString();
  const nextEligibleAt = new Date(now.getTime() + rankRefreshCooldownMs).toISOString();
  await repository.markCandidateRankRunning(candidate, attemptedAt);

  try {
    const entries = await riot.fetchLeagueEntriesByPuuid({
      platformRegion: candidate.platform_region,
      puuid: candidate.puuid,
    });
    const rank = normalizeRankEntry(selectRankedSoloDuoEntry(entries));
    const status = rank ? "ranked" : "unranked";
    const snapshot = createRankSnapshotRow({
      candidate,
      observedAt: attemptedAt,
      rank,
      snapshotStatus: status,
    });
    const snapshotInserted = await insertSnapshotIfChanged(repository, snapshot);
    await repository.markCandidateRankResult(candidate, {
      errorCode: null,
      errorMessage: null,
      nextEligibleAt,
      rank,
      status,
      succeededAt: attemptedAt,
    });

    return {
      candidate,
      candidateId: candidate.id,
      ok: true,
      rank,
      snapshotInserted,
      status,
    };
  } catch (error) {
    const mappedError = mapRiotRankError(error);
    const snapshot =
      mappedError.status === "not_found"
        ? createRankSnapshotRow({
            candidate,
            observedAt: attemptedAt,
            rank: null,
            snapshotStatus: "not_found",
          })
        : null;
    const snapshotInserted = snapshot ? await insertSnapshotIfChanged(repository, snapshot) : false;

    await repository.markCandidateRankFailure(candidate, {
      errorCode: mappedError.code,
      errorMessage: mappedError.message,
      nextEligibleAt,
      status: mappedError.status,
    });

    return {
      candidate,
      candidateId: candidate.id,
      errorCode: mappedError.code,
      message: mappedError.message,
      ok: mappedError.status === "not_found",
      snapshotInserted,
      status: mappedError.status,
    };
  }
}

export async function enrichRiotSeedCandidateRanks({
  candidateIds = null,
  force = false,
  limit = 20,
  platformRegion = null,
  puuid = null,
  repository,
  riot,
  status = null,
}) {
  const candidates =
    candidateIds && candidateIds.length > 0
      ? await repository.fetchCandidatesByIds(candidateIds)
      : await repository.fetchCandidates({
          limit,
          platformRegion,
          puuid,
          status,
        });
  const results = [];

  for (const candidate of candidates.slice(0, Math.max(1, limit))) {
    results.push(
      await enrichRiotSeedCandidateRank({
        candidateId: candidate.id,
        force,
        repository,
        riot,
      }),
    );
  }

  return summarizeRankEnrichmentResults(results);
}

export function summarizeRankEnrichmentResults(results) {
  return {
    failedCount: results.filter((result) => !result.ok && !result.skipped).length,
    notFoundCount: results.filter((result) => result.status === "not_found").length,
    ok: true,
    rankedCount: results.filter((result) => result.status === "ranked").length,
    rateLimitedCount: results.filter((result) => result.status === "rate_limited").length,
    results,
    skippedCount: results.filter((result) => result.skipped).length,
    snapshotInsertedCount: results.filter((result) => result.snapshotInserted).length,
    total: results.length,
    unrankedCount: results.filter((result) => result.status === "unranked").length,
  };
}

export function createSupabaseRankRepository(supabase) {
  return {
    async fetchCandidate(candidateId) {
      const { data, error } = await supabase
        .from("riot_seed_candidates")
        .select(rankCandidateSelect)
        .eq("id", candidateId)
        .maybeSingle();

      if (error) {
        throw new Error(`Seed candidate rank lookup failed: ${error.message}`);
      }

      return data ?? null;
    },

    async fetchCandidates({ limit = 20, platformRegion = null, puuid = null, status = null } = {}) {
      let query = supabase
        .from("riot_seed_candidates")
        .select(rankCandidateSelect)
        .order("rank_last_attempted_at", { ascending: true, nullsFirst: true })
        .limit(Math.min(Math.max(limit, 1), 100));

      if (platformRegion) {
        query = query.eq("platform_region", normalizePlatformRegion(platformRegion));
      }

      if (puuid) {
        query = query.eq("puuid", puuid);
      }

      if (status && status !== "all") {
        query = query.eq("rank_enrichment_status", status);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Seed candidate rank batch lookup failed: ${error.message}`);
      }

      return data ?? [];
    },

    async fetchCandidatesByIds(candidateIds) {
      const uniqueIds = uniqueValues(candidateIds);

      if (uniqueIds.length === 0) {
        return [];
      }

      const { data, error } = await supabase
        .from("riot_seed_candidates")
        .select(rankCandidateSelect)
        .in("id", uniqueIds);

      if (error) {
        throw new Error(`Seed candidate rank selection lookup failed: ${error.message}`);
      }

      const candidatesById = new Map((data ?? []).map((candidate) => [candidate.id, candidate]));

      return uniqueIds.map((candidateId) => candidatesById.get(candidateId)).filter(Boolean);
    },

    async fetchLatestSnapshot(candidateId) {
      const { data, error } = await supabase
        .from("riot_seed_candidate_rank_snapshots")
        .select(
          [
            "division",
            "fresh_blood",
            "hot_streak",
            "inactive",
            "league_points",
            "losses",
            "platform_region",
            "queue_type",
            "snapshot_status",
            "tier",
            "veteran",
            "win_rate",
            "wins",
          ].join(", "),
        )
        .eq("candidate_id", candidateId)
        .order("observed_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        throw new Error(`Seed candidate rank snapshot lookup failed: ${error.message}`);
      }

      return data ?? null;
    },

    async insertSnapshot(snapshot) {
      const { error } = await supabase.from("riot_seed_candidate_rank_snapshots").insert(snapshot);

      if (error && error.code !== "23505") {
        throw new Error(`Seed candidate rank snapshot insert failed: ${error.message}`);
      }
    },

    async markCandidateRankFailure(candidate, patch) {
      const { error } = await supabase
        .from("riot_seed_candidates")
        .update({
          rank_enrichment_error_code: patch.errorCode,
          rank_enrichment_error_message: patch.errorMessage,
          rank_enrichment_failures: Number(candidate.rank_enrichment_failures ?? 0) + 1,
          rank_enrichment_status: patch.status,
          rank_next_eligible_at: patch.nextEligibleAt,
        })
        .eq("id", candidate.id);

      if (error) {
        throw new Error(`Seed candidate rank failure update failed: ${error.message}`);
      }
    },

    async markCandidateRankResult(candidate, patch) {
      const rank = patch.rank;
      const { error } = await supabase
        .from("riot_seed_candidates")
        .update({
          rank_division: rank?.division ?? null,
          rank_enrichment_error_code: patch.errorCode,
          rank_enrichment_error_message: patch.errorMessage,
          rank_enrichment_status: patch.status,
          rank_fresh_blood: rank?.freshBlood ?? null,
          rank_hot_streak: rank?.hotStreak ?? null,
          rank_inactive: rank?.inactive ?? null,
          rank_last_success_at: patch.succeededAt,
          rank_league_points: rank?.leaguePoints ?? null,
          rank_losses: rank?.losses ?? null,
          rank_next_eligible_at: patch.nextEligibleAt,
          rank_queue_type: rank?.queueType ?? null,
          rank_tier: rank?.tier ?? null,
          rank_veteran: rank?.veteran ?? null,
          rank_win_rate: rank?.winRate ?? null,
          rank_wins: rank?.wins ?? null,
          ranked_at: patch.status === "ranked" ? patch.succeededAt : null,
        })
        .eq("id", candidate.id);

      if (error) {
        throw new Error(`Seed candidate rank result update failed: ${error.message}`);
      }
    },

    async markCandidateRankRunning(candidate, attemptedAt) {
      const { error } = await supabase
        .from("riot_seed_candidates")
        .update({
          rank_enrichment_attempts: Number(candidate.rank_enrichment_attempts ?? 0) + 1,
          rank_enrichment_status: "running",
          rank_last_attempted_at: attemptedAt,
        })
        .eq("id", candidate.id);

      if (error) {
        throw new Error(`Seed candidate rank running update failed: ${error.message}`);
      }
    },
  };
}

export function mapRiotRankError(error) {
  const status = Number(error?.status ?? 0);
  const message = error instanceof Error ? error.message : "Riot rank enrichment failed.";

  if (status === 404) {
    return {
      code: "riot_not_found",
      message: "Riot account rank metadata was not found.",
      status: "not_found",
    };
  }

  if (status === 429) {
    return {
      code: "riot_rate_limited",
      message: "Riot rank enrichment was rate limited.",
      status: "rate_limited",
    };
  }

  if (status === 401 || status === 403) {
    return {
      code: "riot_auth_failed",
      message: "Riot API authentication failed.",
      status: "failed",
    };
  }

  if ([408, 500, 502, 503, 504].includes(status)) {
    return {
      code: "riot_transient_failure",
      message: `Riot rank endpoint failed with status ${status}.`,
      status: "failed",
    };
  }

  if (message.toLowerCase().includes("fetch") || message.toLowerCase().includes("timeout")) {
    return {
      code: "network_error",
      message: "Network failure while contacting Riot rank endpoint.",
      status: "failed",
    };
  }

  return {
    code: status ? `riot_${status}` : "rank_enrichment_failed",
    message,
    status: "failed",
  };
}

async function insertSnapshotIfChanged(repository, snapshot) {
  const latestSnapshot = await repository.fetchLatestSnapshot(snapshot.candidate_id);

  if (areRankSnapshotsEquivalent(latestSnapshot, snapshot)) {
    return false;
  }

  await repository.insertSnapshot(snapshot);
  return true;
}

function toNullableInteger(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return null;
  }

  return Math.trunc(number);
}

function toNullableBoolean(value) {
  return typeof value === "boolean" ? value : null;
}

function normalizeSnapshotValue(value) {
  if (typeof value === "number") {
    return Number(value.toFixed(4));
  }

  if (typeof value === "string") {
    return value.trim().toUpperCase();
  }

  return value ?? null;
}

function uniqueValues(values) {
  return Array.from(new Set((values ?? []).map((value) => String(value).trim()).filter(Boolean)));
}

export function getDefaultRankPlatformRegion() {
  return process.env.RIOT_PLATFORM_REGION ?? defaultPlatformRegion;
}
