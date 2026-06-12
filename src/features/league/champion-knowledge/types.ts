import type { LeagueRole } from "../roles";

export type LeagueChampionAbilityKey = "E" | "Q" | "R" | "W";
export type LeagueChampionAbilityMap = Record<LeagueChampionAbilityKey, string>;
export type LeagueChampionDamageType = "magic" | "physical" | "mixed";
export type LeagueChampionMobilityLevel = "high" | "low" | "medium" | "none" | "very_high";
export type LeagueChampionProfileQuality = "draft" | "reviewed";
export type LeagueChampionMasteryDifficulty = "high" | "low" | "medium" | "very_high";
export type LeagueChampionLaneIdentityLevel = "high" | "low" | "medium" | "very_high";
export type LeagueChampionJungleProfileLevel = "high" | "low" | "medium" | "very_high" | "very_low";

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

export type LeagueChampionCounterRelationship = {
  champion: string;
  reasons: string[];
};

export type LeagueChampionDangerProfile = {
  dangerousWhen: string[];
  mustRespect: string[];
};

export type LeagueChampionPunishProfile = {
  canPunish: string[];
  strugglesToPunish: string[];
};

export type LeagueChampionStrategicLaneGoal =
  | "control"
  | "roam"
  | "scale"
  | "snowball"
  | "splitpush"
  | "survive"
  | "teamfight";
export type LeagueChampionStrategicScalingProfile = "early" | "late" | "mid";
export type LeagueChampionStrategicGameLength = "long" | "medium" | "short";

export type LeagueChampionStrategicIdentity = {
  laneGoal: LeagueChampionStrategicLaneGoal;
  preferredGameLength: LeagueChampionStrategicGameLength;
  scalingProfile: LeagueChampionStrategicScalingProfile;
  winMethod: string[];
};

export type LeagueChampionPowerSpike = {
  changesGameplay: string;
  enemyResponse?: string;
  playerAction: string;
  reason: string;
  timing: string;
};

export type LeagueChampionPowerSpikeProfile = {
  major: LeagueChampionPowerSpike[];
  minor?: LeagueChampionPowerSpike[];
};

export type LeagueChampionJungleProfileCategory = {
  notes: string[];
  rating: LeagueChampionJungleProfileLevel;
};

export type LeagueChampionJungleProfile = {
  clearSpeed: LeagueChampionJungleProfileCategory;
  dueling: LeagueChampionJungleProfileCategory;
  earlyGamePressure: LeagueChampionJungleProfileCategory;
  gankThreat: LeagueChampionJungleProfileCategory;
  invadeResistance: LeagueChampionJungleProfileCategory;
  matchupFocus: string[];
  objectiveControl: LeagueChampionJungleProfileCategory;
  pathingNotes: string[];
  scaling: LeagueChampionJungleProfileCategory;
};

export type LeagueChampionSupportSynergy = {
  excellentWith: string[];
  goodWith: string[];
  strugglesWith: string[];
  notes: string[];
};

export type LeagueChampionKnowledgeProfile = {
  abilities?: LeagueChampionAbilityMap;
  archetype?: string[];
  commonWeaknesses?: string[];
  counteredBy?: LeagueChampionCounterRelationship[];
  counters?: LeagueChampionCounterRelationship[];
  damageType?: LeagueChampionDamageType;
  dangerProfile?: LeagueChampionDangerProfile;
  hardCrowdControl?: string[];
  id: string;
  importantAbilityNotes?: string[];
  jungleProfile?: LeagueChampionJungleProfile;
  lanePlan?: LeagueChampionLanePlan;
  laneIdentity?: string | LeagueChampionLaneIdentity;
  majorPowerSpikes?: string[];
  masteryDifficulty?: LeagueChampionMasteryDifficulty;
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
  strategicIdentity: LeagueChampionStrategicIdentity;
  supportSynergy?: LeagueChampionSupportSynergy;
  stealthOrInvisibility?: string | null;
  sustain?: string[];
  dangerAbilities?: string[];
  primaryWinCondition?: string[];
  punishProfile?: LeagueChampionPunishProfile;
  punishWindows?: string[];
  trading?: LeagueChampionTradingProfile;
  debugNote?: string;
};
