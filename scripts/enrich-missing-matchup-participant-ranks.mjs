import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

import {
  createSupabaseMatchupRankCoverageRepository,
  ensureMatchupRankCoverageCandidates,
  loadMatchupRankCoverageQueue,
} from "./lib/matchup-rank-coverage-queue.mjs";
import { RiotApiClient } from "./lib/riot-api-client.mjs";
import {
  createSupabaseRankRepository,
  enrichRiotSeedCandidateRanks,
  maxAdminRankRefreshBatchSize,
} from "./lib/riot-seed-rank-enrichment.mjs";
import {
  loadActiveChampionRegistry,
  normalizeChampionIdentifier,
} from "./lib/league-champion-normalizer.mjs";
import { normalizeRole } from "./lib/riot-counter-pick-scanner.mjs";

loadEnvFile(".env.local");

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

if (!process.env.RIOT_API_KEY) {
  throw new Error("Missing RIOT_API_KEY.");
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
  },
});
const championRegistry = await loadActiveChampionRegistry({ supabase });
const championInput = getArgValue("--champion");
const champion = championInput
  ? normalizeChampionIdentifier(championInput, championRegistry)
  : null;
const roleInput = getArgValue("--role");
const role = roleInput ? normalizeRole(roleInput) : null;
const limit = normalizeLimit(getArgValue("--limit"));
const minimumImpact = normalizeMinimumImpact(getArgValue("--minimum-impact"));

if (championInput && !champion) {
  throw new Error(`Champion "${championInput}" could not be resolved.`);
}

if (roleInput && !role) {
  throw new Error("Role must be top, jungle, mid, adc, or support.");
}

const coverageRepository = createSupabaseMatchupRankCoverageRepository(supabase);
const queue = await loadMatchupRankCoverageQueue({
  filters: {
    champion: champion?.canonicalKey ?? null,
    minimumImpact,
    patch: getArgValue("--patch"),
    platformRegion: getArgValue("--platform"),
    role: role ?? "all",
  },
  limit,
  repository: coverageRepository,
});
const selected = queue.candidates.slice(0, limit);

if (selected.length === 0) {
  console.log("No matchup rank coverage participants matched the current filters.");
  process.exit(0);
}

const candidateLinkage = await ensureMatchupRankCoverageCandidates({
  participants: selected.map((candidate) => ({
    platformRegion: candidate.platformRegion,
    puuid: candidate.puuid,
  })),
  repository: coverageRepository,
});
const riot = new RiotApiClient({
  apiKey: process.env.RIOT_API_KEY,
  regionalRoute: process.env.RIOT_REGIONAL_ROUTING ?? "europe",
  requestDelayMs: Number(process.env.RIOT_REQUEST_DELAY_MS ?? 1200),
});
const enrichment = await enrichRiotSeedCandidateRanks({
  candidateIds: candidateLinkage.candidateIds,
  force: args.includes("--force"),
  limit: candidateLinkage.candidateIds.length,
  repository: createSupabaseRankRepository(supabase),
  riot,
});

console.log(
  [
    "Missing matchup participant rank enrichment complete",
    `Participants selected: ${selected.length}`,
    `Candidate rows created: ${candidateLinkage.createdCount}`,
    `Candidates requested: ${candidateLinkage.candidateIds.length}`,
    `Ranked: ${enrichment.rankedCount}`,
    `Unranked: ${enrichment.unrankedCount}`,
    `Not found: ${enrichment.notFoundCount}`,
    `Failed: ${enrichment.failedCount}`,
    `Skipped: ${enrichment.skippedCount}`,
    `Snapshots created: ${enrichment.snapshotInsertedCount}`,
    `Projected unknown observations: ${queue.projectedImpact.unknownObservationsAffected}`,
    `Projected two-player upgrades: ${queue.projectedImpact.twoPlayerUpgradePotential}`,
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
  const limit = Number(value ?? maxAdminRankRefreshBatchSize);

  if (!Number.isInteger(limit) || limit < 1) {
    return maxAdminRankRefreshBatchSize;
  }

  return Math.min(limit, maxAdminRankRefreshBatchSize);
}

function normalizeMinimumImpact(value) {
  const minimumImpact = Number(value ?? 1);

  if (!Number.isFinite(minimumImpact) || minimumImpact < 0) {
    return 1;
  }

  return minimumImpact;
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
  console.log(`Missing Matchup Participant Rank Enrichment

Identifies high-impact unresolved matchup participants, creates missing seed candidates,
and refreshes rank through the shared Riot seed rank enrichment service.

Usage:
  npm run enrich:missing-matchup-participant-ranks
  npm run enrich:missing-matchup-participant-ranks -- --limit 20
  npm run enrich:missing-matchup-participant-ranks -- --role mid --champion Ahri
  npm run enrich:missing-matchup-participant-ranks -- --patch 16.12 --minimum-impact 3
  npm run enrich:missing-matchup-participant-ranks -- --platform EUW1 --force

Options:
  --limit <COUNT>           Maximum participants to enrich. Max ${maxAdminRankRefreshBatchSize}.
  --role <ROLE>             top, jungle, mid, adc, support.
  --champion <CHAMPION>     Champion name or id.
  --patch <PATCH>           Patch filter.
  --platform <PLATFORM>     Platform region, for example EUW1.
  --minimum-impact <COUNT>  Minimum priority score.
  --force                   Ignore rank refresh cooldown.
`);
}
