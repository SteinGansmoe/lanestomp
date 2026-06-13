import { mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const dataDragonBaseUrl = "https://ddragon.leagueoflegends.com";
const defaultLocale = "en_US";

const args = process.argv.slice(2);
const locale = getArgValue("--locale") ?? process.env.RIOT_DDRAGON_LOCALE ?? defaultLocale;
const requestedVersion = getArgValue("--version") ?? process.env.RIOT_DDRAGON_VERSION ?? null;
const shouldSkipIconDownload = args.includes("--skip-icons");

const version = requestedVersion ?? (await getLatestDataDragonVersion());
const itemPayload = await fetchJson(`${dataDragonBaseUrl}/cdn/${version}/data/${locale}/item.json`);
const championPayload = await fetchJson(
  `${dataDragonBaseUrl}/cdn/${version}/data/${locale}/championFull.json`,
);

const dataOutputDirectory = resolve(process.cwd(), "src", "features", "league", "data-dragon");
const itemIconOutputDirectory = resolve(process.cwd(), "public", "league", "items", "icons");
const abilityIconOutputDirectory = resolve(process.cwd(), "public", "league", "abilities", "icons");

await mkdir(dataOutputDirectory, { recursive: true });

const itemCache = toItemCache(itemPayload, version);
const abilityCache = toAbilityCache(championPayload, version);

await writeJson(join(dataOutputDirectory, "items.json"), itemCache);
await writeJson(join(dataOutputDirectory, "champion-abilities.json"), abilityCache);

if (!shouldSkipIconDownload) {
  await mkdir(itemIconOutputDirectory, { recursive: true });
  await mkdir(abilityIconOutputDirectory, { recursive: true });

  await downloadDataDragonImages({
    files: itemCache.items.map((item) => item.icon.imageFile),
    outputDirectory: itemIconOutputDirectory,
    remoteDirectory: "img/item",
    version,
  });
  await downloadDataDragonImages({
    files: Array.from(
      new Set(
        Object.values(abilityCache.champions).flatMap((champion) =>
          Object.values(champion.abilities).map((ability) => ability.icon.imageFile),
        ),
      ),
    ),
    outputDirectory: abilityIconOutputDirectory,
    remoteDirectory: "img/spell",
    version,
  });
}

console.log(
  `Cached ${itemCache.items.length} items and ${
    Object.keys(abilityCache.champions).length
  } champion ability sets from Data Dragon ${version} (${locale}).`,
);
process.exit(0);

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

async function writeJson(filePath, value) {
  await writeFile(`${filePath}`, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function downloadDataDragonImages({ files, outputDirectory, remoteDirectory, version }) {
  let downloadedCount = 0;

  for (const file of files) {
    const imageUrl = `${dataDragonBaseUrl}/cdn/${version}/${remoteDirectory}/${file}`;
    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error(`Data Dragon image request failed (${response.status}) for ${imageUrl}`);
    }

    await writeFile(join(outputDirectory, file), Buffer.from(await response.arrayBuffer()));
    downloadedCount += 1;
  }

  console.log(`Downloaded ${downloadedCount} ${remoteDirectory} images.`);
}

function toItemCache(payload, version) {
  const items = Object.entries(payload?.data ?? {})
    .map(([itemId, item]) => {
      const imageFile = item?.image?.full ?? `${itemId}.png`;

      return {
        id: Number(itemId),
        name: String(item?.name ?? itemId),
        description: String(item?.description ?? ""),
        plaintext: String(item?.plaintext ?? ""),
        icon: {
          imageFile,
          localPath: `/league/items/icons/${imageFile}`,
          dataDragonUrl: `${dataDragonBaseUrl}/cdn/${version}/img/item/${imageFile}`,
        },
        gold: {
          base: Number(item?.gold?.base ?? 0),
          purchasable: Boolean(item?.gold?.purchasable),
          sell: Number(item?.gold?.sell ?? 0),
          total: Number(item?.gold?.total ?? 0),
        },
        tags: Array.isArray(item?.tags) ? item.tags.map(String).sort() : [],
        stats: item?.stats && typeof item.stats === "object" ? item.stats : {},
        patch: version,
      };
    })
    .sort((itemA, itemB) => itemA.id - itemB.id);

  return {
    patch: version,
    locale,
    cachedAt: new Date().toISOString(),
    items,
  };
}

function toAbilityCache(payload, version) {
  const champions = Object.fromEntries(
    Object.values(payload?.data ?? {})
      .map((champion) => {
        const spells = Array.isArray(champion?.spells) ? champion.spells : [];
        const abilities = Object.fromEntries(
          ["Q", "W", "E", "R"].map((abilityKey, index) => {
            const spell = spells[index] ?? {};
            const imageFile = spell?.image?.full ?? `${champion?.id}${abilityKey}.png`;

            return [
              abilityKey,
              {
                key: abilityKey,
                id: String(spell?.id ?? `${champion?.id}${abilityKey}`),
                name: String(spell?.name ?? abilityKey),
                description: String(spell?.description ?? ""),
                tooltip: String(spell?.tooltip ?? ""),
                icon: {
                  imageFile,
                  localPath: `/league/abilities/icons/${imageFile}`,
                  dataDragonUrl: `${dataDragonBaseUrl}/cdn/${version}/img/spell/${imageFile}`,
                },
                patch: version,
              },
            ];
          }),
        );

        return [
          String(champion?.id ?? ""),
          {
            id: String(champion?.id ?? ""),
            name: String(champion?.name ?? ""),
            abilities,
            patch: version,
          },
        ];
      })
      .filter(([championId]) => championId),
  );

  return {
    patch: version,
    locale,
    cachedAt: new Date().toISOString(),
    champions,
  };
}
