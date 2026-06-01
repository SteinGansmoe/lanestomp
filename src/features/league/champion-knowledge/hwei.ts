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
      "Level 3 unlocks all three spellbooks for full poke, control, and shield options.",
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
        {
          timing: "Level 6",
          reason: "Level 6 Spiraling Despair",
          changesGameplay: "Hwei's ultimate becomes available, so the matchup shifts around whether the commit, pick, roam, or escape threat is ready.",
          playerAction: "Track R availability and use the window for verified all-ins, picks, roams, or defensive resets rather than forcing blind.",
          enemyResponse: "Respect Hwei's R window, hold key defensive tools for the commit, and punish after R is spent.",
        },
        {
          timing: "First completed mage item",
          reason: "First completed mage item",
          changesGameplay: "Hwei's damage, wave control, or trade reliability improves enough that earlier neutral trades can become losing trades.",
          playerAction: "After the item, pressure waves and trades more confidently while still tracking the enemy's main answer.",
          enemyResponse: "Do not treat pre-item trades as still safe once Hwei's first item threshold is completed.",
        },
      ],
      minor: [
        {
          timing: "Level 3",
          reason: "Level 3 unlocks all three spellbooks for full poke, control, and shield options",
          changesGameplay: "Hwei gains access to his full toolkit, but the spike is about options and safety more than sudden lethal pressure.",
          playerAction: "Use the extra spellbook coverage to control space, thin waves, and keep defensive tools available.",
          enemyResponse: "Pressure him when key control or shield options are spent instead of treating level 3 as an all-in spike.",
        },
      ],
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
