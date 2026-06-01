import type { LeagueChampionKnowledgeProfile } from "./types";

export const malzaharCombatProfile = {
    profileQuality: "draft",
    abilities: {
      Q: "Call of the Void",
      W: "Void Swarm",
      E: "Malefic Visions",
      R: "Nether Grasp",
    },
    archetype: ["control mage", "anti-carry", "push"],
    primaryWinCondition: ["Keep midlane pushed permanently, eventually allowing Malzahar to have presence around the map."],
    dangerAbilities: ["R Nether Grasp suppression"],
    dangerProfile: {
      dangerousWhen: ["R Nether Grasp suppression"],
      mustRespect: [
            "Passive Void Shift is a spell shield, not sustain.",
            "Nether Grasp is his level 6 point-and-click lockdown.",
            "Voidlings help push but are vulnerable to area damage.",
          ],
    },
    commonWeaknesses: [
      "He can be punished in the early levels by someone who can counter his push.",
      "Predictable lane pattern.",
      "Ultimate channel can be interrupted by external crowd control.",
    ],
    damageType: "magic",
    hardCrowdControl: ["R Nether Grasp suppression", "Q Call of the Void silence"],
    id: "Malzahar",
    importantAbilityNotes: [
      "Passive Void Shift is a spell shield, not sustain.",
      "Nether Grasp is his level 6 point-and-click lockdown.",
      "Voidlings help push but are vulnerable to area damage.",
    ],
    lanePlan: {
      avoids: [
            "He can be punished in the early levels by someone who can counter his push.",
            "Predictable lane pattern.",
            "Ultimate channel can be interrupted by external crowd control.",
          ],
      idealLaneState: "Push-focused control mage who neutralizes lane and threatens level 6 lockdown.",
      wants: ["Keep midlane pushed permanently, eventually allowing Malzahar to have presence around the map."],
    },
    laneIdentity:
      {
      earlyGameAgency: "medium",
      scalingPriority: "medium",
      lanePressure: "medium",
      preferredGameState: ["Keep midlane pushed permanently, eventually allowing Malzahar to have presence around the map."],
      winLaneBy: ["Keep midlane pushed permanently, eventually allowing Malzahar to have presence around the map."],
    },
    majorPowerSpikes: [
      "Level 6 Nether Grasp.",
      "First completed mana/AP item.",
    ],
    matchupPreferences: {
      strongInto: [],
      weakInto: [],
    },
    mobilityLevel: "none",
    name: "Malzahar",
    offMetaRoles: [],
    strategicIdentity: {
      laneGoal: "control",
      scalingProfile: "mid",
      preferredGameLength: "medium",
      winMethod: ["wave control", "suppression picks", "objective setup"],
    },
    powerSpikes: {
      major: [
        {
          timing: "Level 6",
          reason: "Level 6 Nether Grasp",
          changesGameplay: "Malzahar's ultimate becomes available, so the matchup shifts around whether the commit, pick, roam, or escape threat is ready.",
          playerAction: "Track R availability and use the window for verified all-ins, picks, roams, or defensive resets rather than forcing blind.",
          enemyResponse: "Respect Malzahar's R window, hold key defensive tools for the commit, and punish after R is spent.",
        },
        {
          timing: "First completed mana/AP item",
          reason: "First completed mana/AP item",
          changesGameplay: "Malzahar's damage, wave control, or trade reliability improves enough that earlier neutral trades can become losing trades.",
          playerAction: "After the item, pressure waves and trades more confidently while still tracking the enemy's main answer.",
          enemyResponse: "Do not treat pre-item trades as still safe once Malzahar's first item threshold is completed.",
        },
      ],
    },
    primaryRoles: ["mid"],
    secondaryRoles: ["top"],
    primaryTradingPattern:
      "Push with Malefic Visions and Voidlings, then threaten silence or ultimate when the enemy steps forward.",
    punishProfile: {
      canPunish: [],
      strugglesToPunish: [
            "He can be punished in the early levels by someone who can counter his push.",
            "Predictable lane pattern.",
            "Ultimate channel can be interrupted by external crowd control.",
          ],
    },
    shields: ["Passive Void Shift spell shield"],
    softCrowdControl: [],
    stealthOrInvisibility: null,
    sustain: [],
    trading: {
      badTradeConditions: [
        "Early levels Malzahar can be pushed under tower if enemy focus on killing Voidlings as they spawn",
        "If Malzahar cannot maintain lane pressure, he does not have the tools to counter the push early."
      ],
      goodTradeConditions: [],
      primaryPattern: "Push with Malefic Visions and Voidlings, then threaten silence or ultimate when the enemy steps forward.",
    },
    punishWindows: [
  "Early levels Malzahar can be pushed under tower if enemy focus on killing Voidlings as they spawn",
  "If Malzahar cannot maintain lane pressure, he does not have the tools to counter the push early."
]
  } satisfies LeagueChampionKnowledgeProfile;
