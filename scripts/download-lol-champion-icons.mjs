import { mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const dataDragonBaseUrl = "https://ddragon.leagueoflegends.com";
const defaultLocale = "en_US";
const outputDirectory = resolve(process.cwd(), "public", "league", "champions", "icons");

const args = process.argv.slice(2);
const locale = getArgValue("--locale") ?? process.env.RIOT_DDRAGON_LOCALE ?? defaultLocale;
const requestedVersion = getArgValue("--version") ?? process.env.RIOT_DDRAGON_VERSION ?? null;

const version = requestedVersion ?? (await getLatestDataDragonVersion());
const championPayload = await fetchJson(
  `${dataDragonBaseUrl}/cdn/${version}/data/${locale}/champion.json`,
);
const champions = championPayload?.data ? Object.values(championPayload.data) : [];

if (champions.length === 0) {
  throw new Error(`Data Dragon ${version} (${locale}) did not include champion data.`);
}

await mkdir(outputDirectory, { recursive: true });

let downloadedCount = 0;

for (const champion of champions) {
  const imageFile = champion?.image?.full;

  if (!champion?.id || !imageFile) {
    throw new Error(
      `Champion payload is missing id or image metadata: ${JSON.stringify(champion)}`,
    );
  }

  const iconUrl = `${dataDragonBaseUrl}/cdn/${version}/img/champion/${imageFile}`;
  const iconResponse = await fetch(iconUrl);

  if (!iconResponse.ok) {
    throw new Error(`Champion icon request failed (${iconResponse.status}) for ${iconUrl}`);
  }

  const fileName = `${normalizeChampionAssetSlug(champion.id)}.png`;
  const filePath = join(outputDirectory, fileName);
  const iconBuffer = Buffer.from(await iconResponse.arrayBuffer());

  await writeFile(filePath, iconBuffer);
  downloadedCount += 1;
}

console.log(
  `Downloaded ${downloadedCount} League champion icons from Data Dragon ${version} (${locale}) to ${outputDirectory}.`,
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

function normalizeChampionAssetSlug(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}
