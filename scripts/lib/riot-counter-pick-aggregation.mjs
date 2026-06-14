import { calculateTier, calculateWinRate } from "./riot-counter-pick-scanner.mjs";

const observationConflictTarget = "match_id,role";

export async function persistObservationsAndRebuildStats({
  observations,
  scanJobId = null,
  supabase,
}) {
  const uniqueObservations = dedupeObservations(observations ?? []).map((observation) => ({
    ...observation,
    scan_job_id: scanJobId,
  }));

  if (uniqueObservations.length === 0) {
    return {
      affectedGroups: [],
      duplicateObservationsSkipped: 0,
      insertedObservations: 0,
      insertFailures: 0,
      observationsFound: 0,
      statsRowsUpdated: 0,
      updatedStats: [],
    };
  }

  const { data: insertedRows, error: insertError } = await supabase
    .from("riot_matchup_observations")
    .upsert(uniqueObservations, {
      ignoreDuplicates: true,
      onConflict: observationConflictTarget,
    })
    .select("match_id, role");

  if (insertError) {
    logDatabaseError("Riot observation insert failed", insertError);

    return {
      affectedGroups: getAffectedGroups(uniqueObservations),
      duplicateObservationsSkipped: 0,
      insertedObservations: 0,
      insertFailures: uniqueObservations.length,
      observationsFound: uniqueObservations.length,
      statsRowsUpdated: 0,
      updatedStats: [],
    };
  }

  const insertedObservations = insertedRows?.length ?? 0;
  const duplicateObservationsSkipped = Math.max(
    uniqueObservations.length - insertedObservations,
    0,
  );
  const affectedGroups = getAffectedGroups(uniqueObservations);
  const rebuildResult = await rebuildCounterPickStatsForGroups({
    groups: affectedGroups,
    supabase,
  });

  return {
    affectedGroups,
    duplicateObservationsSkipped,
    insertedObservations,
    insertFailures: 0,
    observationsFound: uniqueObservations.length,
    statsRowsUpdated: rebuildResult.statsRowsUpdated,
    updatedStats: rebuildResult.updatedStats,
  };
}

export async function rebuildCounterPickStatsFromObservations({
  champion = null,
  patch = null,
  role = null,
  supabase,
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
  });
}

export async function rebuildCounterPickStatsForGroups({ groups, supabase }) {
  const updatedStats = [];
  let statsRowsUpdated = 0;

  for (const group of groups) {
    const { data: observations, error } = await supabase
      .from("riot_matchup_observations")
      .select("champion_a, champion_b, winner_champion, champion_a_won, role, patch")
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

    const { data: savedRows, error: upsertError } = await supabase
      .from("counter_pick_stats")
      .upsert(aggregateRows, {
        onConflict: "enemy_champion_id,counter_champion_id,role,patch",
      })
      .select(
        "enemy_champion_id, counter_champion_id, role, patch, games, wins, losses, win_rate, tier",
      );

    if (upsertError) {
      logDatabaseError("Counter pick stat aggregate upsert failed", upsertError);
      throw new Error("Counter pick stat aggregation failed.");
    }

    statsRowsUpdated += savedRows?.length ?? aggregateRows.length;
    updatedStats.push(...(savedRows ?? aggregateRows));
  }

  return {
    statsRowsUpdated,
    updatedStats,
  };
}

export function getDirectedAggregateRows(observations) {
  if (observations.length === 0) {
    return [];
  }

  const firstObservation = observations[0];
  const games = observations.length;
  const championAWins = observations.filter((observation) => observation.champion_a_won).length;
  const championBWins = games - championAWins;

  return [
    getDirectedAggregateRow({
      counterChampionId: firstObservation.champion_a,
      enemyChampionId: firstObservation.champion_b,
      games,
      patch: firstObservation.patch,
      role: firstObservation.role,
      wins: championAWins,
    }),
    getDirectedAggregateRow({
      counterChampionId: firstObservation.champion_b,
      enemyChampionId: firstObservation.champion_a,
      games,
      patch: firstObservation.patch,
      role: firstObservation.role,
      wins: championBWins,
    }),
  ];
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

function getDirectedAggregateRow({ counterChampionId, enemyChampionId, games, patch, role, wins }) {
  const losses = games - wins;
  const winRate = calculateWinRate({ games, wins });

  return {
    counter_champion_id: counterChampionId,
    enemy_champion_id: enemyChampionId,
    games,
    losses,
    patch,
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

function logDatabaseError(label, error) {
  console.error(label, {
    code: error.code,
    details: error.details,
    hint: error.hint,
    message: error.message,
  });
}
