import type { LeagueRole } from "../roles";

export type LeagueChampionDamageType = "magic" | "physical" | "mixed";
export type LeagueChampionMobilityLevel =
  | "high"
  | "low"
  | "medium"
  | "none"
  | "very_high";

export type LeagueChampionLanePlan = {
  avoids: string[];
  idealLaneState: string;
  wants: string[];
};

export type LeagueChampionTradingProfile = {
  badTradeConditions: string[];
  goodTradeConditions: string[];
  primaryPattern: string;
};

export type LeagueChampionMatchupPreferences = {
  strongInto: string[];
  weakInto: string[];
};

export type LeagueChampionDangerProfile = {
  dangerousWhen: string[];
  mustRespect: string[];
};

export type LeagueChampionPunishProfile = {
  canPunish: string[];
  strugglesToPunish: string[];
};

export type LeagueChampionPowerSpikeProfile = {
  major: string[];
  notes: string[];
};

export type LeagueChampionKnowledgeProfile = {
  archetype: string[];
  commonWeaknesses: string[];
  damageType: LeagueChampionDamageType;
  dangerProfile?: LeagueChampionDangerProfile;
  hardCrowdControl: string[];
  id: string;
  importantAbilityNotes: string[];
  lanePlan?: LeagueChampionLanePlan;
  laneIdentity: string;
  majorPowerSpikes: string[];
  matchupPreferences?: LeagueChampionMatchupPreferences;
  mobilityLevel: LeagueChampionMobilityLevel;
  name: string;
  offMetaRoles: LeagueRole[];
  powerSpikes?: LeagueChampionPowerSpikeProfile;
  primaryRoles: LeagueRole[];
  primaryTradingPattern: string;
  secondaryRoles: LeagueRole[];
  shields: string[];
  softCrowdControl: string[];
  stealthOrInvisibility: string | null;
  sustain: string[];
  dangerAbilities: string[];
  primaryWinCondition: string[];
  punishProfile?: LeagueChampionPunishProfile;
  punishWindows: string[];
  trading?: LeagueChampionTradingProfile;
  debugNote?: string;
};
