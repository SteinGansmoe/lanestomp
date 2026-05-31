import type { LeagueRole } from "../roles";

export type LeagueChampionAbilityKey = "E" | "Q" | "R" | "W";
export type LeagueChampionAbilityMap = Record<
  LeagueChampionAbilityKey,
  string
>;
export type LeagueChampionDamageType = "magic" | "physical" | "mixed";
export type LeagueChampionMobilityLevel =
  | "high"
  | "low"
  | "medium"
  | "none"
  | "very_high";
export type LeagueChampionProfileQuality = "draft" | "reviewed";
export type LeagueChampionLaneIdentityLevel =
  | "high"
  | "low"
  | "medium"
  | "very_high";

export type LeagueChampionLanePlan = {
  avoids: string[];
  idealLaneState: string;
  wants: string[];
};

export type LeagueChampionLaneIdentity = {
  earlyGameAgency: Exclude<LeagueChampionLaneIdentityLevel, "very_high">;
  lanePressure: Exclude<LeagueChampionLaneIdentityLevel, "very_high">;
  preferredGameState: string[];
  scalingPriority: LeagueChampionLaneIdentityLevel;
  winLaneBy: string[];
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
  minor?: string[];
  notes: string[];
};

export type LeagueChampionKnowledgeProfile = {
  abilities?: LeagueChampionAbilityMap;
  archetype?: string[];
  commonWeaknesses?: string[];
  damageType?: LeagueChampionDamageType;
  dangerProfile?: LeagueChampionDangerProfile;
  hardCrowdControl?: string[];
  id: string;
  importantAbilityNotes?: string[];
  lanePlan?: LeagueChampionLanePlan;
  laneIdentity?: string | LeagueChampionLaneIdentity;
  majorPowerSpikes?: string[];
  matchupPreferences?: LeagueChampionMatchupPreferences;
  mobilityLevel?: LeagueChampionMobilityLevel;
  name: string;
  offMetaRoles?: LeagueRole[];
  powerSpikes?: LeagueChampionPowerSpikeProfile;
  primaryRoles?: LeagueRole[];
  primaryTradingPattern?: string;
  profileQuality: LeagueChampionProfileQuality;
  secondaryRoles?: LeagueRole[];
  shields?: string[];
  softCrowdControl?: string[];
  stealthOrInvisibility?: string | null;
  sustain?: string[];
  dangerAbilities?: string[];
  primaryWinCondition?: string[];
  punishProfile?: LeagueChampionPunishProfile;
  punishWindows?: string[];
  trading?: LeagueChampionTradingProfile;
  debugNote?: string;
};
