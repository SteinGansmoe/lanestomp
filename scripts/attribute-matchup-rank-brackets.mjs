import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

import {
  attributeStoredMatchupRankBrackets,
  createSupabaseMatchupRankAttributionRepository,
} from "./lib/riot-matchup-rank-attribution.mjs";
import {
  loadActiveChampionRegistry,
  normalizeChampionIdentifier,
} from "./lib/league-champion-normalizer.mjs";
import { normalizeRole } from "./lib/riot-counter-pick-scanner.mjs";

loadEnvFile(".env.local");

console.log("Rank attribution environment", {
  hasSupabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
  hasServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
  supabaseHost: (() => {
    try {
      return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname;
    } catch {
      return "invalid-url";
    }
  })(),
});

const args = process.argv.slice(2);

if (args.includes("--help")) {
  printHelp();
  process.exit(0);
}

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL, plus SUPABASE_SERVICE_ROLE_KEY.",
  );
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
  },
});
const championRegistry = await loadActiveChampionRegistry({ supabase });
const role = getArgValue("--role");
const normalizedRole = role ? normalizeRole(role) : null;
const champion = getArgValue("--champion");
const normalizedChampion = champion
  ? normalizeChampionIdentifier(champion, championRegistry)
  : null;

if (role && !normalizedRole) {
  throw new Error("Role must be top, jungle, mid, adc, or support.");
}

if (champion && !normalizedChampion) {
  throw new Error(`Champion "${champion}" could not be resolved against league_champions.`);
}

const limit = normalizeLimit(getArgValue("--limit"));
console.log("CLI args", args);
console.log("Force detected", args.includes("--force"));
const result = await attributeStoredMatchupRankBrackets({
  filters: {
    champion: normalizedChampion?.canonicalKey ?? null,
    matchId: getArgValue("--match-id"),
    patch: getArgValue("--patch"),
    role: normalizedRole,
  },
  force: args.includes("--force"),
  limit,
  repository: createSupabaseMatchupRankAttributionRepository(supabase),
});
const summary = result.summary;

console.log(
  [
    "Matchup rank attribution complete",
    `Observations processed: ${summary.processed}`,
    `Two-player average: ${summary.twoPlayerAverage}`,
    `Single-player: ${summary.singlePlayer}`,
    `Unknown: ${summary.unknown}`,
    `Already attributed: ${summary.alreadyAttributed}`,
    `Failures: ${summary.failures}`,
    `Snapshot too old: ${summary.snapshotTooOld}`,
    `Participants not found: ${summary.participantsNotFound}`,
    `Rows loaded: ${summary.total}`,
  ].join("\n"),
);

function getArgValue(name) {
  const index = args.indexOf(name);

  if (index === -1) {
    return null;
  }

  const value = args[index + 1];

  return value && !value.startsWith("--") ? value : null;
}

function normalizeLimit(value) {
  const limit = Number(value ?? 500);

  if (!Number.isInteger(limit) || limit < 1) {
    return 500;
  }

  return Math.min(limit, 5000);
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
  console.log(`Matchup Rank Attribution

Assigns rank brackets to stored riot_matchup_observations from existing rank snapshots.
This command does not call Match-V5.

Usage:
  npm run attribute:matchup-rank-brackets
  npm run attribute:matchup-rank-brackets -- --patch 16.12
  npm run attribute:matchup-rank-brackets -- --role mid
  npm run attribute:matchup-rank-brackets -- --match-id EUW1_1234567890
  npm run attribute:matchup-rank-brackets -- --champion Ahri
  npm run attribute:matchup-rank-brackets -- --limit 500 --force

Environment:
  SUPABASE_SERVICE_ROLE_KEY  Required
`);
}
