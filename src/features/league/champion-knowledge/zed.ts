import type { LeagueChampionKnowledgeProfile } from "./types";

export const zedCombatProfile = {
    profileQuality: "draft",
    abilities: {
      Q: "Razor Shuriken",
      W: "Living Shadow",
      E: "Shadow Slash",
      R: "Death Mark",
    },
    archetype: ["skirmisher", "assassin", "melee carry", "burst"],
    primaryWinCondition: ["Take down enemy carries with his high burst and mobility."],
    dangerAbilities: ["W + E + Q combo, R Death Mark"],
    dangerProfile: {
      dangerousWhen: ["W + E + Q combo, R Death Mark"],
      mustRespect: [
            "Dodging Q is key to trading with Zed.",
            "R is his main all-in tool, it can be used to dodge key abilities or finish off targets.",
            "W + E is almost impossible to dodge, stay focused on dodging Q",
          ],
    },
    commonWeaknesses: [
      "Very weak from level 1-3, can be bullied by strong early laners.",
      "Falls off if he can't get on carries in fights.",
      "Hard to damage more then one target in fights due to his single-target focus.",
    ],
    damageType: "physical",
    hardCrowdControl: [],
    id: "Zed",
    importantAbilityNotes: [
      "Dodging Q is key to trading with Zed.",
      "R is his main all-in tool, it can be used to dodge key abilities or finish off targets.",
      "W + E is almost impossible to dodge, stay focused on dodging Q",
    ],
    lanePlan: {
      avoids: [
            "Very weak from level 1-3, can be bullied by strong early laners.",
            "Falls off if he can't get on carries in fights.",
            "Hard to damage more then one target in fights due to his single-target focus.",
          ],
      idealLaneState: "Pick-focused AD assassin who looks to burst carries and dodge key abilities.",
      wants: ["Take down enemy carries with his high burst and mobility."],
    },
    laneIdentity:
      {
      earlyGameAgency: "high",
      scalingPriority: "medium",
      lanePressure: "high",
      preferredGameState: ["Take down enemy carries with his high burst and mobility."],
      winLaneBy: ["Take down enemy carries with his high burst and mobility."],
    },
    majorPowerSpikes: [
      "After level 3 he has access to his full combo.",
      "Level 6 Death Mark.",
      "First completed lethality item.",
    ],
    matchupPreferences: {
      strongInto: [],
      weakInto: [],
    },
    mobilityLevel: "high",
    name: "Zed",
    offMetaRoles: [],
    powerSpikes: {
      major: [
            "After level 3 he has access to his full combo.",
            "Level 6 Death Mark.",
            "First completed lethality item.",
          ],
      notes: [],
    },
    primaryRoles: ["mid"],
    secondaryRoles: ["jungle"],
    primaryTradingPattern:
      "W + E for guaranteed damage, use Q to poke and finish, then R for all-in.",
    punishProfile: {
      canPunish: [],
      strugglesToPunish: [
            "Very weak from level 1-3, can be bullied by strong early laners.",
            "Falls off if he can't get on carries in fights.",
            "Hard to damage more then one target in fights due to his single-target focus.",
          ],
    },
    shields: [],
    softCrowdControl: ["E Living Shadow slow"],
    stealthOrInvisibility: null,
    sustain: [""],
    trading: {
      badTradeConditions: [
            "Before level 3, Zed is very vulnerable to pressure and can be bullied out of lane.",
            "If Zed uses W to engage and misses combo, he can be punished hard.",
      ],
      goodTradeConditions: [],
      primaryPattern: "W + E for guaranteed damage, use Q to poke and finish, then R for all-in.",
    },
    punishWindows: [
      "Before level 3, Zed is very vulnerable to pressure and can be bullied out of lane.",
      "If Zed uses W to engage and misses combo, he can be punished hard.",
]
  } satisfies LeagueChampionKnowledgeProfile;
