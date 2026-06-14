import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

import {
  defaultDataDragonLocale,
  verifyLeagueChampionRegistry,
} from "./lib/league-champion-registry.mjs";

loadEnvFile(".env.local");

const args = process.argv.slice(2);

if (args.includes("--help")) {
  printHelp();
  process.exit(0);
}

const locale =
  getArgValue("--locale") ?? process.env.RIOT_DDRAGON_LOCALE ?? defaultDataDragonLocale;
const requestedVersion = getArgValue("--version") ?? process.env.RIOT_DDRAGON_VERSION ?? null;
const supabase = getSupabaseClient();
const result = await verifyLeagueChampionRegistry({
  locale,
  supabase,
  version: requestedVersion,
});

console.log(
  [
    `Registry complete: ${result.ok ? "Yes" : "No"}`,
    `Source champions: ${result.sourceChampionCount}`,
    `Database champions: ${result.databaseChampionCount}`,
    `Database active champions: ${result.activeDatabaseChampionCount}`,
    `Missing: ${result.missing.length}`,
    `Unknown: ${result.unknown.length}`,
    `Conflicts: ${result.conflicts.length}`,
    `Name mismatches: ${result.nameMismatches.length}`,
    `Inactive returned by Riot: ${result.inactiveReturnedByRiot.length}`,
    `Source version: ${result.sourceVersion}`,
  ].join(" | "),
);

printRows("Missing champions", result.missing, (row) => `${row.id} (${row.name})`);
printRows("Unknown active database champions", result.unknown, (row) => `${row.id} (${row.name})`);
printRows("Identifier conflicts", result.conflicts, (value) => value);
printRows(
  "Inactive champions still returned by Riot",
  result.inactiveReturnedByRiot,
  (row) => `${row.id} (${row.name})`,
);
printRows(
  "Name mismatches",
  result.nameMismatches,
  (row) => `${row.id}: db=${row.databaseName} source=${row.sourceName}`,
);

if (!result.ok) {
  process.exit(1);
}

function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing Supabase verification credentials. Set NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL, plus SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
    },
  });
}

function printRows(label, rows, formatRow) {
  if (rows.length === 0) {
    return;
  }

  console.log(`${label}:`);
  rows.slice(0, 25).forEach((row) => console.log(`- ${formatRow(row)}`));

  if (rows.length > 25) {
    console.log(`- ... ${rows.length - 25} more`);
  }
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
  console.log(`League Champion Registry Verification

Compares the Riot Data Dragon champion source against league_champions.

Usage:
  npm run verify:league-champions
  npm run verify:league-champions -- --version 15.12.1
  npm run verify:league-champions -- --locale en_US

Environment:
  RIOT_DDRAGON_LOCALE       Defaults to en_US
  RIOT_DDRAGON_VERSION      Optional explicit Data Dragon version
  SUPABASE_SERVICE_ROLE_KEY Required
`);
}
