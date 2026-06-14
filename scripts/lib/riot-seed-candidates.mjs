import { writeResilientBatches } from "./riot-batch-isolation.mjs";
import {
  createObservationValidationContext,
  logValidationFailures,
  partitionValidatedRows,
  summarizeValidationFailures,
  validateSeedCandidateObservation,
  withCandidateIds,
} from "./riot-observation-validation.mjs";

export const defaultPlatformRegion = "EUW1";
export const defaultRegionalRouting = "EUROPE";

const candidateBatchSize = 200;
const candidateIdLookupChunkSize = 25;
const candidateIdRetryLookupChunkSize = 5;
const observationBatchSize = 250;
const profileRebuildBatchSize = 100;
const topChampionLimit = 5;

export async function persistSeedCandidatesFromObservations({
  championRegistry = null,
  observations,
  scanJobId = null,
  source = "match_discovery",
  supabase,
  validationContext = null,
}) {
  const baseValidationContext =
    validationContext ?? createObservationValidationContext({ championRegistry });
  const validParticipantObservations = getValidCandidateObservations(observations ?? []);
  const validObservations = dedupeCandidateObservations(validParticipantObservations);

  if (validObservations.length === 0) {
    return {
      ...emptyCandidatePersistenceResult(),
      participantPuuidsObserved: validParticipantObservations.length,
    };
  }

  const candidateInputs = getCandidateInputsFromObservations({
    observations: validObservations,
    scanJobId,
    source,
  });
  const candidateResult = await upsertSeedCandidates({
    candidates: candidateInputs,
    supabase,
  });
  const candidateIdsByKey = candidateResult.candidatesByKey;
  const candidateObservationRows = [];
  const unresolvedCandidateKeys = new Set();
  let candidateObservationResolutionFailures = 0;

  for (const observation of validObservations) {
    const candidateKey = getCandidateKey(observation);
    const candidate = candidateIdsByKey.get(candidateKey);

    if (!candidate) {
      unresolvedCandidateKeys.add(candidateKey);
      candidateObservationResolutionFailures += 1;
      logCandidateIdResolutionFailure(observation);
      continue;
    }

    candidateObservationRows.push({
      candidate_id: candidate.id,
      champion: observation.champion,
      game_duration_seconds: observation.game_duration_seconds,
      game_start_at: observation.game_start_at,
      match_id: observation.match_id,
      patch: observation.patch,
      platform_region: observation.platform_region,
      queue_id: observation.queue_id,
      regional_routing: observation.regional_routing,
      role: observation.role,
      scan_job_id: scanJobId,
      won: observation.won,
    });
  }

  const observationResult = await insertCandidateObservations({
    observations: candidateObservationRows,
    supabase,
    validationContext: withCandidateIds(
      baseValidationContext,
      Array.from(candidateIdsByKey.values()).map((candidate) => candidate.id),
    ),
  });
  const profileResult = await rebuildSeedCandidateProfiles({
    candidateIds: observationResult.insertedCandidateIds,
    supabase,
  });
  const candidateUniqueIdResolutionFailures = unresolvedCandidateKeys.size;
  const candidateIdsResolved = candidateResult.candidateIdsResolved;

  if (candidateIdsResolved + candidateUniqueIdResolutionFailures !== candidateInputs.length) {
    console.error("Seed candidate identity resolution invariant failed", {
      candidateIdsResolved,
      candidateUniqueIdResolutionFailures,
      uniqueCandidatesEncountered: candidateInputs.length,
    });
  }

  return {
    candidateIdLookupChunkFailures: candidateResult.candidateIdLookupChunkFailures,
    candidateIdLookupChunks: candidateResult.candidateIdLookupChunks,
    candidateIdResolutionFailures: candidateObservationResolutionFailures,
    candidateIdsResolved,
    candidateObservationDuplicatesSkipped: observationResult.duplicatesSkipped,
    candidateObservationInsertFailures: observationResult.insertFailures,
    candidateObservationBatchAttempts: observationResult.batchAttempts,
    candidateObservationSuccessfulBatches: observationResult.successfulBatches,
    candidateObservationFailedBatchAttempts: observationResult.failedBatchAttempts,
    candidateObservationBatchSplits: observationResult.batchSplits,
    candidateObservationTransientRetries: observationResult.transientRetries,
    candidateObservationIsolatedFailures: observationResult.isolatedFailures,
    candidateObservationUnresolvedBatchFailures: observationResult.unresolvedBatchFailures,
    candidateObservationPersistenceFailureSamples: observationResult.failureSamples,
    candidateObservationPersistenceErrorGroups: observationResult.errorGroups,
    candidateObservationResolutionFailures,
    candidateObservationsFound: candidateObservationRows.length,
    candidateObservationsInserted: observationResult.inserted,
    candidateObservationValidationFailures: observationResult.validationFailures,
    candidateObservationValidationSummary: observationResult.validationSummary,
    candidateObservationsRejected: observationResult.rejected,
    candidateObservationsValidated: observationResult.validated,
    candidateProfileFailures: profileResult.profileFailures,
    candidateProfilesRebuilt: profileResult.profilesRebuilt,
    candidateUniqueIdResolutionFailures,
    existingCandidatesUpdated: candidateResult.existingCandidatesUpdated,
    newCandidatesCreated: candidateResult.newCandidatesCreated,
    participantPuuidsObserved: validParticipantObservations.length,
    uniqueCandidatesEncountered: candidateInputs.length,
  };
}

export async function upsertSeedCandidatesFromPuuids({
  platformRegion = defaultPlatformRegion,
  puuids,
  regionalRouting = defaultRegionalRouting,
  source = "manual",
  supabase,
}) {
  const now = new Date().toISOString();
  const candidates = uniqueValues(puuids ?? []).map((puuid) => ({
    first_seen_at: now,
    first_seen_match_id: null,
    first_seen_scan_job_id: null,
    latest_match_seen_at: null,
    platform_region: normalizePlatformRegion(platformRegion),
    puuid,
    regional_routing: normalizeRegionalRouting(regionalRouting),
    source,
  }));

  return upsertSeedCandidates({
    candidates,
    supabase,
  });
}

export async function rebuildSeedCandidateProfiles({
  candidateIds = null,
  platformRegion = null,
  puuid = null,
  supabase,
}) {
  const resolvedCandidateIds = Array.isArray(candidateIds)
    ? uniqueValues(candidateIds)
    : await fetchCandidateIds({
        platformRegion,
        puuid,
        supabase,
      });

  if (resolvedCandidateIds.length === 0) {
    return {
      profileFailures: 0,
      profilesRebuilt: 0,
    };
  }

  let profileFailures = 0;
  let profilesRebuilt = 0;

  for (const candidateIdChunk of chunkArray(resolvedCandidateIds, profileRebuildBatchSize)) {
    const { data, error } = await supabase
      .from("riot_seed_candidate_observations")
      .select("candidate_id, champion, role, won, game_start_at")
      .in("candidate_id", candidateIdChunk);

    if (error) {
      logDatabaseError("Seed candidate profile observation query failed", error);
      profileFailures += candidateIdChunk.length;
      continue;
    }

    const observationsByCandidate = groupBy(data ?? [], (observation) => observation.candidate_id);

    for (const candidateId of candidateIdChunk) {
      const observations = observationsByCandidate.get(candidateId) ?? [];
      const profile = getCandidateProfilePatch(observations);
      const { error: updateError } = await supabase
        .from("riot_seed_candidates")
        .update(profile)
        .eq("id", candidateId);

      if (updateError) {
        logDatabaseError("Seed candidate profile update failed", updateError);
        profileFailures += 1;
        continue;
      }

      profilesRebuilt += 1;
    }
  }

  return {
    profileFailures,
    profilesRebuilt,
  };
}

export function getCandidateProfilePatch(observations) {
  const observedGames = observations.length;
  const latestMatchSeenAt = getLatestTimestamp(
    observations.map((observation) => observation.game_start_at),
  );
  const roleDistribution = getRoleDistribution(observations);
  const roleEntries = Object.entries(roleDistribution).sort((left, right) => {
    if (left[1].games !== right[1].games) {
      return right[1].games - left[1].games;
    }

    return left[0].localeCompare(right[0]);
  });
  const primaryRole = roleEntries[0];
  const secondaryRole = roleEntries[1];
  const topChampions = getTopChampions(observations);
  const primaryChampion = topChampions[0] ?? null;

  return {
    estimated_primary_role:
      observedGames >= 3 && primaryRole && primaryRole[1].games >= 3 ? primaryRole[0] : null,
    estimated_secondary_role:
      observedGames >= 3 && secondaryRole && secondaryRole[1].games >= 2 ? secondaryRole[0] : null,
    latest_match_seen_at: latestMatchSeenAt,
    last_profiled_at: new Date().toISOString(),
    observed_games: observedGames,
    primary_champion:
      observedGames >= 3 && primaryChampion && primaryChampion.games >= 3
        ? primaryChampion.champion
        : null,
    primary_champion_games:
      observedGames >= 3 && primaryChampion && primaryChampion.games >= 3
        ? primaryChampion.games
        : 0,
    primary_champion_role:
      observedGames >= 3 && primaryChampion && primaryChampion.games >= 3
        ? primaryChampion.role
        : null,
    primary_champion_share:
      observedGames >= 3 && primaryChampion && primaryChampion.games >= 3
        ? primaryChampion.share
        : null,
    primary_role_share:
      observedGames >= 3 && primaryRole && primaryRole[1].games >= 3 ? primaryRole[1].share : null,
    role_distribution: roleDistribution,
    secondary_role_share:
      observedGames >= 3 && secondaryRole && secondaryRole[1].games >= 2
        ? secondaryRole[1].share
        : null,
    top_champions: topChampions,
  };
}

export function normalizePlatformRegion(value) {
  return String(value ?? defaultPlatformRegion)
    .trim()
    .toUpperCase();
}

export function normalizeRegionalRouting(value) {
  return String(value ?? defaultRegionalRouting)
    .trim()
    .toUpperCase();
}

export function createCandidateIdentityKey(platformRegion, puuid) {
  return `${normalizePlatformRegion(platformRegion)}:${String(puuid ?? "").trim()}`;
}

function getCandidateInputsFromObservations({ observations, scanJobId, source }) {
  const candidatesByKey = new Map();

  for (const observation of observations) {
    const key = getCandidateKey(observation);
    const currentCandidate = candidatesByKey.get(key);
    const latestMatchSeenAt = getLatestTimestamp([
      currentCandidate?.latest_match_seen_at,
      observation.game_start_at,
    ]);

    if (!currentCandidate) {
      candidatesByKey.set(key, {
        first_seen_at: observation.game_start_at ?? new Date().toISOString(),
        first_seen_match_id: observation.match_id,
        first_seen_scan_job_id: scanJobId,
        latest_match_seen_at: latestMatchSeenAt,
        platform_region: observation.platform_region,
        puuid: String(observation.puuid).trim(),
        regional_routing: observation.regional_routing,
        source,
      });
      continue;
    }

    currentCandidate.latest_match_seen_at = latestMatchSeenAt;
  }

  return Array.from(candidatesByKey.values());
}

async function upsertSeedCandidates({ candidates, supabase }) {
  const uniqueCandidates = dedupeCandidates(candidates);

  if (uniqueCandidates.length === 0) {
    return {
      candidateIdLookupChunkFailures: 0,
      candidateIdLookupChunks: 0,
      candidateIdsResolved: 0,
      candidatesByKey: new Map(),
      existingCandidatesUpdated: 0,
      newCandidatesCreated: 0,
    };
  }

  const existingCandidateLookup = await fetchCandidatesByPlatformAndPuuid({
    candidates: uniqueCandidates,
    stage: "pre_upsert_existing_candidate_lookup",
    supabase,
  });
  const existingCandidatesBefore = existingCandidateLookup.candidatesByKey;

  for (const candidateChunk of chunkArray(uniqueCandidates, candidateBatchSize)) {
    const { error } = await supabase.from("riot_seed_candidates").upsert(
      candidateChunk.map((candidate) => ({
        first_seen_at: candidate.first_seen_at,
        first_seen_match_id: candidate.first_seen_match_id,
        first_seen_scan_job_id: candidate.first_seen_scan_job_id,
        latest_match_seen_at: candidate.latest_match_seen_at,
        platform_region: candidate.platform_region,
        puuid: candidate.puuid,
        regional_routing: candidate.regional_routing,
        source: candidate.source,
        status: "candidate",
      })),
      {
        ignoreDuplicates: true,
        onConflict: "platform_region,puuid",
      },
    );

    if (error) {
      logDatabaseError("Seed candidate insert failed", error);
    }
  }

  const candidateLookup = await fetchCandidatesByPlatformAndPuuid({
    candidates: uniqueCandidates,
    stage: "post_upsert_candidate_id_lookup",
    supabase,
  });
  let candidatesByKey = candidateLookup.candidatesByKey;
  let candidateIdLookupChunks = candidateLookup.lookupChunks;
  let candidateIdLookupChunkFailures = candidateLookup.lookupChunkFailures;
  const unresolvedCandidates = uniqueCandidates.filter(
    (candidate) => !candidatesByKey.has(getCandidateKey(candidate)),
  );

  if (unresolvedCandidates.length > 0) {
    const retryLookup = await fetchCandidatesByPlatformAndPuuid({
      candidates: unresolvedCandidates,
      chunkSize: candidateIdRetryLookupChunkSize,
      stage: "post_upsert_candidate_id_retry_lookup",
      supabase,
    });

    candidateIdLookupChunks += retryLookup.lookupChunks;
    candidateIdLookupChunkFailures += retryLookup.lookupChunkFailures;
    candidatesByKey = new Map([...candidatesByKey, ...retryLookup.candidatesByKey]);
  }

  const now = new Date().toISOString();
  for (const candidate of uniqueCandidates) {
    const update = {
      last_seen_at: now,
    };

    if (candidate.latest_match_seen_at) {
      update.latest_match_seen_at = candidate.latest_match_seen_at;
    }

    const { error } = await supabase
      .from("riot_seed_candidates")
      .update(update)
      .eq("platform_region", candidate.platform_region)
      .eq("puuid", candidate.puuid);

    if (error) {
      logDatabaseError("Seed candidate mutable field update failed", error);
    }
  }

  let existingCandidatesUpdated = 0;
  let newCandidatesCreated = 0;

  for (const candidate of uniqueCandidates) {
    const key = getCandidateKey(candidate);

    if (!candidatesByKey.has(key)) {
      continue;
    }

    if (existingCandidatesBefore.has(key)) {
      existingCandidatesUpdated += 1;
    } else {
      newCandidatesCreated += 1;
    }
  }

  return {
    candidateIdLookupChunkFailures,
    candidateIdLookupChunks,
    candidateIdsResolved: candidatesByKey.size,
    candidatesByKey,
    existingCandidatesUpdated,
    newCandidatesCreated,
  };
}

async function fetchCandidatesByPlatformAndPuuid({
  candidates,
  chunkSize = candidateIdLookupChunkSize,
  stage,
  supabase,
}) {
  const candidatesByKey = new Map();
  const candidatesByPlatform = groupBy(candidates, (candidate) => candidate.platform_region);
  let lookupChunkFailures = 0;
  let lookupChunks = 0;

  for (const [platformRegion, platformCandidates] of candidatesByPlatform.entries()) {
    const candidateChunks = chunkArray(platformCandidates, chunkSize);

    for (const [chunkIndex, candidateChunk] of candidateChunks.entries()) {
      lookupChunks += 1;

      const { data, error } = await supabase
        .from("riot_seed_candidates")
        .select("id, platform_region, puuid")
        .eq("platform_region", platformRegion)
        .in(
          "puuid",
          candidateChunk.map((candidate) => candidate.puuid),
        );

      if (error) {
        lookupChunkFailures += 1;
        logDatabaseError("Seed candidate lookup failed", error, {
          chunkIndex,
          chunkSize: candidateChunk.length,
          identitiesRequested: candidateChunk.length,
          platformRegion,
          rowsReturned: 0,
          stage,
        });
        continue;
      }

      logCandidateLookupChunk({
        chunkIndex,
        chunkSize: candidateChunk.length,
        identitiesRequested: candidateChunk.length,
        platformRegion,
        rowsReturned: data?.length ?? 0,
        stage,
      });

      for (const candidate of data ?? []) {
        candidatesByKey.set(getCandidateKey(candidate), candidate);
      }
    }
  }

  return {
    candidatesByKey,
    lookupChunkFailures,
    lookupChunks,
  };
}

async function insertCandidateObservations({ observations, supabase, validationContext }) {
  const uniqueObservations = dedupeCandidateMatchRows(observations ?? []);
  const validationPartition = partitionValidatedRows(
    uniqueObservations,
    validateSeedCandidateObservation,
    validationContext,
  );
  const uniqueValidObservations = validationPartition.valid;
  const validationSummary = summarizeValidationFailures(validationPartition.invalid);
  logValidationFailures(
    "Seed candidate observation validation rejected rows",
    validationPartition.invalid,
  );

  const writeResult = await writeResilientBatches({
    createRowIdentity: getCandidateObservationIdentity,
    createSafeFailureFields: getSafeCandidateObservationFields,
    initialBatchSize: observationBatchSize,
    rows: uniqueValidObservations,
    stage: "seed_candidate_observation_insert",
    table: "riot_seed_candidate_observations",
    writeBatch: async (observationChunk) => {
      const { data, error } = await supabase
        .from("riot_seed_candidate_observations")
        .upsert(observationChunk, {
          ignoreDuplicates: true,
          onConflict: "candidate_id,match_id",
        })
        .select("id, candidate_id");

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

  return {
    batchAttempts: writeResult.batchAttempts,
    batchSplits: writeResult.splitOperations,
    duplicatesSkipped: writeResult.duplicates,
    errorGroups: writeResult.errorGroups,
    failedBatchAttempts: writeResult.failedBatchAttempts,
    failureSamples: writeResult.isolatedFailures,
    inserted: writeResult.inserted,
    insertedCandidateIds: uniqueValues(
      writeResult.insertedRows.map((row) => row.candidate_id).filter(Boolean),
    ),
    insertFailures: writeResult.failed,
    isolatedFailures: writeResult.isolatedFailureCount,
    rejected: validationPartition.invalid.length,
    successfulBatches: writeResult.successfulBatches,
    transientRetries: writeResult.transientRetries,
    unresolvedBatchFailures: writeResult.unresolvedBatchFailures,
    validated: validationPartition.validated,
    validationFailures: validationPartition.invalid.length,
    validationSummary,
  };
}

async function fetchCandidateIds({ platformRegion, puuid, supabase }) {
  let query = supabase.from("riot_seed_candidates").select("id");

  if (platformRegion) {
    query = query.eq("platform_region", normalizePlatformRegion(platformRegion));
  }

  if (puuid) {
    query = query.eq("puuid", puuid);
  }

  const { data, error } = await query;

  if (error) {
    logDatabaseError("Seed candidate id query failed", error);
    return [];
  }

  return (data ?? []).map((candidate) => candidate.id);
}

function getRoleDistribution(observations) {
  const observedGames = observations.length;
  const roleCounts = new Map();

  for (const observation of observations) {
    roleCounts.set(observation.role, (roleCounts.get(observation.role) ?? 0) + 1);
  }

  return Object.fromEntries(
    Array.from(roleCounts.entries())
      .sort((left, right) => left[0].localeCompare(right[0]))
      .map(([role, games]) => [
        role,
        {
          games,
          share: getShare(games, observedGames),
        },
      ]),
  );
}

function getTopChampions(observations) {
  const observedGames = observations.length;
  const championRows = new Map();

  for (const observation of observations) {
    const key = `${observation.champion}::${observation.role}`;
    const currentRow = championRows.get(key) ?? {
      champion: observation.champion,
      games: 0,
      lastPlayedAt: null,
      losses: 0,
      role: observation.role,
      wins: 0,
    };

    currentRow.games += 1;

    if (observation.won) {
      currentRow.wins += 1;
    } else {
      currentRow.losses += 1;
    }

    currentRow.lastPlayedAt = getLatestTimestamp([
      currentRow.lastPlayedAt,
      observation.game_start_at,
    ]);
    championRows.set(key, currentRow);
  }

  return Array.from(championRows.values())
    .map((row) => ({
      ...row,
      share: getShare(row.games, observedGames),
    }))
    .sort((left, right) => {
      if (left.games !== right.games) {
        return right.games - left.games;
      }

      const leftDate = left.lastPlayedAt ? new Date(left.lastPlayedAt).getTime() : 0;
      const rightDate = right.lastPlayedAt ? new Date(right.lastPlayedAt).getTime() : 0;

      if (leftDate !== rightDate) {
        return rightDate - leftDate;
      }

      return left.champion.localeCompare(right.champion);
    })
    .slice(0, topChampionLimit);
}

function dedupeCandidates(candidates) {
  const candidatesByKey = new Map();

  for (const candidate of candidates) {
    const normalizedCandidate = {
      ...candidate,
      platform_region: normalizePlatformRegion(candidate.platform_region),
      puuid: String(candidate.puuid ?? "").trim(),
      regional_routing: normalizeRegionalRouting(candidate.regional_routing),
    };
    const key = getCandidateKey(normalizedCandidate);
    const currentCandidate = candidatesByKey.get(key);

    if (!currentCandidate) {
      candidatesByKey.set(key, normalizedCandidate);
      continue;
    }

    currentCandidate.latest_match_seen_at = getLatestTimestamp([
      currentCandidate.latest_match_seen_at,
      normalizedCandidate.latest_match_seen_at,
    ]);
  }

  return Array.from(candidatesByKey.values());
}

function getValidCandidateObservations(observations) {
  return (observations ?? [])
    .filter(
      (observation) =>
        observation?.puuid && observation?.match_id && observation?.role && observation?.champion,
    )
    .map((observation) => ({
      ...observation,
      platform_region: normalizePlatformRegion(observation.platform_region),
      puuid: String(observation.puuid).trim(),
      regional_routing: normalizeRegionalRouting(observation.regional_routing),
    }));
}

function dedupeCandidateObservations(observations) {
  const observationsByKey = new Map();

  for (const observation of observations) {
    const key = `${getCandidateKey(observation)}::${observation.match_id}`;

    if (!observationsByKey.has(key)) {
      observationsByKey.set(key, observation);
    }
  }

  return Array.from(observationsByKey.values());
}

function dedupeCandidateMatchRows(observations) {
  const observationsByKey = new Map();

  for (const observation of observations) {
    const key = `${observation.candidate_id}::${observation.match_id}`;

    if (!observationsByKey.has(key)) {
      observationsByKey.set(key, observation);
    }
  }

  return Array.from(observationsByKey.values());
}

function emptyCandidatePersistenceResult() {
  return {
    candidateIdLookupChunkFailures: 0,
    candidateIdLookupChunks: 0,
    candidateIdResolutionFailures: 0,
    candidateIdsResolved: 0,
    candidateObservationDuplicatesSkipped: 0,
    candidateObservationBatchAttempts: 0,
    candidateObservationSuccessfulBatches: 0,
    candidateObservationFailedBatchAttempts: 0,
    candidateObservationBatchSplits: 0,
    candidateObservationTransientRetries: 0,
    candidateObservationIsolatedFailures: 0,
    candidateObservationUnresolvedBatchFailures: 0,
    candidateObservationPersistenceFailureSamples: [],
    candidateObservationPersistenceErrorGroups: [],
    candidateObservationInsertFailures: 0,
    candidateObservationResolutionFailures: 0,
    candidateObservationsFound: 0,
    candidateObservationsInserted: 0,
    candidateObservationValidationFailures: 0,
    candidateObservationValidationSummary: summarizeValidationFailures([]),
    candidateObservationsRejected: 0,
    candidateObservationsValidated: 0,
    candidateProfileFailures: 0,
    candidateProfilesRebuilt: 0,
    candidateUniqueIdResolutionFailures: 0,
    existingCandidatesUpdated: 0,
    newCandidatesCreated: 0,
    participantPuuidsObserved: 0,
    uniqueCandidatesEncountered: 0,
  };
}

function getCandidateObservationIdentity(observation) {
  return `${observation.candidate_id}::${observation.match_id}`;
}

function getSafeCandidateObservationFields(observation) {
  return {
    candidateId: shortenSafeValue(observation.candidate_id, 18),
    champion: observation.champion ?? null,
    matchId: shortenSafeValue(observation.match_id, 48),
    patch: observation.patch ?? null,
    queueId: observation.queue_id ?? null,
    role: observation.role ?? null,
  };
}

function getCandidateKey(candidate) {
  return createCandidateIdentityKey(candidate.platform_region, candidate.puuid);
}

function getLatestTimestamp(values) {
  const timestamps = values
    .filter(Boolean)
    .map((value) => new Date(value).getTime())
    .filter(Number.isFinite);

  if (timestamps.length === 0) {
    return null;
  }

  return new Date(Math.max(...timestamps)).toISOString();
}

function getShare(count, total) {
  if (total <= 0) {
    return 0;
  }

  return Number((count / total).toFixed(4));
}

function logCandidateIdResolutionFailure(observation) {
  console.warn("Seed candidate ID resolution failed", {
    platformRegion: normalizePlatformRegion(observation.platform_region),
    puuid: shortenPuuid(observation.puuid),
  });
}

function logCandidateLookupChunk({
  chunkIndex,
  chunkSize,
  identitiesRequested,
  platformRegion,
  rowsReturned,
  stage,
}) {
  if (rowsReturned === identitiesRequested || stage === "pre_upsert_existing_candidate_lookup") {
    return;
  }

  console.warn("Seed candidate lookup returned fewer rows than requested", {
    chunkIndex,
    chunkSize,
    identitiesRequested,
    platformRegion,
    rowsReturned,
    stage,
  });
}

function shortenPuuid(value) {
  const puuid = String(value ?? "");

  if (puuid.length <= 18) {
    return puuid;
  }

  return `${puuid.slice(0, 8)}...${puuid.slice(-8)}`;
}

function shortenSafeValue(value, limit) {
  const text = String(value ?? "");

  if (text.length <= limit) {
    return text || null;
  }

  return `${text.slice(0, Math.max(limit - 3, 0))}...`;
}

function groupBy(values, getKey) {
  const groups = new Map();

  for (const value of values) {
    const key = getKey(value);
    const group = groups.get(key) ?? [];

    group.push(value);
    groups.set(key, group);
  }

  return groups;
}

function chunkArray(values, size) {
  const chunks = [];

  for (let index = 0; index < values.length; index += size) {
    chunks.push(values.slice(index, index + size));
  }

  return chunks;
}

function uniqueValues(values) {
  return Array.from(new Set(values.map((value) => String(value).trim()).filter(Boolean)));
}

function logDatabaseError(label, error, context = null) {
  console.error(label, {
    code: error.code,
    details: error.details,
    hint: error.hint,
    message: error.message,
    status: error.status,
    ...(context ?? {}),
  });
}
