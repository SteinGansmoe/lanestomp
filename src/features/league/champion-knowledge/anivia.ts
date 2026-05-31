import type { LeagueChampionKnowledgeProfile } from "./types";

export const aniviaCombatProfile = {
    archetype: ["mage", "zoner", "control", "waveclear"],
    primaryWinCondition: ["Farm up and use her strong waveclear and zoning to control the lane and look for picks."],
    dangerAbilities: ["Q Flash Frost stun", "R Glacial Storm slow and damage"],
    commonWeaknesses: [
      "Anivia is very slow, if she is caught she can die easily.",
      "She has a hard time escaping if her flash is down.",
      "She can be punished by fast all-ins.",
    ],
    damageType: "magic",
    hardCrowdControl: ["Q Flash Frost stun"],
    id: "Anivia",
    importantAbilityNotes: [
      "Q is best used together with other abilities as its not always easy to land",
      "W can be used to block movement, also used to force enemy to move into Q if placed properly",
      "E is her main single target damage spell, use it after target is hit by Q for max damage",
      "R is her main zoning and teamfight tool, it can be used to block off areas and force enemies into unfavorable positions",
    ],
    laneIdentity:
      "Anivia is a mage who excels at waveclear and zoning.",
    majorPowerSpikes: [
      "After 6 and Lost chapter, Anivia can basically free farm waves mid.",
      "Its hard to siege into Anivia after 6 because of her R, so she can often get picks or force fights on her terms.",
    ],
    mobilityLevel: "low",
    name: "Anivia",
    offMetaRoles: ["top"],
    primaryRoles: ["mid"],
    secondaryRoles: ["adc", "support"],
    primaryTradingPattern:
      "Q Flash Frost is her main trading and pick tool, E Frostbite is her main damage tool, and R Glacial Storm is her main zoning and teamfight tool.",
    shields: [],
    softCrowdControl: ["slow from R Glacial Storm"],
    stealthOrInvisibility: null,
    sustain: [""],
    punishWindows: [
      "If Anivia misses Q, thats when to punish her.",

]
  } satisfies LeagueChampionKnowledgeProfile;
