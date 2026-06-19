import type { LeagueChampion } from "./champions";
import {
  getChampionRoles,
  isChampionInRole,
  sortChampionsForRole,
} from "./champion-roles.ts";
import type { LeagueRole } from "./roles";
import { normalizeCounterPickChampionLookupKey } from "./counter-pick-routes.ts";

export type CounterPickChampionOption = {
  champion: LeagueChampion;
  isOffRole: boolean;
  roleLabels: LeagueRole[];
};

export function getCounterPickChampionOptionsForRole({
  champions,
  query,
  role,
}: {
  champions: LeagueChampion[];
  query: string;
  role: LeagueRole | null;
}) {
  if (!role) {
    return [];
  }

  const normalizedQuery = normalizeCounterPickChampionLookupKey(query);
  const roleChampions = sortChampionsForRole(
    champions.filter((champion) => isChampionInRole(champion, role)),
    role,
  );

  if (!normalizedQuery) {
    return toCounterPickChampionOptions(roleChampions, role);
  }

  const roleMatches = roleChampions.filter((champion) =>
    matchesCounterPickChampionQuery(champion, normalizedQuery),
  );
  const exactOffRoleMatches = champions.filter(
    (champion) =>
      !isChampionInRole(champion, role) &&
      isExactCounterPickChampionQueryMatch(champion, normalizedQuery),
  );

  return toCounterPickChampionOptions([...roleMatches, ...exactOffRoleMatches], role);
}

export function isCounterPickChampionSupportedInRole(
  champion: Pick<LeagueChampion, "id">,
  role: LeagueRole,
) {
  return isChampionInRole(champion, role);
}

function toCounterPickChampionOptions(champions: LeagueChampion[], role: LeagueRole) {
  const seenChampionIds = new Set<string>();
  const options: CounterPickChampionOption[] = [];

  for (const champion of champions) {
    if (seenChampionIds.has(champion.id)) {
      continue;
    }

    seenChampionIds.add(champion.id);
    options.push({
      champion,
      isOffRole: !isChampionInRole(champion, role),
      roleLabels: getChampionRoles(champion),
    });
  }

  return options;
}

function matchesCounterPickChampionQuery(
  champion: Pick<LeagueChampion, "id" | "name" | "slug">,
  normalizedQuery: string,
) {
  return getCounterPickChampionSearchKeys(champion).some((key) => key.includes(normalizedQuery));
}

function isExactCounterPickChampionQueryMatch(
  champion: Pick<LeagueChampion, "id" | "name" | "slug">,
  normalizedQuery: string,
) {
  return getCounterPickChampionSearchKeys(champion).some((key) => key === normalizedQuery);
}

function getCounterPickChampionSearchKeys(champion: Pick<LeagueChampion, "id" | "name" | "slug">) {
  return [champion.id, champion.name, champion.slug ?? ""].map(normalizeCounterPickChampionLookupKey);
}
