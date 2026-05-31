import type { LeagueChampionKnowledgeProfile } from "./types";

export const dianaCombatProfile = {
    archetype: ["assassin", "diver", "skirmisher", "burst"],
    primaryWinCondition: ["Q + E + W combo does very high burst damage, look to land it when electrocute is up."],
    dangerAbilities: ["Q Crescent Strike, E Lunar Rush"],
    commonWeaknesses: [
      "Can be punished before she lands Crescent Strike.",
      "Commits forward to trade or all-in.",
      "If E is on cooldown, Diana loses alot of pressure.",
    ],
    damageType: "magic",
    hardCrowdControl: ["R Moonfall"],
    id: "Diana",
    importantAbilityNotes: [
      "E resets when used on a Moonlight-marked target.",
      "Moonfall is her level 6 teamfight and all-in threat.",
      "W Pale Cascade gives a shield, not sustain.",
    ],
    laneIdentity:
      "AP diver who wants short trades until target is in kill range.",
    majorPowerSpikes: [
      "Level 3 full basic ability access.",
      "Level 6 Moonfall.",
      "First completed AP skirmish item.",
    ],
    mobilityLevel: "high",
    name: "Diana",
    offMetaRoles: [],
    primaryRoles: ["jungle"],
    secondaryRoles: ["mid"],
    primaryTradingPattern:
      "While Q is travelling to the target you can use E to get reset.",
    shields: ["W Pale Cascade"],
    softCrowdControl: [],
    stealthOrInvisibility: null,
    sustain: [],
    punishWindows: ["If Diana misses Q, she can be punished hard.",
      "If Diana uses E without resetting cooldown, she will struggle.",
    "Diana's way of all inning is predictable"]
  } satisfies LeagueChampionKnowledgeProfile;
