import type { LeagueChampionKnowledgeProfile } from "./types";

export const talonCombatProfile = {
    profileQuality: "draft",
    abilities: {
      Q: "Noxian Diplomacy",
      W: "Rake",
      E: "Assassin's Path",
      R: "Shadow Assault",
    },
    archetype: ["assassin", "roam", "burst"],
    primaryWinCondition: ["Push the wave to create roam opportunities, then use E to move around the map quickly."],
    dangerAbilities: ["E Assassin's Path terrain mobility, R Shadow Assault burst and stealth"],
    dangerProfile: {
      dangerousWhen: ["E Assassin's Path terrain mobility, R Shadow Assault burst and stealth"],
      mustRespect: [
            "Assassin's Path gives terrain mobility, not combat crowd control.",
            "Shadow Assault gives level 6 burst and stealth.",
            "E is not a direct engage tool, can only be used on terrain and is best for roaming or repositioning.",
            "Rake return damage and passive bleed matter for trades.",
          ],
    },
    commonWeaknesses: [
      "Can be punished by ranged control before all-in access.",
      "Needs lane movement and flank angles to maximize pressure.",
      "Weaker when forced to stay visible in lane.",
    ],
    damageType: "physical",
    hardCrowdControl: [],
    id: "Talon",
    importantAbilityNotes: [
      "Assassin's Path gives terrain mobility, not combat crowd control.",
      "Shadow Assault gives level 6 burst and stealth.",
      "E is not a direct engage tool, can only be used on terrain and is best for roaming or repositioning.",
      "Rake return damage and passive bleed matter for trades.",
    ],
    lanePlan: {
      avoids: [
            "Can be punished by ranged control before all-in access.",
            "Needs lane movement and flank angles to maximize pressure.",
            "Weaker when forced to stay visible in lane.",
          ],
      idealLaneState: "AD assassin who pushes or trades for roam timers and burst windows.",
      wants: ["Push the wave to create roam opportunities, then use E to move around the map quickly."],
    },
    laneIdentity:
      {
      earlyGameAgency: "low",
      scalingPriority: "high",
      lanePressure: "medium",
      preferredGameState: ["Push the wave to create roam opportunities, then use E to move around the map quickly."],
      winLaneBy: ["Push the wave to create roam opportunities, then use E to move around the map quickly."],
    },
    majorPowerSpikes: [
      "Level 2 access to Q plus W pressure.",
      "Level 6 Shadow Assault.",
      "First completed lethality item.",
    ],
    matchupPreferences: {
      strongInto: [],
      weakInto: [],
    },
    mobilityLevel: "high",
    name: "Talon",
    offMetaRoles: [],
    powerSpikes: {
      major: [
            "Level 2 access to Q plus W pressure.",
            "Level 6 Shadow Assault.",
            "First completed lethality item.",
          ],
      notes: [],
    },
    primaryRoles: ["mid"],
    secondaryRoles: ["jungle"],
    primaryTradingPattern:
      "Land Rake, threaten Q follow-up and passive bleed, then use roam pressure when the wave allows.",
    punishProfile: {
      canPunish: [],
      strugglesToPunish: [
            "Can be punished by ranged control before all-in access.",
            "Needs lane movement and flank angles to maximize pressure.",
            "Weaker when forced to stay visible in lane.",
          ],
    },
    shields: [],
    softCrowdControl: ["W Rake slow on return"],
    stealthOrInvisibility: "R Shadow Assault grants stealth during the burst window.",
    sustain: ["Q Noxian Diplomacy heals on unit kill."],
    trading: {
      badTradeConditions: [
        "When he uses Q he dashes towards the target.",
        "Talon has to wait a while to use E over the same terrain.",
        "Talon's waveclear is not the best, he can be shoved under turret and forced to farm"
      ],
      goodTradeConditions: [],
      primaryPattern: "Land Rake, threaten Q follow-up and passive bleed, then use roam pressure when the wave allows.",
    },
    punishWindows: [
  "When he uses Q he dashes towards the target.",
  "Talon has to wait a while to use E over the same terrain.",
  "Talon's waveclear is not the best, he can be shoved under turret and forced to farm"
]
  } satisfies LeagueChampionKnowledgeProfile;
