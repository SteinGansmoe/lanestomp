export const leagueRoles = ["mid", "top", "jungle", "adc", "support"] as const;

export type LeagueRole = (typeof leagueRoles)[number];

export function isLeagueRole(value: string | undefined): value is LeagueRole {
  return leagueRoles.some((role) => role === value);
}

export function getLeagueRoleLabel(role: LeagueRole) {
  return role === "adc" ? "ADC" : role.charAt(0).toUpperCase() + role.slice(1);
}
