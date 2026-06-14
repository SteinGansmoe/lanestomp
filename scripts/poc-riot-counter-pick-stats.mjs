import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

import { RiotApiClient } from "./lib/riot-api-client.mjs";
import {
  loadActiveChampionRegistry,
  normalizeChampionIdentifier,
} from "./lib/league-champion-normalizer.mjs";
import {
  createObservationValidationContext,
  validateRoutingConfiguration,
} from "./lib/riot-observation-validation.mjs";
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

if (!supabaseUrl || !serviceRoleKey) {
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
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
  },
});
const championRegistry = await loadActiveChampionRegistry({ supabase });
const validationContext = createObservationValidationContext({
  championRegistry,
});
const routingValidation = validateRoutingConfiguration({
  context: validationContext,
  platformRegion,
  regionalRouting: regionalRoute ?? defaultRegionalRouting,
});

if (!routingValidation.ok) {
  throw new Error(
    `Invalid Riot routing configuration: ${routingValidation.issues
      .map((issue) => issue.code)
      .join(", ")}`,
  );
}
const normalizedTarget = normalizeTarget({
  championRegistry,
  counterChampionId: target.counterChampionId,
  enemyChampionId: target.enemyChampionId,
});

console.log(
  [
    "Starting Riot counter-pick POC",
    `region=${regionalRoute}`,
    `platform=${platformRegion}`,
    `queue=${queue}`,
    `patch=${patch}`,
    `target=${normalizedTarget.counterChampionId} ${target.role} vs ${normalizedTarget.enemyChampionId} ${target.role}`,
    `discover=${isDiscoverMode}`,
    `seedPuuids=${seedPuuids.length}`,
    `matchCountPerSeed=${matchCount}`,
    `dryRun=${isDryRun}`,
  ].join(" | "),
);

const scanResult = await scanRiotCounterPickMatchups({
  championRegistry,
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
  target: normalizedTarget,
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
    `${normalizedTarget.counterChampionId}Wins=${targetResult?.wins ?? 0}`,
    `${normalizedTarget.counterChampionId}Losses=${targetResult?.losses ?? 0}`,
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
  championRegistry,
  observations: scanResult.observations,
  supabase,
  validationContext,
});
const candidatePersistenceResult = await persistSeedCandidatesFromObservations({
  championRegistry,
  observations: scanResult.candidateObservations,
  source: "match_discovery",
  supabase,
  validationContext,
});

console.log(
  [
    "Riot observation persistence complete",
    `observationsFound=${persistenceResult.observationsFound}`,
    `observationsInserted=${persistenceResult.insertedObservations}`,
    `duplicatesSkipped=${persistenceResult.duplicateObservationsSkipped}`,
    `insertFailures=${persistenceResult.insertFailures}`,
    `matchupObservationsValidated=${persistenceResult.matchupObservationsValidated}`,
    `matchupObservationsRejected=${persistenceResult.matchupObservationsRejected}`,
    `statsRowsUpdated=${persistenceResult.statsRowsUpdated}`,
    `counterPickAggregatesValidated=${persistenceResult.counterPickAggregatesValidated}`,
    `counterPickAggregateValidationFailures=${persistenceResult.counterPickAggregateValidationFailures}`,
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
    `candidateObservationsValidated=${candidatePersistenceResult.candidateObservationsValidated}`,
    `candidateObservationsRejected=${candidatePersistenceResult.candidateObservationsRejected}`,
    `candidateProfilesRebuilt=${candidatePersistenceResult.candidateProfilesRebuilt}`,
    `championIdentifiersProcessed=${summary.champion_identifiers_processed ?? 0}`,
    `championIdentifiersNormalized=${summary.champion_identifiers_normalized ?? 0}`,
    `championAliasesResolved=${summary.champion_aliases_resolved ?? 0}`,
    `championNormalizationFailures=${summary.champion_normalization_failures ?? 0}`,
    `championIdentifierConflicts=${summary.champion_identifier_conflicts ?? 0}`,
  ].join(" | "),
);

if (isDiscoverMode) {
  process.exit(0);
}

if (!targetResult || targetResult.games === 0) {
  console.log(
    `No ${normalizedTarget.enemyChampionId} ${target.role} vs ${normalizedTarget.counterChampionId} ${target.role} games found.`,
  );
  process.exit(0);
}

console.log(
  `Aggregated stored observations for ${normalizedTarget.counterChampionId} ${target.role} vs ${normalizedTarget.enemyChampionId} ${target.role} into counter_pick_stats.`,
);

function normalizeTarget({ championRegistry, counterChampionId, enemyChampionId }) {
  const enemyChampion = normalizeChampionIdentifier(enemyChampionId, championRegistry);
  const counterChampion = normalizeChampionIdentifier(counterChampionId, championRegistry);

  if (!enemyChampion || !counterChampion) {
    throw new Error("Target champions could not be resolved against the League champion registry.");
  }

  if (enemyChampion.canonicalKey === counterChampion.canonicalKey) {
    throw new Error("Enemy and counter champion cannot be the same.");
  }

  return {
    counterChampionId: counterChampion.canonicalKey,
    enemyChampionId: enemyChampion.canonicalKey,
    role: target.role,
  };
}

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
  SUPABASE_SERVICE_ROLE_KEY  Required for champion registry reads; --dry-run skips writes
`);
}
