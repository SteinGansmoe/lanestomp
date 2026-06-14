import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

import { RiotApiClient } from "./lib/riot-api-client.mjs";

const target = {
  counterChampionId: "Yasuo",
  enemyChampionId: "Ahri",
  role: "mid",
  teamPosition: "MIDDLE",
};
const rankedSoloDuoQueueId = 420;
const defaultRegionalRoute = "europe";
const defaultMatchCount = 20;

loadEnvFile(".env.local");

const args = process.argv.slice(2);

if (args.includes("--help")) {
  printHelp();
  process.exit(0);
}

const isDryRun = args.includes("--dry-run") || process.env.npm_config_dry_run === "true";
const regionalRoute = getArgValue("--region") ?? process.env.RIOT_REGIONAL_ROUTING ?? defaultRegionalRoute;
const matchCount = Number(getArgValue("--count") ?? process.env.RIOT_POC_MATCH_COUNT ?? defaultMatchCount);
const queue = Number(getArgValue("--queue") ?? process.env.RIOT_QUEUE_ID ?? rankedSoloDuoQueueId);
const requestDelayMs = Number(getArgValue("--delay-ms") ?? process.env.RIOT_REQUEST_DELAY_MS ?? 1200);
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
    `queue=${queue}`,
    `patch=${patch}`,
    `target=${target.counterChampionId} ${target.role} vs ${target.enemyChampionId} ${target.role}`,
    `seedPuuids=${seedPuuids.length}`,
    `matchCountPerSeed=${matchCount}`,
    `dryRun=${isDryRun}`,
  ].join(" | "),
);

const matchIds = await fetchUniqueMatchIds(seedPuuids);
const aggregate = {
  games: 0,
  losses: 0,
  patch,
  scannedMatches: 0,
  skippedPatchMatches: 0,
  targetMatches: 0,
  wins: 0,
};

for (const matchId of matchIds) {
  const match = await riot.fetchMatch(matchId);
  aggregate.scannedMatches += 1;

  if (getPatchFromMatch(match) !== patch) {
    aggregate.skippedPatchMatches += 1;
    continue;
  }

  const result = getTargetMatchupResult(match);

  if (!result) {
    continue;
  }

  aggregate.targetMatches += 1;
  aggregate.games += 1;

  if (result.didCounterWin) {
    aggregate.wins += 1;
  } else {
    aggregate.losses += 1;
  }
}

const winRate = calculateWinRate({
  games: aggregate.games,
  wins: aggregate.wins,
});
const tier = calculateTier({
  games: aggregate.games,
  winRate,
});

console.log(
  [
    "Riot POC scan complete",
    `matchIds=${matchIds.length}`,
    `scanned=${aggregate.scannedMatches}`,
    `patchSkipped=${aggregate.skippedPatchMatches}`,
    `matched=${aggregate.targetMatches}`,
    `games=${aggregate.games}`,
    `yasuoWins=${aggregate.wins}`,
    `yasuoLosses=${aggregate.losses}`,
    `winRate=${winRate}%`,
    `tier=${tier}`,
  ].join(" | "),
);

if (aggregate.games === 0) {
  console.log("No Ahri mid vs Yasuo mid games found. Nothing to upsert.");
  process.exit(0);
}

if (isDryRun) {
  console.log("Dry run enabled. Skipping Supabase upsert.");
  process.exit(0);
}

if (!supabase) {
  throw new Error("Supabase client was not initialized.");
}

const { error } = await supabase.from("counter_pick_stats").upsert(
  {
    counter_champion_id: target.counterChampionId,
    enemy_champion_id: target.enemyChampionId,
    games: aggregate.games,
    losses: aggregate.losses,
    patch,
    role: target.role,
    tier,
    win_rate: winRate,
    wins: aggregate.wins,
  },
  {
    onConflict: "enemy_champion_id,counter_champion_id,role,patch",
  },
);

if (error) {
  throw new Error(`Could not upsert Riot POC counter-pick stats: ${error.message}`);
}

console.log(
  `Upserted ${target.counterChampionId} ${target.role} vs ${target.enemyChampionId} ${target.role} stats into counter_pick_stats.`,
);

async function fetchUniqueMatchIds(puuids) {
  const matchIds = new Set();

  for (const puuid of puuids) {
    const ids = await riot.fetchRecentRankedMatchIdsByPuuid({
      count: matchCount,
      puuid,
      queue,
    });

    if (Array.isArray(ids)) {
      ids.forEach((id) => matchIds.add(id));
    }

    console.log(`Fetched ${Array.isArray(ids) ? ids.length : 0} match IDs for one seed PUUID.`);
  }

  return Array.from(matchIds);
}

function getTargetMatchupResult(match) {
  const participants = match?.info?.participants;

  if (!Array.isArray(participants)) {
    return null;
  }

  const midParticipants = participants.filter(
    (participant) =>
      participant.teamPosition === target.teamPosition ||
      participant.individualPosition === target.teamPosition,
  );
  const enemy = midParticipants.find(
    (participant) => normalizeChampionKey(participant.championName) === normalizeChampionKey(target.enemyChampionId),
  );
  const counter = midParticipants.find(
    (participant) => normalizeChampionKey(participant.championName) === normalizeChampionKey(target.counterChampionId),
  );

  if (!enemy || !counter || enemy.teamId === counter.teamId) {
    return null;
  }

  return {
    didCounterWin: Boolean(counter.win),
  };
}

async function fetchCurrentPatch() {
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

function getPatchFromMatch(match) {
  const gameVersion = String(match?.info?.gameVersion ?? "");
  const [major, minor] = gameVersion.split(".");

  return major && minor ? `${major}.${minor}` : null;
}

function calculateWinRate({ games, wins }) {
  if (games <= 0) {
    return 0;
  }

  return Number(((wins / games) * 100).toFixed(2));
}

function calculateTier({ games, winRate }) {
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

function uniqueValues(values) {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function normalizeChampionKey(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
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

Scans recent ranked EUW/Europe match data for Ahri mid vs Yasuo mid and upserts
the aggregate into counter_pick_stats.

Usage:
  npm run poc:riot-counter-pick -- --seed-puuid <PUUID> [--count 20] [--patch 15.12] [--dry-run]

Environment:
  RIOT_API_KEY                Riot API key
  RIOT_POC_SEED_PUUIDS       Comma-separated seed PUUIDs
  RIOT_REGIONAL_ROUTING      Defaults to europe
  RIOT_REQUEST_DELAY_MS      Defaults to 1200
  SUPABASE_SERVICE_ROLE_KEY  Required unless --dry-run exits before upsert
`);
}
