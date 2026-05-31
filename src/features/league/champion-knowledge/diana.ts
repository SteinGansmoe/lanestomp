import type { LeagueChampionKnowledgeProfile } from "./types";

export const dianaCombatProfile = {
    profileQuality: "draft",
    abilities: {
      Q: "Crescent Strike",
      W: "Pale Cascade",
      E: "Lunar Rush",
      R: "Moonfall",
    },
    archetype: ["assassin", "diver", "skirmisher", "burst"],
    primaryWinCondition: ["Q + E + W combo does very high burst damage, look to land it when electrocute is up."],
    dangerAbilities: ["Q Crescent Strike, E Lunar Rush"],
    dangerProfile: {
      dangerousWhen: ["Q Crescent Strike, E Lunar Rush"],
      mustRespect: [
            "E resets when used on a Moonlight-marked target.",
            "Moonfall is her level 6 teamfight and all-in threat.",
            "W Pale Cascade gives a shield, not sustain.",
          ],
    },
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
    lanePlan: {
      avoids: [
            "Can be punished before she lands Crescent Strike.",
            "Commits forward to trade or all-in.",
            "If E is on cooldown, Diana loses alot of pressure.",
          ],
      idealLaneState: "AP diver who wants short trades until target is in kill range.",
      wants: ["Q + E + W combo does very high burst damage, look to land it when electrocute is up."],
    },
    laneIdentity:
      {
      earlyGameAgency: "medium",
      scalingPriority: "medium",
      lanePressure: "medium",
      preferredGameState: ["Q + E + W combo does very high burst damage, look to land it when electrocute is up."],
      winLaneBy: ["Q + E + W combo does very high burst damage, look to land it when electrocute is up."],
    },
    majorPowerSpikes: [
      "Level 3 unlocks Diana's Q-W-E burst trade with dash reset and shield.",
      "Level 6 Moonfall.",
      "First completed AP skirmish item.",
    ],
    matchupPreferences: {
      strongInto: [],
      weakInto: [],
    },
    mobilityLevel: "high",
    name: "Diana",
    offMetaRoles: [],
    powerSpikes: {
      major: [
            "Level 3 unlocks Diana's Q-W-E burst trade with dash reset and shield.",
            "Level 6 Moonfall.",
            "First completed AP skirmish item.",
          ],
      notes: [],
    },
    primaryRoles: ["jungle"],
    secondaryRoles: ["mid"],
    primaryTradingPattern:
      "While Q is travelling to the target you can use E to get reset.",
    punishProfile: {
      canPunish: [],
      strugglesToPunish: [
            "Can be punished before she lands Crescent Strike.",
            "Commits forward to trade or all-in.",
            "If E is on cooldown, Diana loses alot of pressure.",
          ],
    },
    shields: ["W Pale Cascade"],
    softCrowdControl: [],
    stealthOrInvisibility: null,
    sustain: [],
    trading: {
      badTradeConditions: ["If Diana misses Q, she can be punished hard.",
            "If Diana uses E without resetting cooldown, she will struggle.",
          "Diana's way of all inning is predictable"],
      goodTradeConditions: [],
      primaryPattern: "While Q is travelling to the target you can use E to get reset.",
    },
    punishWindows: ["If Diana misses Q, she can be punished hard.",
      "If Diana uses E without resetting cooldown, she will struggle.",
    "Diana's way of all inning is predictable"]
  } satisfies LeagueChampionKnowledgeProfile;
