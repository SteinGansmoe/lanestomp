import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

import {
  defaultPlatformRegion,
  rebuildSeedCandidateProfiles,
} from "./lib/riot-seed-candidates.mjs";

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

const candidateId = getArgValue("--candidate-id");
const platformRegion =
  getArgValue("--platform") ?? process.env.RIOT_PLATFORM_REGION ?? defaultPlatformRegion;
const puuid = getArgValue("--puuid");
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
  },
});
const result = await rebuildSeedCandidateProfiles({
  candidateIds: candidateId ? [candidateId] : null,
  platformRegion: candidateId ? null : platformRegion,
  puuid,
  supabase,
});

console.log(
  [
    "Riot seed candidate profile rebuild complete",
    `profilesRebuilt=${result.profilesRebuilt}`,
    `profileFailures=${result.profileFailures}`,
    candidateId ? `candidateId=${candidateId}` : null,
    !candidateId && platformRegion ? `platform=${platformRegion}` : null,
    puuid ? `puuid=${puuid}` : null,
  ]
    .filter(Boolean)
    .join(" | "),
);

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
  console.log(`Riot Seed Candidate Profile Rebuild

Rebuilds riot_seed_candidates aggregate profiles from durable
riot_seed_candidate_observations.

Usage:
  npm run rebuild:riot-seed-profiles
  npm run rebuild:riot-seed-profiles -- --platform EUW1
  npm run rebuild:riot-seed-profiles -- --candidate-id <UUID>
  npm run rebuild:riot-seed-profiles -- --puuid <PUUID>

Environment:
  RIOT_PLATFORM_REGION       Defaults to EUW1
  SUPABASE_SERVICE_ROLE_KEY  Required
`);
}
