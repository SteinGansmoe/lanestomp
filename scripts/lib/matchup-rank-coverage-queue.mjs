import {
  defaultPlatformRegion,
  defaultRegionalRouting,
  normalizePlatformRegion,
  normalizeRegionalRouting,
  upsertSeedCandidatesFromPuuids,
} from "./riot-seed-candidates.mjs";

export const matchupRankCoverageSeedSource = "matchup_rank_coverage";
export const defaultMatchupRankCoverageLimit = 20;
export const maxMatchupRankCoverageLimit = 20;
export const maxMatchupRankCoverageObservationRows = 5000;
export const recentRankRefreshHours = 24;
export const recentRankRefreshMs = recentRankRefreshHours * 60 * 60 * 1000;
export const matchupRankCoverageSorts = [
  "priority_score",
  "observations_affected",
  "unknown_observations_affected",
  "two_player_upgrade_potential",
  "latest_match_seen_at",
  "last_rank_refresh_at",
];

const coverageObservationSelect = [
  "id",
  "match_id",
  "patch",
  "role",
  "champion_a",
  "champion_a_puuid",
  "champion_b",
  "champion_b_puuid",
  "game_start_at",
  "rank_attribution_method",
  "champion_a_rank_score",
  "champion_a_rank_snapshot_id",
  "champion_b_rank_score",
  "champion_b_rank_snapshot_id",
].join(", ");

const coverageCandidateSelect = [
  "id",
  "puuid",
  "platform_region",
  "rank_enrichment_status",
  "rank_last_attempted_at",
  "rank_last_success_at",
  "rank_next_eligible_at",
  "rank_tier",
  "rank_division",
  "rank_league_points",
].join(", ");

export function calculateMatchupRankCoveragePriorityScore({
  twoPlayerUpgradePotential,
  unknownObservationsAffected,
}) {
  return Number(unknownObservationsAffected ?? 0) + Number(twoPlayerUpgradePotential ?? 0) * 2;
}

export function getMatchupRankCoverageIdentity({ platformRegion, puuid }) {
  return `${normalizePlatformRegion(platformRegion)}:${String(puuid ?? "").trim()}`;
}

export function getSafePuuidPreview(puuid) {
  const normalized = String(puuid ?? "").trim();

  if (normalized.length <= 12) {
    return normalized || "unknown";
  }

  return `${normalized.slice(0, 6)}...${normalized.slice(-4)}`;
}

export function getProjectedMatchupRankCoverageImpact(candidates) {
  return (candidates ?? []).reduce(
    (projection, candidate) => ({
      observationsAffected:
        projection.observationsAffected + Number(candidate.observationsAffected ?? 0),
      twoPlayerUpgradePotential:
        projection.twoPlayerUpgradePotential + Number(candidate.twoPlayerUpgradePotential ?? 0),
      unknownObservationsAffected:
        projection.unknownObservationsAffected + Number(candidate.unknownObservationsAffected ?? 0),
    }),
    {
      observationsAffected: 0,
      twoPlayerUpgradePotential: 0,
      unknownObservationsAffected: 0,
    },
  );
}

export async function loadMatchupRankCoverageQueue({
  filters = {},
  limit = defaultMatchupRankCoverageLimit,
  now = new Date(),
  repository,
  sort = "priority_score",
  sortDirection = "desc",
} = {}) {
  const observations = await repository.fetchCoverageObservations({
    filters,
    limit: maxMatchupRankCoverageObservationRows,
  });
  const identities = getCoverageParticipantIdentities(observations);
  const candidates = await repository.fetchSeedCandidatesByIdentities(identities);
  const queue = buildMatchupRankCoverageQueue({
    candidates,
    filters,
    limit,
    now,
    observations,
    sort,
    sortDirection,
  });

  return {
    candidates: queue.candidates,
    projectedImpact: getProjectedMatchupRankCoverageImpact(queue.candidates),
    summary: getMatchupRankCoverageSummary(observations),
  };
}

export function buildMatchupRankCoverageQueue({
  candidates = [],
  filters = {},
  limit = defaultMatchupRankCoverageLimit,
  now = new Date(),
  observations = [],
  sort = "priority_score",
  sortDirection = "desc",
} = {}) {
  const candidatesByIdentity = new Map(
    (candidates ?? []).map((candidate) => [getMatchupRankCoverageIdentity(candidate), candidate]),
  );
  const rowsByIdentity = new Map();

  for (const observation of observations ?? []) {
    if (!matchesObservationFilters(observation, filters)) {
      continue;
    }

    for (const participant of getMissingRankParticipants(observation)) {
      const identityKey = getMatchupRankCoverageIdentity(participant);
      const current = rowsByIdentity.get(identityKey) ?? createCoverageCandidateBase(participant);

      current.observationsAffected += 1;
      current.latestMatchSeenAt = getLatestTimestamp([
        current.latestMatchSeenAt,
        observation.game_start_at,
      ]);
      current.rolesSet.add(observation.role);
      current.championsSet.add(participant.champion);
      current.patchesSet.add(observation.patch);

      if (observation.rank_attribution_method === "unknown") {
        current.unknownObservationsAffected += 1;
      }

      if (observation.rank_attribution_method === "single-player") {
        current.twoPlayerUpgradePotential += 1;
      }

      if (current.affectedMatchups.length < 5) {
        current.affectedMatchups.push({
          championA: observation.champion_a,
          championB: observation.champion_b,
          matchIdPreview: getSafePuuidPreview(observation.match_id),
          method: observation.rank_attribution_method,
          patch: observation.patch,
          role: observation.role,
        });
      }

      rowsByIdentity.set(identityKey, current);
    }
  }

  const normalizedLimit = normalizeCoverageLimit(limit);
  const enrichedRows = Array.from(rowsByIdentity.values()).map((row) => {
    const candidate = candidatesByIdentity.get(row.identityKey) ?? null;
    const cooldownActive = isCoverageCandidateCooldownActive(candidate, now);
    const priorityScore = calculateMatchupRankCoveragePriorityScore(row);

    return {
      affectedMatchups: row.affectedMatchups,
      candidateId: candidate?.id ?? null,
      champions: Array.from(row.championsSet).sort(),
      cooldownActive,
      existingCandidate: Boolean(candidate),
      identityKey: row.identityKey,
      isEligibleForRefresh: !cooldownActive,
      lastRankAttemptAt: candidate?.rank_last_attempted_at ?? null,
      lastRankRefreshAt: candidate?.rank_last_success_at ?? null,
      latestMatchSeenAt: row.latestMatchSeenAt,
      nextEligibleAt: candidate?.rank_next_eligible_at ?? null,
      observationsAffected: row.observationsAffected,
      platformRegion: row.platformRegion,
      priorityScore,
      puuid: row.puuid,
      puuidPreview: getSafePuuidPreview(row.puuid),
      rankDivision: candidate?.rank_division ?? null,
      rankLeaguePoints: candidate?.rank_league_points ?? null,
      rankStatus: candidate?.rank_enrichment_status ?? "never_enriched",
      rankTier: candidate?.rank_tier ?? null,
      roles: Array.from(row.rolesSet).sort(),
      sortPriorityScore: cooldownActive ? -1 : priorityScore,
      twoPlayerUpgradePotential: row.twoPlayerUpgradePotential,
      unknownObservationsAffected: row.unknownObservationsAffected,
    };
  });
  const filteredRows = enrichedRows.filter((row) => matchesCoverageCandidateFilters(row, filters));

  return {
    candidates: sortMatchupRankCoverageCandidates(filteredRows, { sort, sortDirection }).slice(
      0,
      normalizedLimit,
    ),
  };
}

export function getMatchupRankCoverageSummary(observations) {
  const rows = observations ?? [];
  const totalObservations = rows.length;
  const twoPlayerAverage = rows.filter(
    (observation) => observation.rank_attribution_method === "two-player-average",
  ).length;
  const singlePlayer = rows.filter(
    (observation) => observation.rank_attribution_method === "single-player",
  ).length;
  const unknown = rows.filter(
    (observation) => observation.rank_attribution_method === "unknown",
  ).length;

  return {
    anyRankCoveragePercent: getPercent(twoPlayerAverage + singlePlayer, totalObservations),
    singlePlayer,
    strictCoveragePercent: getPercent(twoPlayerAverage, totalObservations),
    totalObservations,
    twoPlayerAverage,
    unknown,
  };
}

export function sortMatchupRankCoverageCandidates(
  candidates,
  { sort = "priority_score", sortDirection = "desc" } = {},
) {
  const direction = sortDirection === "asc" ? 1 : -1;
  const normalizedSort = matchupRankCoverageSorts.includes(sort) ? sort : "priority_score";

  return [...(candidates ?? [])].sort((left, right) => {
    const primary = compareCoverageSortValue(left, right, normalizedSort);

    if (primary !== 0) {
      return primary * direction;
    }

    for (const tieBreaker of [
      "two_player_upgrade_potential",
      "unknown_observations_affected",
      "latest_match_seen_at",
    ]) {
      const tie = compareCoverageSortValue(left, right, tieBreaker);

      if (tie !== 0) {
        return tie * -1;
      }
    }

    return left.identityKey.localeCompare(right.identityKey);
  });
}

export async function ensureMatchupRankCoverageCandidates({ participants, repository } = {}) {
  const uniqueParticipants = dedupeCoverageParticipants(participants ?? []);
  const existingCandidates = await repository.fetchSeedCandidatesByIdentities(uniqueParticipants);
  const existingByIdentity = new Map(
    existingCandidates.map((candidate) => [getMatchupRankCoverageIdentity(candidate), candidate]),
  );
  const missingParticipants = uniqueParticipants.filter(
    (participant) => !existingByIdentity.has(getMatchupRankCoverageIdentity(participant)),
  );
  let createdCount = 0;
  let candidatesByIdentity = existingByIdentity;

  if (missingParticipants.length > 0) {
    const createdCandidates =
      await repository.createSeedCandidatesForParticipants(missingParticipants);
    createdCount = createdCandidates.newCandidatesCreated ?? 0;
    const refreshedCandidates =
      await repository.fetchSeedCandidatesByIdentities(uniqueParticipants);
    candidatesByIdentity = new Map(
      refreshedCandidates.map((candidate) => [
        getMatchupRankCoverageIdentity(candidate),
        candidate,
      ]),
    );
  }

  return {
    candidateIds: uniqueParticipants
      .map(
        (participant) => candidatesByIdentity.get(getMatchupRankCoverageIdentity(participant))?.id,
      )
      .filter(Boolean),
    candidatesByIdentity,
    createdCount,
    existingCount: uniqueParticipants.length - missingParticipants.length,
    requestedCount: uniqueParticipants.length,
  };
}

export function createSupabaseMatchupRankCoverageRepository(supabase) {
  return {
    async createSeedCandidatesForParticipants(participants) {
      const groupedByPlatform = groupBy(
        dedupeCoverageParticipants(participants),
        (participant) => participant.platformRegion,
      );
      let existingCandidatesUpdated = 0;
      let newCandidatesCreated = 0;

      for (const [platformRegion, platformParticipants] of groupedByPlatform) {
        const result = await upsertSeedCandidatesFromPuuids({
          platformRegion,
          puuids: platformParticipants.map((participant) => participant.puuid),
          regionalRouting: getRegionalRoutingForPlatform(platformRegion),
          source: matchupRankCoverageSeedSource,
          supabase,
        });

        existingCandidatesUpdated += result.existingCandidatesUpdated ?? 0;
        newCandidatesCreated += result.newCandidatesCreated ?? 0;
      }

      return {
        existingCandidatesUpdated,
        newCandidatesCreated,
      };
    },

    async fetchCoverageObservations({
      filters = {},
      limit = maxMatchupRankCoverageObservationRows,
    } = {}) {
      let query = supabase
        .from("riot_matchup_observations")
        .select(coverageObservationSelect)
        .order("game_start_at", { ascending: false, nullsFirst: false })
        .limit(
          Math.min(Math.max(Number(limit) || maxMatchupRankCoverageObservationRows, 1), 10000),
        );

      if (filters.patch) {
        query = query.eq("patch", filters.patch);
      }

      if (filters.role && filters.role !== "all") {
        query = query.eq("role", filters.role);
      }

      if (filters.champion) {
        query = query.or(`champion_a.eq.${filters.champion},champion_b.eq.${filters.champion}`);
      }

      if (filters.attributionMethod && filters.attributionMethod !== "all") {
        query = query.eq("rank_attribution_method", filters.attributionMethod);
      } else {
        query = query.in("rank_attribution_method", [
          "unknown",
          "single-player",
          "two-player-average",
        ]);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Matchup rank coverage observation query failed: ${error.message}`);
      }

      return (data ?? []).filter((observation) => matchesObservationFilters(observation, filters));
    },

    async fetchSeedCandidatesByIdentities(participants) {
      const uniqueParticipants = dedupeCoverageParticipants(participants);
      const candidates = [];
      const groupedByPlatform = groupBy(
        uniqueParticipants,
        (participant) => participant.platformRegion,
      );

      for (const [platformRegion, platformParticipants] of groupedByPlatform) {
        for (const puuidChunk of chunkArray(
          platformParticipants.map((participant) => participant.puuid),
          25,
        )) {
          const { data, error } = await supabase
            .from("riot_seed_candidates")
            .select(coverageCandidateSelect)
            .eq("platform_region", platformRegion)
            .in("puuid", puuidChunk);

          if (error) {
            throw new Error(`Matchup rank coverage candidate lookup failed: ${error.message}`);
          }

          candidates.push(...(data ?? []));
        }
      }

      return candidates;
    },
  };
}

function getCoverageParticipantIdentities(observations) {
  const identities = [];

  for (const observation of observations ?? []) {
    for (const participant of getMissingRankParticipants(observation)) {
      identities.push(participant);
    }
  }

  return dedupeCoverageParticipants(identities);
}

function getMissingRankParticipants(observation) {
  const participants = [];
  const platformRegion = getObservationPlatformRegion(observation);

  if (isMissingRankSide(observation, "a")) {
    participants.push({
      champion: observation.champion_a,
      platformRegion,
      puuid: observation.champion_a_puuid,
    });
  }

  if (isMissingRankSide(observation, "b")) {
    participants.push({
      champion: observation.champion_b,
      platformRegion,
      puuid: observation.champion_b_puuid,
    });
  }

  return participants.filter((participant) => String(participant.puuid ?? "").trim());
}

function isMissingRankSide(observation, side) {
  const method = observation.rank_attribution_method;

  if (method === "unknown") {
    return true;
  }

  if (method !== "single-player") {
    return false;
  }

  const score =
    side === "a" ? observation.champion_a_rank_score : observation.champion_b_rank_score;
  const snapshotId =
    side === "a"
      ? observation.champion_a_rank_snapshot_id
      : observation.champion_b_rank_snapshot_id;

  return score === null && !snapshotId;
}

function createCoverageCandidateBase(participant) {
  const platformRegion = normalizePlatformRegion(participant.platformRegion);
  const puuid = String(participant.puuid ?? "").trim();

  return {
    affectedMatchups: [],
    championsSet: new Set(),
    identityKey: getMatchupRankCoverageIdentity({ platformRegion, puuid }),
    latestMatchSeenAt: null,
    observationsAffected: 0,
    patchesSet: new Set(),
    platformRegion,
    puuid,
    rolesSet: new Set(),
    twoPlayerUpgradePotential: 0,
    unknownObservationsAffected: 0,
  };
}

function matchesObservationFilters(observation, filters) {
  if (filters.platformRegion) {
    const platformRegion = normalizePlatformRegion(filters.platformRegion);

    if (getObservationPlatformRegion(observation) !== platformRegion) {
      return false;
    }
  }

  if (filters.patch && observation.patch !== filters.patch) {
    return false;
  }

  if (filters.role && filters.role !== "all" && observation.role !== filters.role) {
    return false;
  }

  if (
    filters.champion &&
    observation.champion_a !== filters.champion &&
    observation.champion_b !== filters.champion
  ) {
    return false;
  }

  if (
    filters.attributionMethod &&
    filters.attributionMethod !== "all" &&
    observation.rank_attribution_method !== filters.attributionMethod
  ) {
    return false;
  }

  return true;
}

function matchesCoverageCandidateFilters(candidate, filters) {
  if (
    filters.minimumImpact &&
    candidate.priorityScore < Math.max(Number(filters.minimumImpact) || 0, 0)
  ) {
    return false;
  }

  if (
    filters.minimumObservationsAffected &&
    candidate.observationsAffected < Math.max(Number(filters.minimumObservationsAffected) || 0, 0)
  ) {
    return false;
  }

  if (filters.twoPlayerUpgradeOnly && candidate.twoPlayerUpgradePotential <= 0) {
    return false;
  }

  if (filters.hasCandidate === "yes" && !candidate.existingCandidate) {
    return false;
  }

  if (filters.hasCandidate === "no" && candidate.existingCandidate) {
    return false;
  }

  if (
    filters.rankStatus &&
    filters.rankStatus !== "all" &&
    candidate.rankStatus !== filters.rankStatus
  ) {
    return false;
  }

  if (!matchesLastRefreshFilter(candidate.lastRankRefreshAt, filters.lastRankRefresh)) {
    return false;
  }

  return true;
}

function matchesLastRefreshFilter(value, filter) {
  if (!filter || filter === "all") {
    return true;
  }

  if (filter === "never") {
    return !value;
  }

  const timestamp = new Date(value ?? 0).getTime();
  const recentCutoff = Date.now() - recentRankRefreshMs;

  if (!Number.isFinite(timestamp)) {
    return filter === "older";
  }

  if (filter === "recent") {
    return timestamp >= recentCutoff;
  }

  if (filter === "older") {
    return timestamp < recentCutoff;
  }

  return true;
}

function isCoverageCandidateCooldownActive(candidate, now) {
  if (!candidate?.rank_next_eligible_at) {
    return false;
  }

  if (!["ranked", "unranked", "not_found"].includes(candidate.rank_enrichment_status)) {
    return false;
  }

  const nextEligibleMs = new Date(candidate.rank_next_eligible_at).getTime();

  return Number.isFinite(nextEligibleMs) && nextEligibleMs > now.getTime();
}

function compareCoverageSortValue(left, right, sort) {
  switch (sort) {
    case "observations_affected":
      return Number(left.observationsAffected) - Number(right.observationsAffected);
    case "unknown_observations_affected":
      return Number(left.unknownObservationsAffected) - Number(right.unknownObservationsAffected);
    case "two_player_upgrade_potential":
      return Number(left.twoPlayerUpgradePotential) - Number(right.twoPlayerUpgradePotential);
    case "latest_match_seen_at":
      return compareNullableDates(left.latestMatchSeenAt, right.latestMatchSeenAt);
    case "last_rank_refresh_at":
      return compareNullableDates(left.lastRankRefreshAt, right.lastRankRefreshAt);
    case "priority_score":
    default:
      return (
        Number(left.sortPriorityScore ?? left.priorityScore) -
        Number(right.sortPriorityScore ?? right.priorityScore)
      );
  }
}

function compareNullableDates(left, right) {
  return new Date(left ?? 0).getTime() - new Date(right ?? 0).getTime();
}

function getObservationPlatformRegion(observation) {
  const matchIdPrefix = String(observation?.match_id ?? "").split("_")[0];

  return normalizePlatformRegion(matchIdPrefix || defaultPlatformRegion);
}

function getRegionalRoutingForPlatform(platformRegion) {
  const normalized = normalizePlatformRegion(platformRegion);

  if (["BR1", "LA1", "LA2", "NA1", "OC1"].includes(normalized)) {
    return "AMERICAS";
  }

  if (["JP1", "KR"].includes(normalized)) {
    return "ASIA";
  }

  if (["ME1", "EUN1", "EUW1", "RU", "TR1"].includes(normalized)) {
    return "EUROPE";
  }

  return normalizeRegionalRouting(defaultRegionalRouting);
}

function getLatestTimestamp(values) {
  const timestamps = (values ?? [])
    .map((value) => {
      const timestamp = new Date(value ?? 0).getTime();

      return Number.isFinite(timestamp) ? timestamp : null;
    })
    .filter((value) => value !== null);

  if (timestamps.length === 0) {
    return null;
  }

  return new Date(Math.max(...timestamps)).toISOString();
}

function getPercent(value, total) {
  if (!total) {
    return 0;
  }

  return Number(((value / total) * 100).toFixed(1));
}

function dedupeCoverageParticipants(participants) {
  const byIdentity = new Map();

  for (const participant of participants ?? []) {
    const puuid = String(participant?.puuid ?? "").trim();

    if (!puuid) {
      continue;
    }

    const platformRegion = normalizePlatformRegion(participant.platformRegion);

    byIdentity.set(getMatchupRankCoverageIdentity({ platformRegion, puuid }), {
      platformRegion,
      puuid,
    });
  }

  return Array.from(byIdentity.values());
}

function normalizeCoverageLimit(value) {
  const limit = Number(value ?? defaultMatchupRankCoverageLimit);

  if (!Number.isInteger(limit) || limit < 1) {
    return defaultMatchupRankCoverageLimit;
  }

  return Math.min(limit, maxMatchupRankCoverageLimit);
}

function groupBy(values, getKey) {
  const groups = new Map();

  for (const value of values ?? []) {
    const key = getKey(value);
    const rows = groups.get(key) ?? [];

    rows.push(value);
    groups.set(key, rows);
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
