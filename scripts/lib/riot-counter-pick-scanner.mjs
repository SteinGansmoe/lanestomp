export const rankedSoloDuoQueueId = 420;

export const roleToTeamPosition = {
  adc: "BOTTOM",
  jungle: "JUNGLE",
  mid: "MIDDLE",
  support: "UTILITY",
  top: "TOP",
};

export const positionToRole = {
  BOTTOM: "adc",
  JUNGLE: "jungle",
  MIDDLE: "mid",
  TOP: "top",
  UTILITY: "support",
};

export async function scanRiotCounterPickMatchups({
  discover = false,
  logger = null,
  matchCount = 20,
  onProgress = null,
  patch = null,
  platformRegion = "EUW1",
  queue = rankedSoloDuoQueueId,
  regionalRouting = "EUROPE",
  riot,
  role,
  seedPuuids,
  target = null,
}) {
  const normalizedRole = normalizeRole(role);

  if (!riot) {
    throw new Error("Riot API client is required.");
  }

  if (!normalizedRole) {
    throw new Error("Invalid role. Use top, jungle, mid, adc, or support.");
  }

  const uniqueSeedPuuids = uniqueValues(seedPuuids ?? []);

  if (uniqueSeedPuuids.length === 0) {
    throw new Error("Provide at least one seed PUUID.");
  }

  if (!discover && (!target?.enemyChampionId || !target?.counterChampionId)) {
    throw new Error("Target scans require enemy and counter champions.");
  }

  const matchIdResult = await fetchUniqueMatchIds({
    count: matchCount,
    logger,
    onProgress,
    puuids: uniqueSeedPuuids,
    queue,
    riot,
  });
  const matchIds = matchIdResult.uniqueMatchIds;
  const candidateObservations = [];
  const aggregate = {
    candidateDiscoverySkipped: 0,
    candidateObservationsFound: 0,
    championPairMatched: 0,
    discoveryPairs: new Map(),
    fetchedMatchIds: matchIdResult.totalFetched,
    games: 0,
    losses: 0,
    matchesScanned: 0,
    patch,
    patchSkipped: 0,
    queueSkipped: 0,
    role: normalizedRole,
    roleSkipped: 0,
    targetMatches: 0,
    uniqueMatchIds: matchIds.length,
    wins: 0,
  };
  const observations = [];

  await emitProgress(onProgress, getSummary(aggregate));

  for (const matchId of matchIds) {
    const match = await riot.fetchMatch(matchId);
    aggregate.matchesScanned += 1;

    if (patch && getPatchFromMatch(match) !== patch) {
      aggregate.patchSkipped += 1;
      await emitProgress(onProgress, getSummary(aggregate));
      continue;
    }

    if (Number(match?.info?.queueId) !== queue) {
      aggregate.queueSkipped += 1;
      await emitProgress(onProgress, getSummary(aggregate));
      continue;
    }

    const candidateObservationResult = getCandidateObservationsFromMatch({
      match,
      matchId,
      patch: getPatchFromMatch(match),
      platformRegion,
      queue,
      regionalRouting,
    });
    candidateObservations.push(...candidateObservationResult.observations);
    aggregate.candidateDiscoverySkipped += candidateObservationResult.skipped;
    aggregate.candidateObservationsFound = candidateObservations.length;

    const roleMatchups = getRoleMatchups(match, normalizedRole);

    if (roleMatchups.length === 0) {
      aggregate.roleSkipped += 1;
      await emitProgress(onProgress, getSummary(aggregate));
      continue;
    }

    for (const matchup of roleMatchups) {
      const observation = getMatchupObservation({
        match,
        matchId,
        matchup,
        patch: getPatchFromMatch(match),
        queue,
        role: normalizedRole,
      });

      if (observation) {
        observations.push(observation);
      }
    }

    if (discover) {
      roleMatchups.forEach((matchup) => addDiscoveryPair(aggregate.discoveryPairs, matchup));
      aggregate.observationsFound = observations.length;
      await emitProgress(onProgress, getSummary(aggregate));
      continue;
    }

    const result = getTargetMatchupResult(roleMatchups, target);

    if (!result) {
      aggregate.observationsFound = observations.length;
      await emitProgress(onProgress, getSummary(aggregate));
      continue;
    }

    aggregate.championPairMatched += 1;
    aggregate.targetMatches += 1;
    aggregate.games += 1;

    if (result.didCounterWin) {
      aggregate.wins += 1;
    } else {
      aggregate.losses += 1;
    }

    aggregate.observationsFound = observations.length;
    await emitProgress(onProgress, getSummary(aggregate));
  }

  const summary = getSummary(aggregate);
  const targetResult = discover
    ? null
    : getTargetResult({
        aggregate,
        target,
      });

  return {
    discoveryResults: discover
      ? getDiscoveryResults({
          discoveryPairs: aggregate.discoveryPairs,
          role: normalizedRole,
        })
      : [],
    candidateObservations,
    observations,
    summary,
    targetResult,
  };
}

export async function fetchCurrentPatch() {
  const response = await fetch("https://ddragon.leagueoflegends.com/api/versions.json");

  if (!response.ok) {
    throw new Error(`Could not fetch current League patch (${response.status}).`);
  }

  const versions = await response.json();
  const version = Array.isArray(versions) ? versions[0] : null;

  if (typeof version !== "string") {
    throw new Error("Data Dragon did not return a current patch version.");
  }

  const [major, minor] = version.split(".");

  if (!major || !minor) {
    throw new Error(`Could not parse current patch from ${version}.`);
  }

  return `${major}.${minor}`;
}

export function normalizeRole(value) {
  const role = String(value).trim().toLowerCase();

  if (role === "bottom" || role === "bot") {
    return "adc";
  }

  return Object.hasOwn(roleToTeamPosition, role) ? role : null;
}

export function uniqueValues(values) {
  return Array.from(new Set(values.map((value) => String(value).trim()).filter(Boolean)));
}

export function calculateWinRate({ games, wins }) {
  if (games <= 0) {
    return 0;
  }

  return Number(((wins / games) * 100).toFixed(2));
}

export function calculateTier({ games, winRate }) {
  if (games <= 0) {
    return "C";
  }

  if (winRate >= 56) {
    return "S+";
  }

  if (winRate >= 53) {
    return "S";
  }

  if (winRate >= 51) {
    return "A";
  }

  if (winRate >= 49) {
    return "B";
  }

  return "C";
}

export function getPatchFromMatch(match) {
  const gameVersion = String(match?.info?.gameVersion ?? "");
  const [major, minor] = gameVersion.split(".");

  return major && minor ? `${major}.${minor}` : null;
}

export function normalizeChampionKey(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

export function getParticipantRole(participant) {
  const position = String(participant?.teamPosition || participant?.individualPosition || "")
    .trim()
    .toUpperCase();

  return positionToRole[position] ?? null;
}

async function fetchUniqueMatchIds({ count, logger, onProgress, puuids, queue, riot }) {
  const matchIds = new Set();
  let totalFetched = 0;

  for (const puuid of puuids) {
    const ids = await riot.fetchRecentRankedMatchIdsByPuuid({
      count,
      puuid,
      queue,
    });

    if (Array.isArray(ids)) {
      totalFetched += ids.length;
      ids.forEach((id) => matchIds.add(id));
    }

    logger?.log(`Fetched ${Array.isArray(ids) ? ids.length : 0} match IDs for one seed PUUID.`);
    await emitProgress(onProgress, {
      fetchedMatchIds: totalFetched,
      uniqueMatchIds: matchIds.size,
    });
  }

  logger?.log(`Fetched Match IDs: ${totalFetched}`);
  logger?.log(`Unique Match IDs: ${matchIds.size}`);

  return {
    totalFetched,
    uniqueMatchIds: Array.from(matchIds),
  };
}

function getTargetMatchupResult(roleMatchups, target) {
  for (const matchup of roleMatchups) {
    const leftChampionKey = normalizeChampionKey(matchup.left.championName);
    const rightChampionKey = normalizeChampionKey(matchup.right.championName);
    const enemyChampionKey = normalizeChampionKey(target.enemyChampionId);
    const counterChampionKey = normalizeChampionKey(target.counterChampionId);
    const isLeftTarget =
      leftChampionKey === counterChampionKey && rightChampionKey === enemyChampionKey;
    const isRightTarget =
      rightChampionKey === counterChampionKey && leftChampionKey === enemyChampionKey;

    if (isLeftTarget) {
      return {
        didCounterWin: Boolean(matchup.left.win),
      };
    }

    if (isRightTarget) {
      return {
        didCounterWin: Boolean(matchup.right.win),
      };
    }
  }

  return null;
}

function getRoleMatchups(match, role) {
  const participants = match?.info?.participants;

  if (!Array.isArray(participants)) {
    return [];
  }

  const teamPosition = roleToTeamPosition[role];
  const roleParticipants = participants.filter(
    (participant) =>
      participant.teamPosition === teamPosition || participant.individualPosition === teamPosition,
  );
  const participantsByTeam = new Map(
    roleParticipants.map((participant) => [participant.teamId, participant]),
  );

  if (participantsByTeam.size !== 2) {
    return [];
  }

  const [left, right] = Array.from(participantsByTeam.values());

  return [
    {
      left,
      right,
    },
  ];
}

function getCandidateObservationsFromMatch({
  match,
  matchId,
  patch,
  platformRegion,
  queue,
  regionalRouting,
}) {
  const participants = match?.info?.participants;

  if (!Array.isArray(participants)) {
    return {
      observations: [],
      skipped: 0,
    };
  }

  const observations = [];
  const seenPuuids = new Set();
  const gameStartTimestamp = Number(match?.info?.gameStartTimestamp);
  const gameDurationSeconds = Number(match?.info?.gameDuration);
  let skipped = 0;

  for (const participant of participants) {
    const puuid = typeof participant?.puuid === "string" ? participant.puuid.trim() : "";
    const champion =
      typeof participant?.championName === "string" ? participant.championName.trim() : "";
    const role = getParticipantRole(participant);

    if (!puuid || !champion || !role || seenPuuids.has(puuid)) {
      skipped += 1;
      continue;
    }

    seenPuuids.add(puuid);
    observations.push({
      champion,
      game_duration_seconds: Number.isFinite(gameDurationSeconds) ? gameDurationSeconds : null,
      game_start_at: Number.isFinite(gameStartTimestamp)
        ? new Date(gameStartTimestamp).toISOString()
        : null,
      match_id: matchId,
      patch,
      platform_region: platformRegion,
      puuid,
      queue_id: queue,
      regional_routing: regionalRouting,
      role,
      won: Boolean(participant.win),
    });
  }

  return {
    observations,
    skipped,
  };
}

function addDiscoveryPair(discoveryPairs, matchup) {
  const champions = [matchup.left.championName, matchup.right.championName].sort((left, right) =>
    left.localeCompare(right),
  );
  const championAKey = normalizeChampionKey(champions[0]);
  const championBKey = normalizeChampionKey(champions[1]);
  const key = `${championAKey}::${championBKey}`;
  const championAParticipant =
    normalizeChampionKey(matchup.left.championName) === championAKey ? matchup.left : matchup.right;
  const championBParticipant = championAParticipant === matchup.left ? matchup.right : matchup.left;
  const currentPair = discoveryPairs.get(key) ?? {
    championA: champions[0],
    championAWins: 0,
    championB: champions[1],
    championBWins: 0,
    games: 0,
  };

  currentPair.games += 1;

  if (championAParticipant.win) {
    currentPair.championAWins += 1;
  } else if (championBParticipant.win) {
    currentPair.championBWins += 1;
  }

  discoveryPairs.set(key, currentPair);
}

function getMatchupObservation({ match, matchId, matchup, patch, queue, role }) {
  const leftChampion = matchup.left.championName;
  const rightChampion = matchup.right.championName;

  if (
    !leftChampion ||
    !rightChampion ||
    normalizeChampionKey(leftChampion) === normalizeChampionKey(rightChampion)
  ) {
    return null;
  }

  const orderedParticipants = [matchup.left, matchup.right].sort((left, right) => {
    const leftKey = normalizeChampionKey(left.championName);
    const rightKey = normalizeChampionKey(right.championName);
    const keyOrder = leftKey.localeCompare(rightKey);

    if (keyOrder !== 0) {
      return keyOrder;
    }

    return String(left.championName).localeCompare(String(right.championName));
  });
  const [championA, championB] = orderedParticipants;
  const championAWon = Boolean(championA.win);
  const winnerChampion = championAWon ? championA.championName : championB.championName;
  const gameStartTimestamp = Number(match?.info?.gameStartTimestamp);
  const gameDurationSeconds = Number(match?.info?.gameDuration);

  return {
    champion_a: championA.championName,
    champion_a_puuid: championA.puuid ?? null,
    champion_a_tier: null,
    champion_a_won: championAWon,
    champion_b: championB.championName,
    champion_b_puuid: championB.puuid ?? null,
    champion_b_tier: null,
    game_duration_seconds: Number.isFinite(gameDurationSeconds) ? gameDurationSeconds : null,
    game_start_at: Number.isFinite(gameStartTimestamp)
      ? new Date(gameStartTimestamp).toISOString()
      : null,
    match_id: matchId,
    patch,
    queue_id: queue,
    rank_bracket: null,
    role,
    winner_champion: winnerChampion,
  };
}

function getDiscoveryResults({ discoveryPairs, role }) {
  return Array.from(discoveryPairs.values())
    .map((pair) => ({
      championA: pair.championA,
      championAWins: pair.championAWins,
      championAWinRate: calculateWinRate({
        games: pair.games,
        wins: pair.championAWins,
      }),
      championB: pair.championB,
      championBWins: pair.championBWins,
      championBWinRate: calculateWinRate({
        games: pair.games,
        wins: pair.championBWins,
      }),
      games: pair.games,
      role,
    }))
    .sort((left, right) => {
      if (left.games !== right.games) {
        return right.games - left.games;
      }

      return `${left.championA} ${left.championB}`.localeCompare(
        `${right.championA} ${right.championB}`,
      );
    });
}

function getTargetResult({ aggregate, target }) {
  const winRate = calculateWinRate({
    games: aggregate.games,
    wins: aggregate.wins,
  });

  return {
    counterChampion: target.counterChampionId,
    enemyChampion: target.enemyChampionId,
    games: aggregate.games,
    losses: aggregate.losses,
    role: aggregate.role,
    tier: calculateTier({
      games: aggregate.games,
      winRate,
    }),
    wasWrittenToStats: false,
    winRate,
    wins: aggregate.wins,
  };
}

function getSummary(aggregate) {
  return {
    candidateDiscoverySkipped: aggregate.candidateDiscoverySkipped ?? 0,
    candidateObservationsFound: aggregate.candidateObservationsFound ?? 0,
    championPairMatched: aggregate.championPairMatched,
    fetchedMatchIds: aggregate.fetchedMatchIds,
    games: aggregate.games,
    losses: aggregate.losses,
    matchesScanned: aggregate.matchesScanned,
    patch: aggregate.patch,
    patchSkipped: aggregate.patchSkipped,
    queueSkipped: aggregate.queueSkipped,
    role: aggregate.role,
    roleSkipped: aggregate.roleSkipped,
    targetMatches: aggregate.targetMatches,
    uniqueMatchIds: aggregate.uniqueMatchIds,
    observationsFound: aggregate.observationsFound ?? 0,
    matchupPairsDiscovered: aggregate.discoveryPairs.size,
    wins: aggregate.wins,
  };
}

async function emitProgress(onProgress, progress) {
  if (!onProgress) {
    return;
  }

  await onProgress(progress);
}
