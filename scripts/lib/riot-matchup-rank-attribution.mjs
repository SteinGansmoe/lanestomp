import {
  getRankBracketFromRank,
  getRankBracketFromScore,
  getRankScore,
  isCounterPickRankBracket,
  isMatchupRankAttributionMethod,
  MAX_RANK_SNAPSHOT_DISTANCE_MS,
} from "./riot-rank-brackets.mjs";

const CANDIDATE_PUUID_LOOKUP_CHUNK_SIZE = 25;
const RANK_SNAPSHOT_LOOKUP_CHUNK_SIZE = 100;

const observationSelect = [
  "id",
  "match_id",
  "patch",
  "role",
  "champion_a",
  "champion_a_puuid",
  "champion_b",
  "champion_b_puuid",
  "game_start_at",
  "rank_attributed_at",
].join(", ");

const rankSnapshotSelect = [
  "id",
  "candidate_id",
  "division",
  "observed_at",
  "snapshot_status",
  "tier",
].join(", ");

export function createEmptyMatchupRankAttributionSummary() {
  return {
    alreadyAttributed: 0,
    failures: 0,
    participantsNotFound: 0,
    processed: 0,
    singlePlayer: 0,
    snapshotTooOld: 0,
    total: 0,
    twoPlayerAverage: 0,
    unknown: 0,
  };
}

export async function attributeStoredMatchupRankBrackets({
  filters = {},
  force = false,
  limit = 500,
  repository,
}) {
  const observations = await repository.fetchMatchupObservations({
    filters,
    limit,
  });

  return attributeMatchupRankBrackets({
    force,
    observations,
    repository,
  });
}

export async function attributeMatchupRankBrackets({
  force = false,
  observations,
  repository,
}) {
  const summary = createEmptyMatchupRankAttributionSummary();
  const rows = observations ?? [];
  summary.total = rows.length;

  if (rows.length === 0) {
    return {
      results: [],
      summary,
    };
  }

  const snapshotsByPuuid = await repository.fetchRankSnapshotsByPuuid(
    getObservationPuuids(rows),
  );
  const results = [];

  for (const observation of rows) {
    if (!force && observation.rank_attributed_at) {
      summary.alreadyAttributed += 1;
      continue;
    }

    try {
      const result = attributeMatchupObservation({
        observation,
        snapshotsByPuuid,
      });

      await repository.persistMatchupRankAttribution(observation.id, result.patch);
      summary.processed += 1;

      if (result.rankBracket === "unknown") {
        summary.unknown += 1;
      }

      if (result.method === "two-player-average") {
        summary.twoPlayerAverage += 1;
      } else if (result.method === "single-player") {
        summary.singlePlayer += 1;
      }

      summary.participantsNotFound += result.metrics.participantsNotFound;
      summary.snapshotTooOld += result.metrics.snapshotTooOld;
      results.push({
        matchId: observation.match_id,
        method: result.method,
        rankBracket: result.rankBracket,
        role: observation.role,
      });
    } catch (error) {
      summary.failures += 1;
      try {
        await repository.persistMatchupRankAttribution(observation.id, getUnknownAttributionPatch());
      } catch (fallbackError) {
        console.error("Fallback unknown rank attribution update failed", {
          error: fallbackError instanceof Error ? fallbackError.message : "Unknown error",
          matchId: observation.match_id,
          role: observation.role,
        });
      }
      console.error("Matchup rank attribution failed", {
        error: error instanceof Error ? error.message : "Unknown error",
        matchId: observation.match_id,
        role: observation.role,
      });
    }
  }

  return {
    results,
    summary,
  };
}

export function attributeMatchupObservation({ observation, snapshotsByPuuid }) {
  const championA = resolveParticipantRank({
    gameStartAt: observation.game_start_at,
    puuid: observation.champion_a_puuid,
    snapshotsByPuuid,
  });
  const championB = resolveParticipantRank({
    gameStartAt: observation.game_start_at,
    puuid: observation.champion_b_puuid,
    snapshotsByPuuid,
  });
  const participantRanks = [championA.rank, championB.rank].filter(Boolean);
  const metrics = {
    participantsNotFound:
      Number(championA.reason === "participant-not-found") +
      Number(championB.reason === "participant-not-found"),
    snapshotTooOld:
      Number(championA.reason === "snapshot-too-old") +
      Number(championB.reason === "snapshot-too-old"),
  };

  if (participantRanks.length === 2) {
    const averageRankScore = Number(
      ((championA.rank.score + championB.rank.score) / 2).toFixed(4),
    );
    const rankBracket = getRankBracketFromScore(averageRankScore);

    return {
      averageRankScore,
      championARank: championA.rank,
      championBRank: championB.rank,
      method: "two-player-average",
      metrics,
      patch: getAttributionPatch({
        averageRankScore,
        championARank: championA.rank,
        championBRank: championB.rank,
        method: "two-player-average",
        rankBracket,
      }),
      rankBracket,
    };
  }

  if (participantRanks.length === 1) {
    const rank = participantRanks[0];
    const rankBracket = getRankBracketFromRank(rank);

    return {
      averageRankScore: null,
      championARank: championA.rank,
      championBRank: championB.rank,
      method: "single-player",
      metrics,
      patch: getAttributionPatch({
        averageRankScore: null,
        championARank: championA.rank,
        championBRank: championB.rank,
        method: "single-player",
        rankBracket,
      }),
      rankBracket,
    };
  }

  return {
    averageRankScore: null,
    championARank: null,
    championBRank: null,
    method: "unknown",
    metrics,
    patch: getUnknownAttributionPatch(),
    rankBracket: "unknown",
  };
}

export function resolveParticipantRank({ gameStartAt, puuid, snapshotsByPuuid }) {
  const normalizedPuuid = String(puuid ?? "").trim();

  if (!normalizedPuuid) {
    return {
      rank: null,
      reason: "participant-not-found",
    };
  }

  const snapshots = snapshotsByPuuid.get(normalizedPuuid) ?? [];

  if (snapshots.length === 0) {
    return {
      rank: null,
      reason: "participant-not-found",
    };
  }

  const gameStartMs = new Date(gameStartAt).getTime();

  if (!Number.isFinite(gameStartMs)) {
    return {
      rank: null,
      reason: "snapshot-too-old",
    };
  }

  const rankedSnapshots = snapshots
    .map((snapshot) => toUsableRankSnapshot(snapshot, gameStartMs))
    .filter(Boolean)
    .sort((left, right) => left.snapshotDistanceMs - right.snapshotDistanceMs);
  const closestSnapshot = rankedSnapshots[0] ?? null;

  if (!closestSnapshot) {
    return {
      rank: null,
      reason: "participant-not-found",
    };
  }

  if (closestSnapshot.snapshotDistanceMs > MAX_RANK_SNAPSHOT_DISTANCE_MS) {
    return {
      rank: null,
      reason: "snapshot-too-old",
    };
  }

  return {
    rank: {
      division: closestSnapshot.division,
      score: closestSnapshot.score,
      snapshotDistanceSeconds: Math.round(closestSnapshot.snapshotDistanceMs / 1000),
      snapshotId: closestSnapshot.id,
      tier: closestSnapshot.tier,
    },
    reason: "ranked",
  };
}

export function createSupabaseMatchupRankAttributionRepository(supabase) {
  return {
    async fetchMatchupObservations({ filters = {}, limit = 500 } = {}) {
      let query = supabase
        .from("riot_matchup_observations")
        .select(observationSelect)
        .order("rank_attributed_at", { ascending: true, nullsFirst: true })
        .order("created_at", { ascending: true })
        .limit(Math.min(Math.max(Number(limit) || 500, 1), 5000));

      if (filters.patch) {
        query = query.eq("patch", filters.patch);
      }

      if (filters.role) {
        query = query.eq("role", filters.role);
      }

      if (filters.matchId) {
        query = query.eq("match_id", filters.matchId);
      }

      if (filters.champion) {
        query = query.or(`champion_a.eq.${filters.champion},champion_b.eq.${filters.champion}`);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Matchup observation rank attribution query failed: ${error.message}`);
      }

      return data ?? [];
    },

    async fetchRankSnapshotsByPuuid(puuids) {
      const uniquePuuids = Array.from(
        new Set((puuids ?? []).map((puuid) => String(puuid).trim()).filter(Boolean)),
      );
      const snapshotsByPuuid = new Map(uniquePuuids.map((puuid) => [puuid, []]));

      if (uniquePuuids.length === 0) {
        return snapshotsByPuuid;
      }

      const candidateRows = [];

      for (const puuidChunk of chunkArray(uniquePuuids, CANDIDATE_PUUID_LOOKUP_CHUNK_SIZE)) {
  let candidates;
  let candidateError;

  try {
    const result = await supabase
      .from("riot_seed_candidates")
      .select("id, puuid")
      .in("puuid", puuidChunk);

    candidates = result.data;
    candidateError = result.error;
  } catch (fetchError) {
    console.error("Seed candidate lookup fetch threw", {
      name: fetchError?.name ?? null,
      message: fetchError?.message ?? null,
      cause: fetchError?.cause ?? null,
      causeCode: fetchError?.cause?.code ?? null,
      causeErrno: fetchError?.cause?.errno ?? null,
      causeSyscall: fetchError?.cause?.syscall ?? null,
      causeHostname: fetchError?.cause?.hostname ?? null,
    });

    throw fetchError;
  }

  if (candidateError) {
    console.error("Seed candidate lookup query failed", {
      code: candidateError.code ?? null,
      message: candidateError.message ?? null,
      details: candidateError.details ?? null,
      hint: candidateError.hint ?? null,
    });

    throw new Error(
      `Seed candidate rank attribution lookup failed: ${candidateError.message}`,
    );
  }

  candidateRows.push(...(candidates ?? []));
}

      if (candidateRows.length === 0) {
        return snapshotsByPuuid;
      }

      const puuidByCandidateId = new Map(
        candidateRows.map((candidate) => [candidate.id, candidate.puuid]),
      );
      const snapshots = [];

      for (const candidateIdChunk of chunkArray(Array.from(puuidByCandidateId.keys()), RANK_SNAPSHOT_LOOKUP_CHUNK_SIZE)) {
        const { data, error: snapshotError } = await supabase
          .from("riot_seed_candidate_rank_snapshots")
          .select(rankSnapshotSelect)
          .in("candidate_id", candidateIdChunk)
          .eq("snapshot_status", "ranked");

        if (snapshotError) {
          throw new Error(`Rank snapshot attribution lookup failed: ${snapshotError.message}`);
        }

        snapshots.push(...(data ?? []));
      }

      for (const snapshot of snapshots) {
        const puuid = puuidByCandidateId.get(snapshot.candidate_id);

        if (!puuid) {
          continue;
        }

        const rows = snapshotsByPuuid.get(puuid) ?? [];
        rows.push(snapshot);
        snapshotsByPuuid.set(puuid, rows);
      }

      return snapshotsByPuuid;
    },

    async persistMatchupRankAttribution(observationId, patch) {
      const { error } = await supabase
        .from("riot_matchup_observations")
        .update(patch)
        .eq("id", observationId);

      if (error) {
        throw new Error(`Matchup rank attribution update failed: ${error.message}`);
      }
    },
  };
}

function toUsableRankSnapshot(snapshot, gameStartMs) {
  const score = getRankScore({
    division: snapshot.division,
    tier: snapshot.tier,
  });
  const observedMs = new Date(snapshot.observed_at).getTime();

  if (score === null || !Number.isFinite(observedMs)) {
    return null;
  }

  return {
    division: snapshot.division,
    id: snapshot.id,
    observedAt: snapshot.observed_at,
    score,
    snapshotDistanceMs: Math.abs(observedMs - gameStartMs),
    tier: snapshot.tier,
  };
}

function getAttributionPatch({
  averageRankScore,
  championARank,
  championBRank,
  method,
  rankBracket,
}) {
  return {
    average_rank_score: averageRankScore,
    champion_a_rank_division: championARank?.division ?? null,
    champion_a_rank_score: championARank?.score ?? null,
    champion_a_rank_snapshot_id: championARank?.snapshotId ?? null,
    champion_a_rank_tier: championARank?.tier ?? null,
    champion_b_rank_division: championBRank?.division ?? null,
    champion_b_rank_score: championBRank?.score ?? null,
    champion_b_rank_snapshot_id: championBRank?.snapshotId ?? null,
    champion_b_rank_tier: championBRank?.tier ?? null,
    rank_attributed_at: new Date().toISOString(),
    rank_attribution_method: isMatchupRankAttributionMethod(method) ? method : "unknown",
    rank_bracket: isCounterPickRankBracket(rankBracket) ? rankBracket : "unknown",
    rank_snapshot_distance_seconds_a: championARank?.snapshotDistanceSeconds ?? null,
    rank_snapshot_distance_seconds_b: championBRank?.snapshotDistanceSeconds ?? null,
  };
}

function getUnknownAttributionPatch() {
  return getAttributionPatch({
    averageRankScore: null,
    championARank: null,
    championBRank: null,
    method: "unknown",
    rankBracket: "unknown",
  });
}

function getObservationPuuids(observations) {
  const puuids = [];

  for (const observation of observations ?? []) {
    puuids.push(observation.champion_a_puuid, observation.champion_b_puuid);
  }

  return puuids;
}

function chunkArray(values, size) {
  const chunks = [];

  for (let index = 0; index < values.length; index += size) {
    chunks.push(values.slice(index, index + size));
  }

  return chunks;
}
