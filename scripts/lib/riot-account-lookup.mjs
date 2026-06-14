export function parseRiotId(value) {
  const originalRiotId = String(value ?? "").trim();
  const separatorIndex = originalRiotId.lastIndexOf("#");

  if (separatorIndex <= 0 || separatorIndex === originalRiotId.length - 1) {
    return {
      error: "Invalid Riot ID format. Use Game Name#Tagline.",
      gameName: null,
      originalRiotId,
      ok: false,
      tagLine: null,
    };
  }

  const gameName = originalRiotId.slice(0, separatorIndex).trim();
  const tagLine = originalRiotId.slice(separatorIndex + 1).trim();

  if (!gameName || !tagLine) {
    return {
      error: "Invalid Riot ID format. Use Game Name#Tagline.",
      gameName: null,
      originalRiotId,
      ok: false,
      tagLine: null,
    };
  }

  return {
    gameName,
    ok: true,
    originalRiotId,
    tagLine,
  };
}

export function uniqueRiotIds(values) {
  const seenIds = new Set();
  const riotIds = [];

  for (const value of values) {
    const riotId = String(value ?? "").trim();

    if (!riotId) {
      continue;
    }

    const key = riotId.toLowerCase();

    if (seenIds.has(key)) {
      continue;
    }

    seenIds.add(key);
    riotIds.push(riotId);
  }

  return riotIds;
}

export async function resolveRiotAccountByRiotId({ gameName, riot, tagLine }) {
  const account = await riot.fetchAccountByRiotId({
    gameName,
    tagLine,
  });

  if (!account?.puuid) {
    throw new Error("Riot Account-V1 response did not include a PUUID.");
  }

  return {
    gameName: account.gameName ?? gameName,
    puuid: account.puuid,
    riotId: `${account.gameName ?? gameName}#${account.tagLine ?? tagLine}`,
    tagLine: account.tagLine ?? tagLine,
  };
}
