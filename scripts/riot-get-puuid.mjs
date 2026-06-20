import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { RiotApiClient, RiotApiError } from "./lib/riot-api-client.mjs";
import { resolveRiotAccountByRiotId } from "./lib/riot-account-lookup.mjs";

const defaultRegionalRoute = "europe";

loadEnvFile(".env.local");

const args = process.argv.slice(2);

if (args.includes("--help")) {
  printHelp();
  process.exit(0);
}

const gameName = getArgValue("--game-name") ?? process.env.RIOT_LOOKUP_GAME_NAME ?? null;
const tagLine = getArgValue("--tag-line") ?? process.env.RIOT_LOOKUP_TAG_LINE ?? null;
const regionalRoute =
  getArgValue("--region") ?? process.env.RIOT_REGIONAL_ROUTING ?? defaultRegionalRoute;
const requestDelayMs = Number(
  getArgValue("--delay-ms") ?? process.env.RIOT_REQUEST_DELAY_MS ?? 1200,
);
const riotApiKey = process.env.RIOT_API_KEY;

if (!riotApiKey) {
  console.error("Missing RIOT_API_KEY.");
  process.exit(1);
}

if (!gameName || !tagLine) {
  console.error("Missing Riot ID. Provide --game-name and --tag-line.");
  printHelp();
  process.exit(1);
}

const riot = new RiotApiClient({
  apiKey: riotApiKey,
  regionalRoute,
  requestDelayMs,
});

try {
  const account = await resolveRiotAccountByRiotId({
    gameName,
    riot,
    tagLine,
  });

  console.log(`Riot ID: ${account.riotId}`);
  console.log(`PUUID: ${account.puuid}`);
} catch (error) {
  if (error instanceof RiotApiError && error.status === 404) {
    console.error(`Invalid Riot ID or account not found: ${gameName}#${tagLine}`);
    process.exit(1);
  }

  if (error instanceof RiotApiError && (error.status === 401 || error.status === 403)) {
    console.error("Riot API key was rejected. Check RIOT_API_KEY.");
    process.exit(1);
  }

  throw error;
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
  console.log(`Riot Account Lookup Utility

Converts a Riot ID into a PUUID using Riot Account-V1.

Usage:
  npm run riot:get-puuid -- --game-name <name> --tag-line <tag>

Example:
  npm run riot:get-puuid -- --game-name Faker --tag-line KR1

Environment:
  RIOT_API_KEY            Riot API key
  RIOT_REGIONAL_ROUTING  Defaults to europe
  RIOT_REQUEST_DELAY_MS  Defaults to 1200
`);
}
