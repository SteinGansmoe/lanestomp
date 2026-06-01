import type { LeagueChampionKnowledgeProfile } from "./types";

export const xerathCombatProfile = {
    profileQuality: "draft",
    abilities: {
      Q: "Arcanopulse",
      W: "Eye of Destruction",
      E: "Shocking Orb",
      R: "Rite of the Arcane",
    },
    archetype: ["artillery mage", "poke", "siege"],
    primaryWinCondition: ["Use Q and W to control space and poke, can have decent map pressure post level 6 due to his ultimate."],
    dangerAbilities: ["E Shocking Orb stun"],
    dangerProfile: {
      dangerousWhen: ["E Shocking Orb stun"],
      mustRespect: [
            "E is his key self-peel tool.",
            "R gives long-range level 6 follow-up.",
            "Positioning is crucial for maximizing his damage potential and survival.",
          ],
    },
    commonWeaknesses: [
      "Immobile and vulnerable to flank or all-in pressure.",
      "Skillshot reliant.",
      "Struggles when enemies dodge poke and force close fights.",
      "Becomes incredibly strong after 2 items are completed."
    ],
    damageType: "magic",
    hardCrowdControl: ["E Shocking Orb stun"],
    id: "Xerath",
    importantAbilityNotes: [
      "E is his key self-peel tool.",
      "R gives long-range level 6 follow-up.",
      "Positioning is crucial for maximizing his damage potential and survival.",
    ],
    lanePlan: {
      avoids: [
            "Immobile and vulnerable to flank or all-in pressure.",
            "Skillshot reliant.",
            "Struggles when enemies dodge poke and force close fights.",
            "Becomes incredibly strong after 2 items are completed."
          ],
      idealLaneState: "Long-range artillery mage who wins through poke, waveclear, and spacing.",
      wants: ["Use Q and W to control space and poke, can have decent map pressure post level 6 due to his ultimate."],
    },
    laneIdentity:
      {
      earlyGameAgency: "high",
      scalingPriority: "medium",
      lanePressure: "high",
      preferredGameState: ["Use Q and W to control space and poke, can have decent map pressure post level 6 due to his ultimate."],
      winLaneBy: ["Use Q and W to control space and poke, can have decent map pressure post level 6 due to his ultimate."],
    },
    majorPowerSpikes: [
      "Level 6 Rite of the Arcane.",
      "First completed mana/AP item.",
    ],
    matchupPreferences: {
      strongInto: [],
      weakInto: [],
    },
    mobilityLevel: "none",
    name: "Xerath",
    offMetaRoles: [],
    strategicIdentity: {
      laneGoal: "control",
      scalingProfile: "mid",
      preferredGameLength: "medium",
      winMethod: ["long-range poke", "wave control", "objective siege"],
    },
    powerSpikes: {
      major: [
        {
          timing: "Level 6",
          reason: "Level 6 Rite of the Arcane",
          changesGameplay: "Xerath's ultimate becomes available, so the matchup shifts around whether the commit, pick, roam, or escape threat is ready.",
          playerAction: "Track R availability and use the window for verified all-ins, picks, roams, or defensive resets rather than forcing blind.",
          enemyResponse: "Respect Xerath's R window, hold key defensive tools for the commit, and punish after R is spent.",
        },
        {
          timing: "First completed mana/AP item",
          reason: "First completed mana/AP item",
          changesGameplay: "Xerath's damage, wave control, or trade reliability improves enough that earlier neutral trades can become losing trades.",
          playerAction: "After the item, pressure waves and trades more confidently while still tracking the enemy's main answer.",
          enemyResponse: "Do not treat pre-item trades as still safe once Xerath's first item threshold is completed.",
        },
      ],
    },
    primaryRoles: ["support"],
    secondaryRoles: ["mid"],
    primaryTradingPattern:
      "Q for long range poke, use W for slow to hit Q easier, and hold E defensively or use if you're guaranteed to hit.",
    punishProfile: {
      canPunish: [],
      strugglesToPunish: [
            "Immobile and vulnerable to flank or all-in pressure.",
            "Skillshot reliant.",
            "Struggles when enemies dodge poke and force close fights.",
            "Becomes incredibly strong after 2 items are completed."
          ],
    },
    shields: [],
    softCrowdControl: ["W Eye of Destruction slow"],
    stealthOrInvisibility: null,
    sustain: [],
    trading: {
      badTradeConditions: [
        "If Xerath uses E and misses he has to play back.",
        "When charging his Q."
      ],
      goodTradeConditions: [],
      primaryPattern: "Q for long range poke, use W for slow to hit Q easier, and hold E defensively or use if you're guaranteed to hit.",
    },
    punishWindows: [
  "If Xerath uses E and misses he has to play back.",
  "When charging his Q."
]
  } satisfies LeagueChampionKnowledgeProfile;
