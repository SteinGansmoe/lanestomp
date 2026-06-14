import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

import { rebuildCounterPickStatsFromObservations } from "./lib/riot-counter-pick-aggregation.mjs";

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

const patch = getArgValue("--patch");
const role = getArgValue("--role");
const champion = getArgValue("--champion");
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
  },
});
const result = await rebuildCounterPickStatsFromObservations({
  champion,
  patch,
  role,
  supabase,
});

console.log(
  [
    "Counter pick stats rebuild complete",
    `statsRowsUpdated=${result.statsRowsUpdated}`,
    patch ? `patch=${patch}` : null,
    role ? `role=${role}` : null,
    champion ? `champion=${champion}` : null,
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
  console.log(`Counter Pick Stats Rebuild

Rebuilds counter_pick_stats from durable riot_matchup_observations.

Usage:
  npm run rebuild:counter-pick-stats
  npm run rebuild:counter-pick-stats -- --patch 15.12
  npm run rebuild:counter-pick-stats -- --role mid
  npm run rebuild:counter-pick-stats -- --champion Ahri

Environment:
  SUPABASE_SERVICE_ROLE_KEY  Required
`);
}
