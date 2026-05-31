import type { LeagueChampionKnowledgeProfile } from "./types";

export const oriannaCombatProfile = {
    profileQuality: "draft",
    abilities: {
      Q: "Command: Attack",
      W: "Command: Dissonance",
      E: "Command: Protect",
      R: "Command: Shockwave",
    },
    archetype: ["control mage", "teamfight", "scaling"],
    primaryWinCondition: ["Control the lane with ball placement and create opportunities for teamfighting."],
    dangerAbilities: ["R Command: Shockwave displacement"],
    dangerProfile: {
      dangerousWhen: ["R Command: Shockwave displacement"],
      mustRespect: [
            "Ball position controls her threat zone.",
            "Command: Protect gives a shield.",
            "Shockwave is her level 6 teamfight spike.",
          ],
    },
    commonWeaknesses: [
      "Immobile and vulnerable to direct all-ins.",
      "Needs ball position to threaten or defend.",
      "Can be pressured before enough mana and AP.",
    ],
    damageType: "magic",
    hardCrowdControl: ["R Command: Shockwave displacement"],
    id: "Orianna",
    importantAbilityNotes: [
      "Ball position controls her threat zone.",
      "Command: Protect gives a shield.",
      "Shockwave is her level 6 teamfight spike.",
    ],
    lanePlan: {
      avoids: [
            "Immobile and vulnerable to direct all-ins.",
            "Needs ball position to threaten or defend.",
            "Can be pressured before enough mana and AP.",
          ],
      idealLaneState: "Control mage who wins through spacing, ball control, wave management, and teamfight setup.",
      wants: ["Control the lane with ball placement and create opportunities for teamfighting."],
    },
    laneIdentity:
      {
      earlyGameAgency: "low",
      scalingPriority: "high",
      lanePressure: "medium",
      preferredGameState: ["Control the lane with ball placement and create opportunities for teamfighting."],
      winLaneBy: ["Control the lane with ball placement and create opportunities for teamfighting."],
    },
    majorPowerSpikes: [
      "Level 3 full basic ability access.",
      "Level 6 Command: Shockwave.",
      "First completed mage item.",
    ],
    matchupPreferences: {
      strongInto: [],
      weakInto: [],
    },
    mobilityLevel: "none",
    name: "Orianna",
    offMetaRoles: [],
    powerSpikes: {
      major: [
            "Level 3 full basic ability access.",
            "Level 6 Command: Shockwave.",
            "First completed mage item.",
          ],
      notes: [],
    },
    primaryRoles: ["mid"],
    secondaryRoles: [],
    primaryTradingPattern:
      "Use ball placement to zone and poke, then shield or speed herself through return trades.",
    punishProfile: {
      canPunish: [],
      strugglesToPunish: [
            "Immobile and vulnerable to direct all-ins.",
            "Needs ball position to threaten or defend.",
            "Can be pressured before enough mana and AP.",
          ],
    },
    shields: ["E Command: Protect"],
    softCrowdControl: ["W Command: Dissonance slow/speed zone"],
    stealthOrInvisibility: null,
    sustain: [],
    trading: {
      badTradeConditions: [
        "Punish early while Q has a longer cooldown.",
        "She can be punished if she uses her abilities recklessly."
      ],
      goodTradeConditions: [],
      primaryPattern: "Use ball placement to zone and poke, then shield or speed herself through return trades.",
    },
    punishWindows: [
  "Punish early while Q has a longer cooldown.",
  "She can be punished if she uses her abilities recklessly."
]
  } satisfies LeagueChampionKnowledgeProfile;
