import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

import {
  loadActiveChampionRegistry,
  normalizeChampionIdentifier,
} from "./lib/league-champion-normalizer.mjs";

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
const registry = await loadActiveChampionRegistry({
  supabase,
});
const auditResults = [
  await auditTable({
    columns: ["champion_a", "champion_b", "winner_champion"],
    registry,
    supabase,
    table: "riot_matchup_observations",
  }),
  await auditTable({
    columns: ["champion"],
    registry,
    supabase,
    table: "riot_seed_candidate_observations",
  }),
  await auditTable({
    columns: ["enemy_champion_id", "counter_champion_id"],
    registry,
    supabase,
    table: "counter_pick_stats",
  }),
];
const missingCount = auditResults.reduce((total, result) => total + result.missing.length, 0);
const nonCanonicalCount = auditResults.reduce(
  (total, result) => total + result.nonCanonical.length,
  0,
);

console.log(
  [
    `Stored champion identifier audit valid: ${missingCount === 0 && nonCanonicalCount === 0 ? "Yes" : "No"}`,
    `Tables audited: ${auditResults.length}`,
    `Missing identifiers: ${missingCount}`,
    `Resolvable non-canonical identifiers: ${nonCanonicalCount}`,
  ].join("\n"),
);

for (const result of auditResults) {
  printRows(`${result.table} missing`, result.missing);
  printRows(`${result.table} non-canonical`, result.nonCanonical);
}

if (missingCount > 0 || nonCanonicalCount > 0) {
  process.exit(1);
}

async function auditTable({ columns, registry, supabase, table }) {
  const { data, error } = await supabase.from(table).select(columns.join(", "));

  if (error) {
    throw new Error(`Could not audit ${table}: ${error.message}`);
  }

  const uniqueValuesByColumn = new Map();

  for (const row of data ?? []) {
    for (const column of columns) {
      const value = String(row[column] ?? "").trim();

      if (!value) {
        continue;
      }

      const values = uniqueValuesByColumn.get(column) ?? new Set();

      values.add(value);
      uniqueValuesByColumn.set(column, values);
    }
  }

  const missing = [];
  const nonCanonical = [];

  for (const [column, values] of uniqueValuesByColumn.entries()) {
    for (const value of values) {
      const resolved = normalizeChampionIdentifier(value, registry);

      if (!resolved) {
        missing.push(`${column}: ${value}`);
        continue;
      }

      if (resolved.canonicalKey !== value) {
        nonCanonical.push(`${column}: ${value} -> ${resolved.canonicalKey}`);
      }
    }
  }

  return {
    missing,
    nonCanonical,
    table,
  };
}

function printRows(label, rows) {
  if (rows.length === 0) {
    return;
  }

  console.log(`\n${label}:`);
  rows.slice(0, 50).forEach((row) => console.log(`- ${row}`));
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
  console.log(`Stored Champion Identifier Audit

Reports stored champion values in Riot-derived tables that do not match the
canonical league_champions.id registry value. This command does not modify data.

Usage:
  npm run audit:stored-champion-identifiers

Environment:
  SUPABASE_SERVICE_ROLE_KEY Required
`);
}
