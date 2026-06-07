import { getChampionSlug, type LeagueChampion } from "@/src/features/league/champions";
import type { LeagueRole } from "@/src/features/league/roles";

type MatchupRouteChampion = Pick<LeagueChampion, "id" | "name">;

export function getLeagueMatchupHref({
  championA,
  championB,
  role,
}: {
  championA: MatchupRouteChampion;
  championB: MatchupRouteChampion;
  role: LeagueRole;
}) {
  return `/league/matchups/${getChampionSlug(championA)}-vs-${getChampionSlug(championB)}?role=${role}`;
}
