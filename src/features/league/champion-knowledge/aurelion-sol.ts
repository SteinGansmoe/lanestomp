import type { LeagueChampionKnowledgeProfile } from "./types";

export const aurelionSolCombatProfile = {
    profileQuality: "draft",
    abilities: {
      Q: "Breath of Light",
      W: "Astral Flight",
      E: "Singularity",
      R: "Falling Star / The Skies Descend",
    },
    archetype: ["control mage", "waveclear", "roam", "control", "scaling"],
    primaryWinCondition: [""],
    dangerAbilities: [""],
    dangerProfile: {
      dangerousWhen: [""],
      mustRespect: [
        
          ],
    },
    commonWeaknesses: [
      "Aurelion Sol is weak early game, he's main focus is to farm up and scale into a strong mid-late game threat.",
      "He can be punished by fast all-ins before he has access to his full kit.",
      "He can struggle against champions that can easily dodge his Q and W, as they are his main damage tools.",
    ],
    damageType: "magic",
    hardCrowdControl: [""],
    id: "AurelionSol",
    importantAbilityNotes: [
  
    ],
    lanePlan: {
      avoids: [
            "Aurelion Sol is weak early game, he's main focus is to farm up and scale into a strong mid-late game threat.",
            "He can be punished by fast all-ins before he has access to his full kit.",
            "He can struggle against champions that can easily dodge his Q and W, as they are his main damage tools.",
          ],
      idealLaneState: "Farm-focused control mage who uses his stars for waveclear and roaming, scales into a strong teamfight presence.",
      wants: [""],
    },
    laneIdentity:
      {
      earlyGameAgency: "low",
      scalingPriority: "very_high",
      lanePressure: "medium",
      preferredGameState: [""],
      winLaneBy: [""],
    },
    majorPowerSpikes: [
      "At 75+ stacks hes ultimate gets upgraded",
      "Once Rylais is completed, he becomes much harder to run from",
      "Late game is where Aurelion Sol shines, as his roaming and teamfight presence becomes very impactful",
    ],
    matchupPreferences: {
      strongInto: [],
      weakInto: [],
    },
    mobilityLevel: "medium",
    name: "Aurelion Sol",
    offMetaRoles: ["adc", "support"],
    strategicIdentity: {
      laneGoal: "scale",
      scalingProfile: "late",
      preferredGameLength: "long",
      winMethod: ["stack scaling", "teamfight damage", "map movement"],
    },
    powerSpikes: {
      major: [
        {
          timing: "75+ Stardust stacks",
          reason: "At 75+ stacks his ultimate gets upgraded",
          changesGameplay: "Aurelion Sol's scaling turns more lane-neutral states into teamfight or chase pressure.",
          playerAction: "Play toward stable farm, safe resets, and fights where the scaling payoff can actually matter.",
          enemyResponse: "Pressure earlier windows and avoid letting Aurelion Sol reach the scaling state for free.",
        },
        {
          timing: "Rylai's completed",
          reason: "Once Rylais is completed, he becomes much harder to run from",
          changesGameplay: "Aurelion Sol's damage, wave control, or trade reliability improves enough that earlier neutral trades can become losing trades.",
          playerAction: "After the item, pressure waves and trades more confidently while still tracking the enemy's main answer.",
          enemyResponse: "Do not treat pre-item trades as still safe once Aurelion Sol's first item threshold is completed.",
        },
        {
          timing: "Late game scaling",
          reason: "Late game is where Aurelion Sol shines, as his roaming and teamfight presence becomes very impactful",
          changesGameplay: "Aurelion Sol's scaling turns more lane-neutral states into teamfight or chase pressure.",
          playerAction: "Play toward stable farm, safe resets, and fights where the scaling payoff can actually matter.",
          enemyResponse: "Pressure earlier windows and avoid letting Aurelion Sol reach the scaling state for free.",
        },
      ],
    },
    primaryRoles: ["mid"],
    secondaryRoles: ["support", "top"],
    primaryTradingPattern:
      "E into Q for poke and waveclear",
    punishProfile: {
      canPunish: [],
      strugglesToPunish: [
            "Aurelion Sol is weak early game, he's main focus is to farm up and scale into a strong mid-late game threat.",
            "He can be punished by fast all-ins before he has access to his full kit.",
            "He can struggle against champions that can easily dodge his Q and W, as they are his main damage tools.",
          ],
    },
    shields: [],
    softCrowdControl: [],
    stealthOrInvisibility: null,
    sustain: [""],
    trading: {
      badTradeConditions: [
            "Before Aurelion Sol has access to his full kit, he can be punished by fast all-ins.",
            "He can struggle against champions that can easily dodge his Q and W, as they are his main damage tools."
      ],
      goodTradeConditions: [],
      primaryPattern: "E into Q for poke and waveclear",
    },
    punishWindows: [
      "Before Aurelion Sol has access to his full kit, he can be punished by fast all-ins.",
      "He can struggle against champions that can easily dodge his Q and W, as they are his main damage tools."
]
  } satisfies LeagueChampionKnowledgeProfile;
