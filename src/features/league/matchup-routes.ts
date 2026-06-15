import type { LeagueChampion } from "@/src/features/league/champions";
import { getLeagueMatchupPath } from "@/src/features/league/matchup-route-core";
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
  return getLeagueMatchupPath({ championA, championB, role });
}
