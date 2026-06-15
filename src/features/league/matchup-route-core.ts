export type ChampionSlugSource = {
  name: string;
};

export type LeagueMatchupPathInput = {
  championA: ChampionSlugSource;
  championB: ChampionSlugSource;
  role: string;
};

export function slugifyChampionName(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getChampionSlug(champion: ChampionSlugSource) {
  return slugifyChampionName(champion.name);
}

export function getLeagueMatchupPath({
  championA,
  championB,
  role,
}: LeagueMatchupPathInput) {
  return `/league/matchups/${getChampionSlug(championA)}-vs-${getChampionSlug(championB)}?role=${role}`;
}

export function getLeagueMatchupUrl(
  baseUrl: string,
  matchup: LeagueMatchupPathInput,
) {
  return `${baseUrl.replace(/\/$/, "")}${getLeagueMatchupPath(matchup)}`;
}
