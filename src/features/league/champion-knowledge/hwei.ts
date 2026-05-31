import type { LeagueChampionKnowledgeProfile } from "./types";

export const hweiCombatProfile = {
    profileQuality: "draft",
    abilities: {
      Q: "Subject: Disaster",
      W: "Subject: Serenity",
      E: "Subject: Torment",
      R: "Spiraling Despair",
    },
    archetype: ["artillery mage", "control mage", "poke"],
    primaryWinCondition: ["Use long-range poke and E spellbook CC to control the lane and set up for level 6 all-in with Spiraling Despair."],
    dangerAbilities: ["E spellbook fear or root depending on spell choice"],
    dangerProfile: {
      dangerousWhen: ["E spellbook fear or root depending on spell choice"],
      mustRespect: [
            "Hwei has multiple spellbook choices, but only some provide crowd control.",
            "His defensive answer depends on choosing the right E spell.",
            "He should not be framed as mobile.",
          ],
    },
    commonWeaknesses: [
      "Has more ability options then any other champion, requires a lot of practice to master.",
      "Can be punished by fast all-ins.",
      "Requires correct spell choice under pressure.",
    ],
    damageType: "magic",
    hardCrowdControl: ["E spellbook fear or root depending on spell choice"],
    id: "Hwei",
    importantAbilityNotes: [
      "Hwei has multiple spellbook choices, but only some provide crowd control.",
      "His defensive answer depends on choosing the right E spell.",
      "He should not be framed as mobile.",
    ],
    lanePlan: {
      avoids: [
            "Has more ability options then any other champion, requires a lot of practice to master.",
            "Can be punished by fast all-ins.",
            "Requires correct spell choice under pressure.",
          ],
      idealLaneState: "Long-range control mage who uses spell variety to poke, waveclear, and punish predictable engages.",
      wants: ["Use long-range poke and E spellbook CC to control the lane and set up for level 6 all-in with Spiraling Despair."],
    },
    laneIdentity:
      {
      earlyGameAgency: "high",
      scalingPriority: "medium",
      lanePressure: "high",
      preferredGameState: ["Use long-range poke and E spellbook CC to control the lane and set up for level 6 all-in with Spiraling Despair."],
      winLaneBy: ["Use long-range poke and E spellbook CC to control the lane and set up for level 6 all-in with Spiraling Despair."],
    },
    majorPowerSpikes: [
      "Level 3 access to all basic spellbooks.",
      "Level 6 Spiraling Despair.",
      "First completed mage item.",
    ],
    matchupPreferences: {
      strongInto: [],
      weakInto: [],
    },
    mobilityLevel: "none",
    name: "Hwei",
    offMetaRoles: [],
    powerSpikes: {
      major: [
            "Level 3 access to all basic spellbooks.",
            "Level 6 Spiraling Despair.",
            "First completed mage item.",
          ],
      notes: [],
    },
    primaryRoles: ["mid"],
    secondaryRoles: ["adc", "support"],
    primaryTradingPattern:
      "Control space with long-range spells and hold defensive E choices for enemy engage timing.",
    punishProfile: {
      canPunish: [],
      strugglesToPunish: [
            "Has more ability options then any other champion, requires a lot of practice to master.",
            "Can be punished by fast all-ins.",
            "Requires correct spell choice under pressure.",
          ],
    },
    shields: ["W spellbook can provide shielding depending on spell choice"],
    softCrowdControl: ["Several E and R effects can slow or disrupt"],
    stealthOrInvisibility: null,
    sustain: [],
    trading: {
      badTradeConditions: [
        "If Hwei chooses the wrong E spell for the situation, he can be punished hard.",
        "Skillshot reliant champions can be punished by dodging their key abilities and forcing them into unfavorable trades."
      ],
      goodTradeConditions: [],
      primaryPattern: "Control space with long-range spells and hold defensive E choices for enemy engage timing.",
    },
    punishWindows: [
  "If Hwei chooses the wrong E spell for the situation, he can be punished hard.",
  "Skillshot reliant champions can be punished by dodging their key abilities and forcing them into unfavorable trades."
]
  } satisfies LeagueChampionKnowledgeProfile;
