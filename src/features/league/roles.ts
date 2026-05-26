export const leagueRoles = ["mid", "top", "jungle", "adc", "support"] as const;

export type LeagueRole = (typeof leagueRoles)[number];

export function isLeagueRole(value: string | undefined): value is LeagueRole {
  return leagueRoles.some((role) => role === value);
}
