import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

import { loadActiveChampionRegistry } from "./lib/league-champion-normalizer.mjs";
import {
  createObservationValidationContext,
  validateCounterPickAggregate,
  validateMatchupObservation,
  validateSeedCandidateObservation,
} from "./lib/riot-observation-validation.mjs";

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

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
  },
});
const championRegistry = await loadActiveChampionRegistry({ supabase });
const context = createObservationValidationContext({
  candidateIds: ["11111111-1111-4111-8111-111111111111"],
  championRegistry,
});
const validTimestamp = new Date(Date.now() - 60_000).toISOString();
const representativeChampions = [
  "Fiddlesticks",
  "MonkeyKing",
  "Kaisa",
  "Khazix",
  "Nunu",
  "Renata",
].filter((championId) => championRegistry.byCanonicalKey.has(championId));
const failures = [];
let candidateScenarios = 0;
let matchupScenarios = 0;
let aggregateScenarios = 0;

for (const championId of representativeChampions) {
  candidateScenarios += 1;
  expectValid(
    validateSeedCandidateObservation(
      {
        ...validCandidateObservation(),
        champion: championId,
        match_id: `EUW1_${candidateScenarios}`,
      },
      context,
    ),
    `valid candidate ${championId}`,
    failures,
  );
}

candidateScenarios += 3;
expectCodes(
  validateSeedCandidateObservation(
    {
      ...validCandidateObservation(),
      champion: "DefinitelyNotAChampion",
    },
    context,
  ),
  ["UNKNOWN_CHAMPION"],
  "unknown candidate champion",
  failures,
);
expectCodes(
  validateSeedCandidateObservation(
    {
      ...validCandidateObservation(),
      regional_routing: "AMERICAS",
    },
    context,
  ),
  ["ROUTING_REGION_MISMATCH"],
  "routing mismatch",
  failures,
);
expectCodes(
  validateSeedCandidateObservation(
    {
      ...validCandidateObservation(),
      role: "middle",
    },
    context,
  ),
  ["INVALID_ROLE"],
  "invalid role",
  failures,
);

matchupScenarios += 3;
expectValid(
  validateMatchupObservation(validMatchupObservation(), context),
  "valid matchup",
  failures,
);
expectCodes(
  validateMatchupObservation(
    {
      ...validMatchupObservation(),
      champion_a_won: true,
      winner_champion: "Zed",
    },
    context,
  ),
  ["WINNER_BOOLEAN_CONFLICT"],
  "winner conflict",
  failures,
);
expectCodes(
  validateMatchupObservation(
    {
      ...validMatchupObservation(),
      champion_b: "Ahri",
    },
    context,
  ),
  ["SAME_CHAMPION_MATCHUP"],
  "same champion matchup",
  failures,
);

aggregateScenarios += 3;
expectValid(validateCounterPickAggregate(validAggregate(), context), "valid aggregate", failures);
expectCodes(
  validateCounterPickAggregate(
    {
      ...validAggregate(),
      games: 10,
      losses: 2,
      wins: 7,
    },
    context,
  ),
  ["INVALID_GAME_TOTAL"],
  "aggregate total mismatch",
  failures,
);
expectCodes(
  validateCounterPickAggregate(
    {
      ...validAggregate(),
      counter_champion_id: "DefinitelyNotAChampion",
    },
    context,
  ),
  ["UNKNOWN_CHAMPION"],
  "aggregate unknown champion",
  failures,
);

console.log(
  [
    `Riot observation validation valid: ${failures.length === 0 ? "Yes" : "No"}`,
    `Candidate scenarios tested: ${candidateScenarios}`,
    `Matchup scenarios tested: ${matchupScenarios}`,
    `Aggregate scenarios tested: ${aggregateScenarios}`,
    `Unexpected passes: ${failures.filter((failure) => failure.includes("unexpectedly passed")).length}`,
    `Unexpected failures: ${failures.length}`,
  ].join("\n"),
);

if (failures.length > 0) {
  console.error("\nFailures:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

function validCandidateObservation() {
  return {
    candidate_id: "11111111-1111-4111-8111-111111111111",
    champion: "Ahri",
    game_duration_seconds: 1800,
    game_start_at: validTimestamp,
    match_id: "EUW1_1234567890",
    patch: "16.12",
    platform_region: "EUW1",
    queue_id: 420,
    regional_routing: "EUROPE",
    role: "mid",
    scan_job_id: 1,
    won: true,
  };
}

function validMatchupObservation() {
  return {
    champion_a: "Ahri",
    champion_a_puuid: "a".repeat(78),
    champion_a_tier: null,
    champion_a_won: true,
    champion_b: "Zed",
    champion_b_puuid: "b".repeat(78),
    champion_b_tier: null,
    game_duration_seconds: 1800,
    game_start_at: validTimestamp,
    match_id: "EUW1_1234567890",
    patch: "16.12",
    queue_id: 420,
    rank_bracket: null,
    role: "mid",
    scan_job_id: 1,
    seen_count: 1,
    winner_champion: "Ahri",
  };
}

function validAggregate() {
  return {
    counter_champion_id: "Ahri",
    enemy_champion_id: "Zed",
    games: 10,
    losses: 4,
    patch: "16.12",
    role: "mid",
    tier: "A",
    win_rate: 60,
    wins: 6,
  };
}

function expectValid(result, label, failures) {
  if (!result.valid) {
    failures.push(`${label} failed with ${result.issues.map((issue) => issue.code).join(", ")}`);
  }
}

function expectCodes(result, expectedCodes, label, failures) {
  if (result.valid) {
    failures.push(`${label} unexpectedly passed`);
    return;
  }

  const actualCodes = result.issues.map((issue) => issue.code).sort();

  if (JSON.stringify(actualCodes) !== JSON.stringify([...expectedCodes].sort())) {
    failures.push(
      `${label} returned ${actualCodes.join(", ")} instead of ${expectedCodes.join(", ")}`,
    );
  }
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
  console.log(`Riot Observation Validation Verification

Loads the active champion registry and verifies representative valid and invalid
Riot-derived observation rows without writing to the database.

Usage:
  npm run verify:riot-observation-validation

Environment:
  SUPABASE_SERVICE_ROLE_KEY Required
`);
}
