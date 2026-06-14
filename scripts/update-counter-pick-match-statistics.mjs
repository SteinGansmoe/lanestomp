import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

import {
  loadActiveChampionRegistry,
  normalizeParticipantChampionIdentifiers,
} from "./lib/league-champion-normalizer.mjs";

loadEnvFile(".env.local");

const args = process.argv.slice(2);
const isDryRun = args.includes("--dry-run") || process.env.npm_config_dry_run === "true";
const regionalRoute = getArgValue("--region") ?? process.env.RIOT_REGIONAL_ROUTING ?? "europe";
const queue = Number(getArgValue("--queue") ?? process.env.RIOT_QUEUE_ID ?? 420);
const matchCount = Number(getArgValue("--count") ?? process.env.RIOT_MATCH_COUNT ?? 20);
const requestedPatch = getArgValue("--patch") ?? process.env.RIOT_MATCH_PATCH ?? null;
const seedPuuids = uniqueValues([
  ...getArgValues("--seed-puuid"),
  ...(process.env.RIOT_SEED_PUUIDS ?? "").split(","),
]);

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
  throw new Error("Provide at least one --seed-puuid value or RIOT_SEED_PUUIDS.");
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
  },
});
const championRegistry = await loadActiveChampionRegistry({ supabase });
const matchIds = await fetchSeedMatchIds(seedPuuids);
const aggregates = new Map();

for (const matchId of matchIds) {
  const match = await fetchRiotJson(
    `https://${regionalRoute}.api.riotgames.com/lol/match/v5/matches/${encodeURIComponent(
      matchId,
    )}`,
  );

  addMatchToAggregates(match, aggregates, championRegistry, requestedPatch);
}

const rows = Array.from(aggregates.values()).map(toStatisticRow);

if (isDryRun) {
  console.log(
    `Prepared ${rows.length} counter-pick statistic rows from ${matchIds.length} matches.`,
  );
  process.exit(0);
}

if (rows.length === 0) {
  console.log("No counter-pick statistics were produced.");
  process.exit(0);
}

const { error } = await supabase.from("league_counter_pick_match_statistics").upsert(rows, {
  onConflict: "patch,role,enemy_champion_id,counter_champion_id",
});

if (error) {
  throw new Error(`Could not update counter-pick match statistics: ${error.message}`);
}

console.log(`Updated ${rows.length} counter-pick statistic rows from ${matchIds.length} matches.`);

async function fetchSeedMatchIds(puuids) {
  const matchIds = new Set();

  for (const puuid of puuids) {
    const ids = await fetchRiotJson(
      `https://${regionalRoute}.api.riotgames.com/lol/match/v5/matches/by-puuid/${encodeURIComponent(
        puuid,
      )}/ids?start=0&count=${matchCount}&queue=${queue}`,
    );

    if (Array.isArray(ids)) {
      ids.forEach((id) => matchIds.add(id));
    }
  }

  return Array.from(matchIds);
}

function addMatchToAggregates(match, aggregateLookup, championRegistry, patchOverride) {
  const participants = match?.info?.participants;

  if (!Array.isArray(participants)) {
    return;
  }

  const patch = patchOverride ?? getPatchFromMatch(match);

  if (!patch) {
    return;
  }

  const participantsByRole = new Map();

  for (const participant of participants) {
    const role = toLeagueRole(participant.teamPosition);
    const championResult = normalizeParticipantChampionIdentifiers(participant, championRegistry);
    const championId = championResult.entry?.canonicalKey ?? null;

    if (!role || !championId || championResult.conflict || championResult.failure) {
      continue;
    }

    const roleParticipants = participantsByRole.get(role) ?? [];
    roleParticipants.push({
      championId,
      teamId: participant.teamId,
      win: Boolean(participant.win),
    });
    participantsByRole.set(role, roleParticipants);
  }

  for (const [role, roleParticipants] of participantsByRole) {
    const teams = new Map(roleParticipants.map((participant) => [participant.teamId, participant]));

    if (teams.size !== 2) {
      continue;
    }

    const [left, right] = Array.from(teams.values());
    addParticipantMatchup(aggregateLookup, patch, role, left, right);
    addParticipantMatchup(aggregateLookup, patch, role, right, left);
  }
}

function addParticipantMatchup(aggregateLookup, patch, role, counterParticipant, enemyParticipant) {
  if (counterParticipant.championId === enemyParticipant.championId) {
    return;
  }

  const key = [patch, role, enemyParticipant.championId, counterParticipant.championId].join("::");
  const aggregate = aggregateLookup.get(key) ?? {
    counterChampionId: counterParticipant.championId,
    enemyChampionId: enemyParticipant.championId,
    games: 0,
    patch,
    role,
    wins: 0,
  };

  aggregate.games += 1;
  aggregate.wins += counterParticipant.win ? 1 : 0;
  aggregateLookup.set(key, aggregate);
}

function toStatisticRow(aggregate) {
  const winRate = aggregate.games > 0 ? (aggregate.wins / aggregate.games) * 100 : 0;
  const now = new Date().toISOString();

  return {
    counter_champion_id: aggregate.counterChampionId,
    enemy_champion_id: aggregate.enemyChampionId,
    games: aggregate.games,
    last_updated_at: now,
    patch: aggregate.patch,
    role: aggregate.role,
    sample_confidence: getSampleConfidence(aggregate.games),
    win_rate: Number(winRate.toFixed(2)),
    wins: aggregate.wins,
  };
}

function getSampleConfidence(games) {
  if (games < 100) {
    return "low_sample";
  }

  if (games < 500) {
    return "low";
  }

  if (games < 1000) {
    return "medium";
  }

  return "high";
}

function getPatchFromMatch(match) {
  const gameVersion = String(match?.info?.gameVersion ?? "");
  const [major, minor] = gameVersion.split(".");

  return major && minor ? `${major}.${minor}` : null;
}

function toLeagueRole(teamPosition) {
  switch (teamPosition) {
    case "BOTTOM":
      return "adc";
    case "JUNGLE":
      return "jungle";
    case "MIDDLE":
      return "mid";
    case "TOP":
      return "top";
    case "UTILITY":
      return "support";
    default:
      return null;
  }
}

async function fetchRiotJson(url) {
  const response = await fetch(url, {
    headers: {
      "X-Riot-Token": riotApiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`Riot API request failed (${response.status}) for ${url}`);
  }

  return response.json();
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
