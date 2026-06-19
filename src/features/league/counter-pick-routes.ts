import type { LeagueChampion } from "./champions";
import { isLeagueRole, type LeagueRole } from "./roles.ts";

export const counterPickBasePath = "/league/counters";

export function buildCounterPickUrl({
  champion,
  champions,
  role,
}: {
  champion: LeagueChampion | string | null | undefined;
  champions?: LeagueChampion[];
  role: LeagueRole | string | null | undefined;
}) {
  const normalizedRole = isLeagueRole(role ?? undefined) ? role : null;

  if (!normalizedRole) {
    return null;
  }

  const resolvedChampion =
    typeof champion === "string"
      ? resolveCounterPickChampion(champions ?? [], champion)
      : champion ?? null;

  if (!resolvedChampion) {
    return null;
  }

  const params = new URLSearchParams({
    champion: getCounterPickChampionQueryValue(resolvedChampion),
    role: normalizedRole,
  });

  return `${counterPickBasePath}?${params.toString()}`;
}

export function getCounterPickChampionQueryValue(champion: Pick<LeagueChampion, "id">) {
  return champion.id;
}

export function resolveCounterPickChampion(
  champions: LeagueChampion[],
  value: string | null | undefined,
) {
  if (!value) {
    return null;
  }

  const normalizedValue = normalizeCounterPickChampionLookupKey(value);

  return (
    champions.find((champion) =>
      [
        champion.id,
        champion.name,
        champion.slug ?? "",
        champion.riot_key,
        champion.riot_data_key ?? "",
      ].some((candidate) => normalizeCounterPickChampionLookupKey(candidate) === normalizedValue),
    ) ?? null
  );
}

export function normalizeCounterPickChampionLookupKey(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}
