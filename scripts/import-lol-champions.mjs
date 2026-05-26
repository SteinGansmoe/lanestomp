import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

const dataDragonBaseUrl = "https://ddragon.leagueoflegends.com";
const defaultLocale = "en_US";

loadEnvFile(".env.local");

const args = process.argv.slice(2);
const isDryRun =
  args.includes("--dry-run") || process.env.npm_config_dry_run === "true";
const locale = getArgValue("--locale") ?? process.env.RIOT_DDRAGON_LOCALE ?? defaultLocale;
const requestedVersion =
  getArgValue("--version") ?? process.env.RIOT_DDRAGON_VERSION ?? null;

const version = requestedVersion ?? (await getLatestDataDragonVersion());
const championPayload = await fetchJson(
  `${dataDragonBaseUrl}/cdn/${version}/data/${locale}/champion.json`
);
const rows = toChampionRows(championPayload, version);

if (isDryRun) {
  console.log(
    `Fetched ${rows.length} League champions from Data Dragon ${version} (${locale}).`
  );
  process.exit(0);
}

const supabaseUrl =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Missing Supabase import credentials. Set NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL, plus SUPABASE_SERVICE_ROLE_KEY."
  );
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
  },
});

const { error } = await supabase.from("league_champions").upsert(rows, {
  onConflict: "id",
});

if (error) {
  throw new Error(`Could not import League champions: ${error.message}`);
}

console.log(
  `Imported ${rows.length} League champions into Supabase from Data Dragon ${version} (${locale}).`
);

function getArgValue(name) {
  const index = args.indexOf(name);

  if (index === -1) {
    return null;
  }

  const value = args[index + 1];

  return value && !value.startsWith("--") ? value : null;
}

async function getLatestDataDragonVersion() {
  const versions = await fetchJson(`${dataDragonBaseUrl}/api/versions.json`);

  if (!Array.isArray(versions) || typeof versions[0] !== "string") {
    throw new Error("Data Dragon versions response did not include a latest version.");
  }

  return versions[0];
}

async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Data Dragon request failed (${response.status}) for ${url}`);
  }

  return response.json();
}

function toChampionRows(payload, version) {
  const champions = payload?.data ? Object.values(payload.data) : [];
  const importedAt = new Date().toISOString();

  return champions.map((champion) => ({
    id: champion.id,
    riot_key: champion.key,
    name: champion.name,
    title: champion.title,
    image_url: `${dataDragonBaseUrl}/cdn/${version}/img/champion/${champion.image.full}`,
    tags: Array.isArray(champion.tags) ? champion.tags : [],
    version,
    imported_at: importedAt,
    updated_at: importedAt,
  }));
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
