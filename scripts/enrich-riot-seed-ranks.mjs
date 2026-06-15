import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

import { RiotApiClient } from "./lib/riot-api-client.mjs";
import {
  createSupabaseRankRepository,
  enrichRiotSeedCandidateRanks,
  getDefaultRankPlatformRegion,
  rankEnrichmentStatuses,
} from "./lib/riot-seed-rank-enrichment.mjs";

loadEnvFile(".env.local");

const args = process.argv.slice(2);

if (args.includes("--help")) {
  printHelp();
  process.exit(0);
}

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const riotApiKey = process.env.RIOT_API_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL, plus SUPABASE_SERVICE_ROLE_KEY.",
  );
}

if (!riotApiKey) {
  throw new Error("Missing RIOT_API_KEY.");
}

const candidateId = getArgValue("--candidate-id");
const platformRegion = getArgValue("--platform") ?? getDefaultRankPlatformRegion();
const puuid = getArgValue("--puuid");
const status = getArgValue("--status");
const limit = Number(getArgValue("--limit") ?? 20);
const force = args.includes("--force");

if (status && !rankEnrichmentStatuses.includes(status)) {
  throw new Error(`Invalid --status value. Use one of: ${rankEnrichmentStatuses.join(", ")}.`);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
  },
});
const riot = new RiotApiClient({
  apiKey: riotApiKey,
  regionalRoute: process.env.RIOT_REGIONAL_ROUTING ?? "europe",
  requestDelayMs: Number(process.env.RIOT_REQUEST_DELAY_MS ?? 1200),
});
const repository = createSupabaseRankRepository(supabase);
const result = await enrichRiotSeedCandidateRanks({
  candidateIds: candidateId ? [candidateId] : null,
  force,
  limit: Number.isInteger(limit) && limit > 0 ? limit : 20,
  platformRegion: candidateId || puuid ? null : platformRegion,
  puuid,
  repository,
  riot,
  status,
});

console.log(
  [
    "Riot seed candidate rank enrichment complete",
    `total=${result.total}`,
    `ranked=${result.rankedCount}`,
    `unranked=${result.unrankedCount}`,
    `notFound=${result.notFoundCount}`,
    `rateLimited=${result.rateLimitedCount}`,
    `failed=${result.failedCount}`,
    `skipped=${result.skippedCount}`,
    `snapshots=${result.snapshotInsertedCount}`,
  ].join(" | "),
);

for (const row of result.results) {
  console.log(
    [
      row.candidateId,
      `status=${row.status}`,
      row.rank?.tier ? `rank=${row.rank.tier} ${row.rank.division ?? ""}`.trim() : null,
      row.rank?.leaguePoints !== null && row.rank?.leaguePoints !== undefined
        ? `lp=${row.rank.leaguePoints}`
        : null,
      row.rank?.winRate !== null && row.rank?.winRate !== undefined
        ? `wr=${Math.round(row.rank.winRate * 100)}%`
        : null,
      row.skipped ? "skipped=cooldown" : null,
      row.errorCode ? `error=${row.errorCode}` : null,
    ]
      .filter(Boolean)
      .join(" | "),
  );
}

function getArgValue(name) {
  const index = args.indexOf(name);

  if (index === -1) {
    return null;
  }

  const value = args[index + 1];

  return value && !value.startsWith("--") ? value : null;
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
  console.log(`Riot Seed Candidate Rank Enrichment

Fetches current Ranked Solo/Duo metadata for riot_seed_candidates.

Usage:
  npm run enrich:riot-seed-ranks
  npm run enrich:riot-seed-ranks -- --platform EUW1 --limit 20
  npm run enrich:riot-seed-ranks -- --candidate-id <UUID> --force
  npm run enrich:riot-seed-ranks -- --puuid <PUUID> --force
  npm run enrich:riot-seed-ranks -- --status pending --limit 20

Options:
  --candidate-id <UUID>  Refresh one candidate.
  --puuid <PUUID>        Refresh candidates matching one PUUID.
  --platform <REGION>    Platform route, defaults to RIOT_PLATFORM_REGION or EUW1.
  --status <STATUS>      Filter by rank enrichment status.
  --limit <N>            Batch size, defaults to 20.
  --force                Ignore the 24h rank refresh cooldown.
`);
}
