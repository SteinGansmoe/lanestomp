import { calculateTier, calculateWinRate } from "./riot-counter-pick-scanner.mjs";
import {
  attributeMatchupRankBrackets,
  createEmptyMatchupRankAttributionSummary,
  createSupabaseMatchupRankAttributionRepository,
} from "./riot-matchup-rank-attribution.mjs";
import { getCounterPickAggregateRankBrackets } from "./riot-rank-brackets.mjs";
import { writeResilientBatches } from "./riot-batch-isolation.mjs";
import {
  createObservationValidationContext,
  logValidationFailures,
  partitionValidatedRows,
  summarizeValidationFailures,
  validateCounterPickAggregate,
  validateMatchupObservation,
} from "./riot-observation-validation.mjs";

const observationConflictTarget = "match_id,role";

export async function persistObservationsAndRebuildStats({
  championRegistry = null,
  observations,
  scanJobId = null,
  supabase,
  validationContext = null,
}) {
  const baseValidationContext =
    validationContext ?? createObservationValidationContext({ championRegistry });
  const uniqueObservations = dedupeObservations(observations ?? []).map((observation) => ({
    ...observation,
    scan_job_id: scanJobId,
  }));
  const validationPartition = partitionValidatedRows(
    uniqueObservations,
    validateMatchupObservation,
    baseValidationContext,
  );
  const validObservations = validationPartition.valid;
  const validationSummary = summarizeValidationFailures(validationPartition.invalid);

  logValidationFailures(
    "Riot matchup observation validation rejected rows",
    validationPartition.invalid,
  );

  if (uniqueObservations.length === 0) {
    return {
      affectedGroups: [],
      duplicateObservationsSkipped: 0,
      insertedObservations: 0,
      insertFailures: 0,
      matchupObservationBatchAttempts: 0,
      matchupObservationSuccessfulBatches: 0,
      matchupObservationFailedBatchAttempts: 0,
      matchupObservationBatchSplits: 0,
      matchupObservationTransientRetries: 0,
      matchupObservationIsolatedFailures: 0,
      matchupObservationUnresolvedBatchFailures: 0,
      matchupObservationPersistenceFailureSamples: [],
      matchupObservationPersistenceErrorGroups: [],
      matchupObservationValidationFailures: 0,
      matchupObservationValidationSummary: validationSummary,
      matchupObservationsRejected: 0,
      matchupObservationsValidated: 0,
      observationsFound: 0,
      counterPickAggregateValidationFailures: 0,
      counterPickAggregateValidationSummary: summarizeValidationFailures([]),
      counterPickAggregatesValidated: 0,
      counterPickAggregateInsertFailures: 0,
      counterPickAggregateBatchAttempts: 0,
      counterPickAggregateSuccessfulBatches: 0,
      counterPickAggregateFailedBatchAttempts: 0,
      counterPickAggregateBatchSplits: 0,
      counterPickAggregateTransientRetries: 0,
      counterPickAggregateIsolatedFailures: 0,
      counterPickAggregateUnresolvedBatchFailures: 0,
      counterPickAggregatePersistenceFailureSamples: [],
      counterPickAggregatePersistenceErrorGroups: [],
      matchupRankAttributionsAttempted: 0,
      matchupRankAttributionsTwoPlayer: 0,
      matchupRankAttributionsSinglePlayer: 0,
      matchupRankAttributionsUnknown: 0,
      matchupRankAttributionFailures: 0,
      matchupRankSnapshotTooOld: 0,
      matchupRankParticipantsNotFound: 0,
      statsRowsUpdated: 0,
      insertedObservationKeys: [],
      duplicateObservationKeys: [],
      updatedStats: [],
    };
  }

  if (validObservations.length === 0) {
    return {
      affectedGroups: [],
      duplicateObservationsSkipped: 0,
      insertedObservations: 0,
      insertFailures: 0,
      matchupObservationBatchAttempts: 0,
      matchupObservationSuccessfulBatches: 0,
      matchupObservationFailedBatchAttempts: 0,
      matchupObservationBatchSplits: 0,
      matchupObservationTransientRetries: 0,
      matchupObservationIsolatedFailures: 0,
      matchupObservationUnresolvedBatchFailures: 0,
      matchupObservationPersistenceFailureSamples: [],
      matchupObservationPersistenceErrorGroups: [],
      matchupObservationValidationFailures: validationPartition.invalid.length,
      matchupObservationValidationSummary: validationSummary,
      matchupObservationsRejected: validationPartition.invalid.length,
      matchupObservationsValidated: validationPartition.validated,
      observationsFound: uniqueObservations.length,
      counterPickAggregateValidationFailures: 0,
      counterPickAggregateValidationSummary: summarizeValidationFailures([]),
      counterPickAggregatesValidated: 0,
      counterPickAggregateInsertFailures: 0,
      counterPickAggregateBatchAttempts: 0,
      counterPickAggregateSuccessfulBatches: 0,
      counterPickAggregateFailedBatchAttempts: 0,
      counterPickAggregateBatchSplits: 0,
      counterPickAggregateTransientRetries: 0,
      counterPickAggregateIsolatedFailures: 0,
      counterPickAggregateUnresolvedBatchFailures: 0,
      counterPickAggregatePersistenceFailureSamples: [],
      counterPickAggregatePersistenceErrorGroups: [],
      matchupRankAttributionsAttempted: 0,
      matchupRankAttributionsTwoPlayer: 0,
      matchupRankAttributionsSinglePlayer: 0,
      matchupRankAttributionsUnknown: 0,
      matchupRankAttributionFailures: 0,
      matchupRankSnapshotTooOld: 0,
      matchupRankParticipantsNotFound: 0,
      statsRowsUpdated: 0,
      insertedObservationKeys: [],
      duplicateObservationKeys: [],
      updatedStats: [],
    };
  }

  const writeResult = await writeResilientBatches({
    createRowIdentity: getMatchupObservationIdentity,
    createSafeFailureFields: getSafeMatchupObservationFields,
    initialBatchSize: 250,
    rows: validObservations,
    stage: "matchup_observation_insert",
    table: "riot_matchup_observations",
    writeBatch: async (observationChunk) => {
      const { data, error } = await supabase
        .from("riot_matchup_observations")
        .upsert(observationChunk, {
          ignoreDuplicates: true,
          onConflict: observationConflictTarget,
        })
        .select(
          [
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
          ].join(", "),
        );

      if (error) {
        return {
          error,
          ok: false,
        };
      }

      return {
        inserted: data?.length ?? 0,
        insertedRows: data ?? [],
        ok: true,
      };
    },
  });
  const affectedGroups = getAffectedGroups(writeResult.successfulRows);
  const insertedObservationKeys = writeResult.insertedRows.map(getMatchupObservationIdentity);
  const insertedObservationKeySet = new Set(insertedObservationKeys);
  const duplicateObservationKeys = writeResult.successfulRows
    .map(getMatchupObservationIdentity)
    .filter((key) => !insertedObservationKeySet.has(key));
  const rankAttributionSummary = await attributeInsertedObservations({
    insertedRows: writeResult.insertedRows,
    supabase,
  });
  const rebuildResult = await rebuildCounterPickStatsForGroups({
    groups: affectedGroups,
    supabase,
    validationContext: baseValidationContext,
  });

  return {
    affectedGroups,
    duplicateObservationsSkipped: writeResult.duplicates,
    insertedObservations: writeResult.inserted,
    insertFailures: writeResult.failed,
    matchupObservationBatchAttempts: writeResult.batchAttempts,
    matchupObservationSuccessfulBatches: writeResult.successfulBatches,
    matchupObservationFailedBatchAttempts: writeResult.failedBatchAttempts,
    matchupObservationBatchSplits: writeResult.splitOperations,
    matchupObservationTransientRetries: writeResult.transientRetries,
    matchupObservationIsolatedFailures: writeResult.isolatedFailureCount,
    matchupObservationUnresolvedBatchFailures: writeResult.unresolvedBatchFailures,
    matchupObservationPersistenceFailureSamples: writeResult.isolatedFailures,
    matchupObservationPersistenceErrorGroups: writeResult.errorGroups,
    matchupObservationValidationFailures: validationPartition.invalid.length,
    matchupObservationValidationSummary: validationSummary,
    matchupObservationsRejected: validationPartition.invalid.length,
    matchupObservationsValidated: validationPartition.validated,
    observationsFound: uniqueObservations.length,
    insertedObservationKeys,
    duplicateObservationKeys,
    counterPickAggregateValidationFailures: rebuildResult.counterPickAggregateValidationFailures,
    counterPickAggregateValidationSummary: rebuildResult.counterPickAggregateValidationSummary,
    counterPickAggregatesValidated: rebuildResult.counterPickAggregatesValidated,
    counterPickAggregateInsertFailures: rebuildResult.counterPickAggregateInsertFailures,
    counterPickAggregateBatchAttempts: rebuildResult.counterPickAggregateBatchAttempts,
    counterPickAggregateSuccessfulBatches: rebuildResult.counterPickAggregateSuccessfulBatches,
    counterPickAggregateFailedBatchAttempts: rebuildResult.counterPickAggregateFailedBatchAttempts,
    counterPickAggregateBatchSplits: rebuildResult.counterPickAggregateBatchSplits,
    counterPickAggregateTransientRetries: rebuildResult.counterPickAggregateTransientRetries,
    counterPickAggregateIsolatedFailures: rebuildResult.counterPickAggregateIsolatedFailures,
    counterPickAggregateUnresolvedBatchFailures:
      rebuildResult.counterPickAggregateUnresolvedBatchFailures,
    counterPickAggregatePersistenceFailureSamples:
      rebuildResult.counterPickAggregatePersistenceFailureSamples,
    counterPickAggregatePersistenceErrorGroups:
      rebuildResult.counterPickAggregatePersistenceErrorGroups,
    matchupRankAttributionsAttempted:
      rankAttributionSummary.processed + rankAttributionSummary.failures,
    matchupRankAttributionsTwoPlayer: rankAttributionSummary.twoPlayerAverage,
    matchupRankAttributionsSinglePlayer: rankAttributionSummary.singlePlayer,
    matchupRankAttributionsUnknown: rankAttributionSummary.unknown,
    matchupRankAttributionFailures: rankAttributionSummary.failures,
    matchupRankSnapshotTooOld: rankAttributionSummary.snapshotTooOld,
    matchupRankParticipantsNotFound: rankAttributionSummary.participantsNotFound,
    statsRowsUpdated: rebuildResult.statsRowsUpdated,
    updatedStats: rebuildResult.updatedStats,
  };
}

export async function rebuildCounterPickStatsFromObservations({
  champion = null,
  championRegistry = null,
  patch = null,
  role = null,
  supabase,
  validationContext = null,
}) {
  let query = supabase
    .from("riot_matchup_observations")
    .select("champion_a, champion_b, role, patch");

  if (patch) {
    query = query.eq("patch", patch);
  }

  if (role) {
    query = query.eq("role", role);
  }

  if (champion) {
    query = query.or(`champion_a.eq.${champion},champion_b.eq.${champion}`);
  }

  const { data, error } = await query;

  if (error) {
    logDatabaseError("Riot observation group query failed", error);
    throw new Error("Could not load observation groups for rebuild.");
  }

  return rebuildCounterPickStatsForGroups({
    groups: getAffectedGroups(data ?? []),
    supabase,
    validationContext:
      validationContext ?? createObservationValidationContext({ championRegistry }),
  });
}

export async function rebuildCounterPickStatsForGroups({
  championRegistry = null,
  groups,
  supabase,
  validationContext = null,
}) {
  const baseValidationContext =
    validationContext ?? createObservationValidationContext({ championRegistry });
  const updatedStats = [];
  const aggregateValidationFailures = [];
  const aggregatePersistenceFailures = [];
  const aggregatePersistenceErrorGroups = [];
  let counterPickAggregateBatchAttempts = 0;
  let counterPickAggregateSuccessfulBatches = 0;
  let counterPickAggregateFailedBatchAttempts = 0;
  let counterPickAggregateBatchSplits = 0;
  let counterPickAggregateTransientRetries = 0;
  let counterPickAggregateIsolatedFailures = 0;
  let counterPickAggregateUnresolvedBatchFailures = 0;
  let counterPickAggregateInsertFailures = 0;
  let counterPickAggregatesValidated = 0;
  let statsRowsUpdated = 0;

  for (const group of groups) {
    const { data: observations, error } = await supabase
      .from("riot_matchup_observations")
      .select("champion_a, champion_b, winner_champion, champion_a_won, role, patch, rank_bracket")
      .eq("champion_a", group.champion_a)
      .eq("champion_b", group.champion_b)
      .eq("role", group.role)
      .eq("patch", group.patch);

    if (error) {
      logDatabaseError("Riot observation aggregate query failed", error);
      throw new Error("Could not load stored observations for aggregation.");
    }

    const aggregateRows = getDirectedAggregateRows(observations ?? []);

    if (aggregateRows.length === 0) {
      continue;
    }

    const aggregatePartition = partitionValidatedRows(
      aggregateRows,
      validateCounterPickAggregate,
      baseValidationContext,
    );
    counterPickAggregatesValidated += aggregatePartition.validated;
    aggregateValidationFailures.push(...aggregatePartition.invalid);
    logValidationFailures(
      "Counter pick aggregate validation rejected rows",
      aggregatePartition.invalid,
    );

    if (aggregatePartition.valid.length === 0) {
      continue;
    }

    await deleteCounterPickStatsForGroup({
      group,
      supabase,
    });

    const writeResult = await writeResilientBatches({
      createRowIdentity: getCounterPickAggregateIdentity,
      createSafeFailureFields: getSafeCounterPickAggregateFields,
      initialBatchSize: 2,
      rows: aggregatePartition.valid,
      stage: "counter_pick_stat_aggregate_upsert",
      table: "counter_pick_stats",
      writeBatch: async (rows) => {
        const { data, error } = await supabase
          .from("counter_pick_stats")
          .upsert(rows, {
            onConflict: "enemy_champion_id,counter_champion_id,role,patch,rank_bracket",
          })
          .select(
            "enemy_champion_id, counter_champion_id, role, patch, rank_bracket, games, wins, losses, win_rate, tier",
          );

        if (error) {
          console.error("Counter-pick aggregate upsert error", {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint,
          });

          return {
            error,
            ok: false,
          };
        }

        return {
          inserted: data?.length ?? rows.length,
          insertedRows: data ?? rows,
          ok: true,
        };
      },
    });

    counterPickAggregateBatchAttempts += writeResult.batchAttempts;
    counterPickAggregateSuccessfulBatches += writeResult.successfulBatches;
    counterPickAggregateFailedBatchAttempts += writeResult.failedBatchAttempts;
    counterPickAggregateBatchSplits += writeResult.splitOperations;
    counterPickAggregateTransientRetries += writeResult.transientRetries;
    counterPickAggregateIsolatedFailures += writeResult.isolatedFailureCount;
    counterPickAggregateUnresolvedBatchFailures += writeResult.unresolvedBatchFailures;
    counterPickAggregateInsertFailures += writeResult.failed;
    aggregatePersistenceFailures.push(...writeResult.isolatedFailures);
    aggregatePersistenceErrorGroups.push(...writeResult.errorGroups);
    statsRowsUpdated += writeResult.inserted + writeResult.duplicates;
    updatedStats.push(
      ...(writeResult.insertedRows.length ? writeResult.insertedRows : writeResult.successfulRows),
    );
  }

  return {
    counterPickAggregateValidationFailures: aggregateValidationFailures.length,
    counterPickAggregateValidationSummary: summarizeValidationFailures(aggregateValidationFailures),
    counterPickAggregatesValidated,
    counterPickAggregateInsertFailures,
    counterPickAggregateBatchAttempts,
    counterPickAggregateSuccessfulBatches,
    counterPickAggregateFailedBatchAttempts,
    counterPickAggregateBatchSplits,
    counterPickAggregateTransientRetries,
    counterPickAggregateIsolatedFailures,
    counterPickAggregateUnresolvedBatchFailures,
    counterPickAggregatePersistenceFailureSamples: aggregatePersistenceFailures.slice(0, 20),
    counterPickAggregatePersistenceErrorGroups: mergeErrorGroups(aggregatePersistenceErrorGroups),
    statsRowsUpdated,
    updatedStats,
  };
}

export function getDirectedAggregateRows(observations) {
  if (observations.length === 0) {
    return [];
  }

  const observationsByBracket = new Map();

  for (const observation of observations) {
    for (const rankBracket of getCounterPickAggregateRankBrackets(observation.rank_bracket)) {
      const rows = observationsByBracket.get(rankBracket) ?? [];
      rows.push(observation);
      observationsByBracket.set(rankBracket, rows);
    }
  }

  return Array.from(observationsByBracket.entries()).flatMap(([rankBracket, bracketRows]) => {
    const firstObservation = bracketRows[0];
    const games = bracketRows.length;
    const championAWins = bracketRows.filter((observation) => observation.champion_a_won).length;
    const championBWins = games - championAWins;

    return [
      getDirectedAggregateRow({
        counterChampionId: firstObservation.champion_a,
        enemyChampionId: firstObservation.champion_b,
        games,
        patch: firstObservation.patch,
        rankBracket,
        role: firstObservation.role,
        wins: championAWins,
      }),
      getDirectedAggregateRow({
        counterChampionId: firstObservation.champion_b,
        enemyChampionId: firstObservation.champion_a,
        games,
        patch: firstObservation.patch,
        rankBracket,
        role: firstObservation.role,
        wins: championBWins,
      }),
    ];
  });
}

export function getAffectedGroups(observations) {
  const groupsByKey = new Map();

  for (const observation of observations) {
    if (
      !observation.champion_a ||
      !observation.champion_b ||
      !observation.role ||
      !observation.patch
    ) {
      continue;
    }

    const key = [
      observation.champion_a,
      observation.champion_b,
      observation.role,
      observation.patch,
    ].join("::");

    if (!groupsByKey.has(key)) {
      groupsByKey.set(key, {
        champion_a: observation.champion_a,
        champion_b: observation.champion_b,
        patch: observation.patch,
        role: observation.role,
      });
    }
  }

  return Array.from(groupsByKey.values());
}

function getDirectedAggregateRow({
  counterChampionId,
  enemyChampionId,
  games,
  patch,
  rankBracket,
  role,
  wins,
}) {
  const losses = games - wins;
  const winRate = calculateWinRate({ games, wins });

  return {
    counter_champion_id: counterChampionId,
    enemy_champion_id: enemyChampionId,
    games,
    losses,
    patch,
    rank_bracket: rankBracket,
    role,
    tier: calculateTier({ games, winRate }),
    win_rate: winRate,
    wins,
  };
}

function dedupeObservations(observations) {
  const observationsByKey = new Map();

  for (const observation of observations) {
    const key = `${observation.match_id}::${observation.role}`;

    if (!observationsByKey.has(key)) {
      observationsByKey.set(key, observation);
    }
  }

  return Array.from(observationsByKey.values());
}

function getMatchupObservationIdentity(observation) {
  return `${observation.match_id}::${observation.role}`;
}

function getSafeMatchupObservationFields(observation) {
  return {
    championA: observation.champion_a ?? null,
    championB: observation.champion_b ?? null,
    matchId: shortenSafeValue(observation.match_id, 48),
    patch: observation.patch ?? null,
    role: observation.role ?? null,
  };
}

function getCounterPickAggregateIdentity(row) {
  return [
    row.enemy_champion_id,
    row.counter_champion_id,
    row.role,
    row.patch,
    row.rank_bracket,
  ].join("::");
}

function getSafeCounterPickAggregateFields(row) {
  return {
    counterChampion: row.counter_champion_id ?? null,
    enemyChampion: row.enemy_champion_id ?? null,
    games: row.games ?? null,
    patch: row.patch ?? null,
    rankBracket: row.rank_bracket ?? null,
    role: row.role ?? null,
  };
}

async function attributeInsertedObservations({ insertedRows, supabase }) {
  if (!insertedRows || insertedRows.length === 0) {
    return createEmptyMatchupRankAttributionSummary();
  }

  try {
    const result = await attributeMatchupRankBrackets({
      force: false,
      observations: insertedRows,
      repository: createSupabaseMatchupRankAttributionRepository(supabase),
    });

    return result.summary;
  } catch (error) {
    console.error("Inserted matchup rank attribution batch failed", {
      error: error instanceof Error ? error.message : "Unknown error",
      rows: insertedRows.length,
    });

    return {
      ...createEmptyMatchupRankAttributionSummary(),
      failures: insertedRows.length,
      total: insertedRows.length,
    };
  }
}

async function deleteCounterPickStatsForGroup({ group, supabase }) {
  const { error } = await supabase
    .from("counter_pick_stats")
    .delete()
    .eq("patch", group.patch)
    .eq("role", group.role)
    .in("enemy_champion_id", [group.champion_a, group.champion_b])
    .in("counter_champion_id", [group.champion_a, group.champion_b]);

  if (error) {
    logDatabaseError("Counter-pick aggregate cleanup failed", error);
    throw new Error("Could not clear stale counter-pick aggregates before rebuild.");
  }
}

function mergeErrorGroups(groups) {
  const groupsByFingerprint = new Map();

  for (const group of groups) {
    const key = group.messageFingerprint;
    const current = groupsByFingerprint.get(key) ?? {
      ...group,
      failureCount: 0,
    };

    current.failureCount += group.failureCount;
    groupsByFingerprint.set(key, current);
  }

  return Array.from(groupsByFingerprint.values());
}

function shortenSafeValue(value, limit) {
  const text = String(value ?? "");

  if (text.length <= limit) {
    return text || null;
  }

  return `${text.slice(0, Math.max(limit - 3, 0))}...`;
}

function logDatabaseError(label, error) {
  console.error(label, {
    code: error.code,
    details: error.details,
    hint: error.hint,
    message: error.message,
  });
}
