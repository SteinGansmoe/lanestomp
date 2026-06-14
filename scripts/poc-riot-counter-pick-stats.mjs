import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

import { RiotApiClient } from "./lib/riot-api-client.mjs";
import { persistObservationsAndRebuildStats } from "./lib/riot-counter-pick-aggregation.mjs";
import {
  fetchCurrentPatch,
  normalizeRole,
  rankedSoloDuoQueueId,
  scanRiotCounterPickMatchups,
  uniqueValues,
} from "./lib/riot-counter-pick-scanner.mjs";
import {
  defaultPlatformRegion,
  defaultRegionalRouting,
  persistSeedCandidatesFromObservations,
} from "./lib/riot-seed-candidates.mjs";

const defaultRegionalRoute = "europe";
const defaultMatchCount = 20;
const defaultTarget = {
  counterChampionId: "Yasuo",
  enemyChampionId: "Ahri",
  role: "mid",
};

loadEnvFile(".env.local");

const args = process.argv.slice(2);

if (args.includes("--help")) {
  printHelp();
  process.exit(0);
}

const isDryRun = args.includes("--dry-run") || process.env.npm_config_dry_run === "true";
const isDiscoverMode = args.includes("--discover");
const regionalRoute =
  getArgValue("--region") ?? process.env.RIOT_REGIONAL_ROUTING ?? defaultRegionalRoute;
const platformRegion =
  getArgValue("--platform") ?? process.env.RIOT_PLATFORM_REGION ?? defaultPlatformRegion;
const matchCount = Number(
  getArgValue("--count") ?? process.env.RIOT_POC_MATCH_COUNT ?? defaultMatchCount,
);
const queue = Number(getArgValue("--queue") ?? process.env.RIOT_QUEUE_ID ?? rankedSoloDuoQueueId);
const requestDelayMs = Number(
  getArgValue("--delay-ms") ?? process.env.RIOT_REQUEST_DELAY_MS ?? 1200,
);
const target = {
  counterChampionId:
    getArgValue("--counter") ?? process.env.RIOT_POC_COUNTER ?? defaultTarget.counterChampionId,
  enemyChampionId:
    getArgValue("--enemy") ?? process.env.RIOT_POC_ENEMY ?? defaultTarget.enemyChampionId,
  role: normalizeRole(getArgValue("--role") ?? process.env.RIOT_POC_ROLE ?? defaultTarget.role),
};
const seedPuuids = uniqueValues([
  ...getArgValues("--seed-puuid"),
  ...(process.env.RIOT_POC_SEED_PUUIDS ?? "").split(","),
  ...(process.env.RIOT_SEED_PUUIDS ?? "").split(","),
]);
const requestedPatch = getArgValue("--patch") ?? process.env.RIOT_POC_PATCH ?? null;

const riotApiKey = process.env.RIOT_API_KEY;
const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!riotApiKey) {
  throw new Error("Missing RIOT_API_KEY.");
}

if (!isDryRun && (!supabaseUrl || !serviceRoleKey)) {
  throw new Error(
    "Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL, plus SUPABASE_SERVICE_ROLE_KEY.",
  );
}

if (seedPuuids.length === 0) {
  throw new Error("Provide at least one --seed-puuid value or RIOT_POC_SEED_PUUIDS.");
}

if (!target.role) {
  throw new Error("Invalid role. Use top, jungle, mid, adc, or support.");
}

const patch = requestedPatch ?? (await fetchCurrentPatch());
const riot = new RiotApiClient({
  apiKey: riotApiKey,
  regionalRoute,
  requestDelayMs,
});
const supabase = isDryRun
  ? null
  : createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
      },
    });

console.log(
  [
    "Starting Riot counter-pick POC",
    `region=${regionalRoute}`,
    `platform=${platformRegion}`,
    `queue=${queue}`,
    `patch=${patch}`,
    `target=${target.counterChampionId} ${target.role} vs ${target.enemyChampionId} ${target.role}`,
    `discover=${isDiscoverMode}`,
    `seedPuuids=${seedPuuids.length}`,
    `matchCountPerSeed=${matchCount}`,
    `dryRun=${isDryRun}`,
  ].join(" | "),
);

const scanResult = await scanRiotCounterPickMatchups({
  discover: isDiscoverMode,
  logger: console,
  matchCount,
  patch,
  platformRegion,
  queue,
  regionalRouting: regionalRoute ?? defaultRegionalRouting,
  riot,
  role: target.role,
  seedPuuids,
  target,
});
const summary = scanResult.summary;
const targetResult = scanResult.targetResult;

console.log(
  [
    "Riot POC scan complete",
    `totalMatchIds=${summary.fetchedMatchIds}`,
    `uniqueMatchIds=${summary.uniqueMatchIds}`,
    `matchesScanned=${summary.matchesScanned}`,
    `patchSkipped=${summary.patchSkipped}`,
    `queueSkipped=${summary.queueSkipped}`,
    `roleSkipped=${summary.roleSkipped}`,
    `championPairMatched=${summary.championPairMatched}`,
    `games=${targetResult?.games ?? 0}`,
    `${target.counterChampionId}Wins=${targetResult?.wins ?? 0}`,
    `${target.counterChampionId}Losses=${targetResult?.losses ?? 0}`,
    `winRate=${targetResult?.winRate ?? 0}%`,
    `tier=${targetResult?.tier ?? "C"}`,
  ].join(" | "),
);

if (isDiscoverMode) {
  printDiscoveryPairs(scanResult.discoveryResults);
}

if (isDryRun) {
  console.log("Dry run enabled. Skipping observation persistence and stats aggregation.");
  process.exit(0);
}

if (!supabase) {
  throw new Error("Supabase client was not initialized.");
}

const persistenceResult = await persistObservationsAndRebuildStats({
  observations: scanResult.observations,
  supabase,
});
const candidatePersistenceResult = await persistSeedCandidatesFromObservations({
  observations: scanResult.candidateObservations,
  source: "match_discovery",
  supabase,
});

console.log(
  [
    "Riot observation persistence complete",
    `observationsFound=${persistenceResult.observationsFound}`,
    `observationsInserted=${persistenceResult.insertedObservations}`,
    `duplicatesSkipped=${persistenceResult.duplicateObservationsSkipped}`,
    `insertFailures=${persistenceResult.insertFailures}`,
    `statsRowsUpdated=${persistenceResult.statsRowsUpdated}`,
    `participantPuuidsObserved=${candidatePersistenceResult.participantPuuidsObserved}`,
    `uniqueCandidatesEncountered=${candidatePersistenceResult.uniqueCandidatesEncountered}`,
    `newCandidatesCreated=${candidatePersistenceResult.newCandidatesCreated}`,
    `existingCandidatesUpdated=${candidatePersistenceResult.existingCandidatesUpdated}`,
    `candidateIdsResolved=${candidatePersistenceResult.candidateIdsResolved}`,
    `candidateUniqueIdResolutionFailures=${candidatePersistenceResult.candidateUniqueIdResolutionFailures}`,
    `candidateObservationResolutionFailures=${candidatePersistenceResult.candidateObservationResolutionFailures}`,
    `candidateIdResolutionFailures=${candidatePersistenceResult.candidateIdResolutionFailures}`,
    `candidateIdLookupChunks=${candidatePersistenceResult.candidateIdLookupChunks}`,
    `candidateIdLookupChunkFailures=${candidatePersistenceResult.candidateIdLookupChunkFailures}`,
    `candidateObservationsInserted=${candidatePersistenceResult.candidateObservationsInserted}`,
    `candidateProfilesRebuilt=${candidatePersistenceResult.candidateProfilesRebuilt}`,
  ].join(" | "),
);

if (isDiscoverMode) {
  process.exit(0);
}

if (!targetResult || targetResult.games === 0) {
  console.log(
    `No ${target.enemyChampionId} ${target.role} vs ${target.counterChampionId} ${target.role} games found.`,
  );
  process.exit(0);
}

console.log(
  `Aggregated stored observations for ${target.counterChampionId} ${target.role} vs ${target.enemyChampionId} ${target.role} into counter_pick_stats.`,
);

function printDiscoveryPairs(discoveryResults) {
  console.log("Most common matchup pairs:");

  if (discoveryResults.length === 0) {
    console.log("No role matchup pairs found.");
    return;
  }

  discoveryResults.slice(0, 20).forEach((pair) => {
    console.log(
      `${pair.championA} vs ${pair.championB} (${pair.games}) | ${pair.championA} ${pair.championAWins}-${pair.championBWins} ${pair.championB}`,
    );
  });
}

function getArgValue(name) {
  const index = args.indexOf(name);

  if (index === -1) {
    return null;
  }

  const value = args[index + 1];

  return value && !value.startsWith("--") ? value : null;
}

function getArgValues(name) {
  const values = [];

  for (let index = 0; index < args.length; index += 1) {
    if (args[index] !== name) {
      continue;
    }

    const value = args[index + 1];

    if (value && !value.startsWith("--")) {
      values.push(value);
    }
  }

  return values;
}

function loadEnvFile(fileName) {
  const filePath = resolve(process.cwd(), fileName);

  if (!existsSync(filePath)) {
    return;
  }

  const entries = readFileSync(filePath, "utf8").split(/\r?\n/);

  for (const entry of entries) {
    const trimmedEntry = entry.trim();

    if (!trimmedEntry || trimmedEntry.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmedEntry.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmedEntry.slice(0, separatorIndex).trim();
    const value = trimmedEntry.slice(separatorIndex + 1).trim();

    if (!key || process.env[key]) {
      continue;
    }

    process.env[key] = value.replace(/^["']|["']$/g, "");
  }
}

function printHelp() {
  console.log(`Riot Match Data Proof of Concept

Scans recent ranked EUW/Europe match data for a target counter matchup and
upserts the aggregate into counter_pick_stats.

Usage:
  npm run poc:riot-counter-pick -- --seed-puuid <PUUID> [--seed-puuid <PUUID>] [--enemy Ahri] [--counter Yasuo] [--role mid] [--count 20] [--patch 15.12] [--platform EUW1] [--dry-run]
  npm run poc:riot-counter-pick -- --discover --seed-puuid <PUUID> [--role mid] [--count 50]

Environment:
  RIOT_API_KEY                Riot API key
  RIOT_POC_SEED_PUUIDS       Comma-separated seed PUUIDs
  RIOT_POC_ENEMY             Defaults to Ahri
  RIOT_POC_COUNTER           Defaults to Yasuo
  RIOT_POC_ROLE              Defaults to mid
  RIOT_PLATFORM_REGION       Defaults to EUW1
  RIOT_REGIONAL_ROUTING      Defaults to europe
  RIOT_REQUEST_DELAY_MS      Defaults to 1200
  SUPABASE_SERVICE_ROLE_KEY  Required unless --dry-run exits before upsert
`);
}
