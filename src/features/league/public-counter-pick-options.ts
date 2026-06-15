import type { LeagueChampion } from "./champions";

export function getPublicCounterPickChampionSearchText(
  champion: Pick<LeagueChampion, "id" | "name" | "riot_data_key" | "slug" | "tags" | "title">,
  roleLabels: readonly string[] = [],
) {
  return [
    champion.id,
    champion.name,
    champion.riot_data_key ?? "",
    champion.slug ?? "",
    champion.title,
    champion.tags.join(" "),
    roleLabels.join(" "),
  ]
    .map(normalizePublicCounterPickSearchValue)
    .filter(Boolean)
    .join(" ");
}

export function matchesPublicCounterPickChampionSearch(
  champion: Pick<LeagueChampion, "id" | "name" | "riot_data_key" | "slug" | "tags" | "title">,
  query: string,
  roleLabels: readonly string[] = [],
) {
  const normalizedQuery = normalizePublicCounterPickSearchValue(query);

  if (!normalizedQuery) {
    return true;
  }

  return getPublicCounterPickChampionSearchText(champion, roleLabels).includes(normalizedQuery);
}

export function normalizePublicCounterPickSearchValue(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}
