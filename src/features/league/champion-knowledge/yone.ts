import type { LeagueChampionKnowledgeProfile } from "./types";

export const yoneCombatProfile = {
    profileQuality: "draft",
    abilities: {
      Q: "Mortal Steel",
      W: "Spirit Cleave",
      E: "Soul Unbound",
      R: "Fate Sealed",
    },
    archetype: ["skirmisher", "assassin", "melee carry"],
    primaryWinCondition: ["Use E + Q combo to force trades with a planned exit."],
    dangerAbilities: ["E Soul Unbound knockup/stun"],
    dangerProfile: {
      dangerousWhen: ["E Soul Unbound knockup/stun"],
      mustRespect: [
            "E is his main trade extension and snapback tool.",
            "Q third cast creates knockup threat.",
            "A well timed R can instantly turn a fight in his favour.",
          ],
    },
    commonWeaknesses: [
      "When E is used the enemy knows where Yone will be when E is over.",
      "Needs Q setup for knockup threat.",
      "Vulnerable before he can reliably enter and exit trades.",
    ],
    damageType: "mixed",
    hardCrowdControl: ["Q3 knockup", "R Fate Sealed knockup/displacement"],
    id: "Yone",
    importantAbilityNotes: [
      "E is his main trade extension and snapback tool.",
      "Q third cast creates knockup threat.",
      "A well timed R can instantly turn a fight in his favour.",
    ],
    lanePlan: {
      avoids: [
            "When E is used the enemy knows where Yone will be when E is over.",
            "Needs Q setup for knockup threat.",
            "Vulnerable before he can reliably enter and exit trades.",
          ],
      idealLaneState: "Scaling melee carry who uses E + Q combo to force trades with a planned exit.",
      wants: ["Use E + Q combo to force trades with a planned exit."],
    },
    laneIdentity:
      {
      earlyGameAgency: "low",
      scalingPriority: "high",
      lanePressure: "low",
      preferredGameState: ["Use E + Q combo to force trades with a planned exit."],
      winLaneBy: ["Use E + Q combo to force trades with a planned exit."],
    },
    majorPowerSpikes: [
      "Level 3 access to all basic abilities.",
      "First back for more attack speed.",
      "Bork is a great item for him.",
    ],
    matchupPreferences: {
      strongInto: [],
      weakInto: [],
    },
    mobilityLevel: "high",
    name: "Yone",
    offMetaRoles: [],
    powerSpikes: {
      major: [
            "Level 3 access to all basic abilities.",
            "First back for more attack speed.",
            "Bork is a great item for him.",
          ],
      notes: [],
    },
    primaryRoles: ["mid"],
    secondaryRoles: ["top"],
    primaryTradingPattern:
      "Stack Q, use E and second Q to gap close, snap back with E to avoid punishment.",
    punishProfile: {
      canPunish: [],
      strugglesToPunish: [
            "When E is used the enemy knows where Yone will be when E is over.",
            "Needs Q setup for knockup threat.",
            "Vulnerable before he can reliably enter and exit trades.",
          ],
    },
    shields: ["W Spirit Cleave shield"],
    softCrowdControl: ["Q after gaining 2 stacks of Gathering Storm, makes enemies airborne, R blinking behind the last enemy hit and knocking everyone airborne towards him."],
    stealthOrInvisibility: null,
    sustain: [],
    trading: {
      badTradeConditions: [
        "If E is used from a bad position.",
        "If Yone misses key abilities like Q knockup or R displacement."
      ],
      goodTradeConditions: [],
      primaryPattern: "Stack Q, use E and second Q to gap close, snap back with E to avoid punishment.",
    },
    punishWindows: [
  "If E is used from a bad position.",
  "If Yone misses key abilities like Q knockup or R displacement."
]
  } satisfies LeagueChampionKnowledgeProfile;
