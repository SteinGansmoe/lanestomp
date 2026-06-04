import type { LeagueChampionKnowledgeProfile } from "./types";

export const azirCombatProfile = {
  profileQuality: "draft",
  abilities: {
    Q: "Conquering Sands",
    W: "Arise!",
    E: "Shifting Sands",
    R: "Emperor's Divide",
  },
  archetype: ["scaling mage", "control", "DPS", "zone control"],
  primaryWinCondition: [
    "Scale into soldier DPS and use controlled spacing to turn lane priority into strong objective fights.",
  ],
  dangerAbilities: ["(R) displacement", "(W) soldier DPS"],
  dangerProfile: {
    dangerousWhen: [
      "Soldiers are positioned between Azir and the enemy.",
      "(R) is available to disengage, isolate, or punish overcommits.",
      "He has enough items to make extended soldier trades meaningful.",
    ],
    mustRespect: [
      "Soldier placement controls the lane more than Azir's own body position.",
      "(R) can deny dives or force enemies into his team.",
      "(E) gives repositioning, but committing with it removes a major escape option.",
    ],
  },
  commonWeaknesses: [
    "Weaker before items and levels give soldiers real threat.",
    "Punishable if (E) or (R) is forced out defensively.",
    "Can struggle when pressured before he sets soldiers and wave control.",
  ],
  damageType: "magic",
  hardCrowdControl: ["(R) displacement"],
  id: "Azir",
  importantAbilityNotes: [
    "(W) creates soldiers and is the center of his trading pattern.",
    "(Q) repositions soldiers for poke and spacing.",
    "(E) is mobility and should not be treated as free engage when danger is nearby.",
    "(R) is a major defensive and teamfight tool.",
  ],
  lanePlan: {
    avoids: [
      "Using (E) aggressively without a safe exit.",
      "Taking early extended fights before soldier DPS is threatening.",
      "Letting assassins force trades before soldiers are placed.",
    ],
    idealLaneState:
      "A controlled mid wave where Azir has CS access, can poke through soldiers, and preserves (E) or (R) against all-ins.",
    wants: [
      "Stable waves that let him farm toward item spikes.",
      "Enemy movement through soldier zones.",
      "Objective setups where soldiers and (R) control space.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "low",
    lanePressure: "medium",
    preferredGameState: [
      "Calm early lane with enough room to farm.",
      "Teamfights around objectives where soldier zones matter.",
      "Longer games where his DPS becomes reliable.",
    ],
    scalingPriority: "very_high",
    winLaneBy: [
      "Maintaining CS access while chipping with soldiers.",
      "Preventing all-ins with disciplined (E) and (R) usage.",
      "Outscaling and controlling fights with soldier positioning.",
    ],
  },
  majorPowerSpikes: [
    "Level 6 (R).",
    "First completed mage DPS item.",
  ],
  matchupPreferences: {
    strongInto: [
      "Short-range champions who must walk through soldiers.",
      "Lanes that cannot punish his early scaling window.",
      "Team compositions that fight front-to-back around objectives.",
    ],
    weakInto: [
      "Early assassins that can force him before he has space.",
      "Long-range poke that outranges soldier control.",
      "Hard engage when (E) and (R) are unavailable.",
    ],
  },
  mobilityLevel: "medium",
  name: "Azir",
  offMetaRoles: [],
      strategicIdentity: {
        laneGoal: "scale",
        scalingProfile: "late",
        preferredGameLength: "long",
        winMethod: ["soldier DPS", "scaling through CS access", "teamfight control"],
      },
      powerSpikes: {
      major: [
        {
          timing: "Level 6",
          reason: "Level 6 (R)",
          changesGameplay: "Level 6 improves his safety and playmaking",
          playerAction: "Track (R) availability and use the window for verified all-ins, picks, roams, or defensive resets rather than forcing blind.",
          enemyResponse: "Respect (R) window, hold key defensive tools for the commit, and punish after (R) is spent.",
        },
        {
          timing: "First completed mage DPS item",
          reason: "First completed mage DPS item",
          changesGameplay: "Item spikes matter because soldier DPS needs time and stats",
          playerAction: "After the item, pressure waves and trades more confidently while still tracking the enemy's main answer.",
          enemyResponse: "Do not treat pre-item trades as still safe once Azir's first item threshold is completed.",
        },
      ],
    },
  primaryRoles: ["mid"],
  secondaryRoles: [],
  primaryTradingPattern:
    "Place soldiers with (W), reposition them with (Q) for short poke, and avoid committing (E) unless the trade or escape is clearly safe.",
  punishProfile: {
    canPunish: [
      "Enemies walking through soldier zones.",
      "Overcommits that can be denied by (R).",
      "Champions who cannot pressure him before item spikes.",
    ],
    strugglesToPunish: [
      "Long-range mages who clear outside soldier range.",
      "Assassins holding mobility until after soldiers are misplaced.",
    ],
  },
  shields: ["(E) shield while dashing to a soldier."],
  softCrowdControl: ["(Q) slow"],
  stealthOrInvisibility: null,
  sustain: [],
  trading: {
    badTradeConditions: [
      "No soldiers are placed in useful space.",
      "(E) is needed defensively and cannot be spent forward.",
      "The enemy can all-in before Azir's DPS ramps.",
    ],
    goodTradeConditions: [
      "The enemy must last-hit near soldiers.",
      "(Q) can reposition soldiers without exposing Azir.",
      "(R) is available to stop a commit.",
    ],
    primaryPattern:
      "Use (W) and (Q) to poke through soldiers, keep distance, and save (E) or (R) for repositioning or disengage.",
  },
  punishWindows: [
    "If Azir uses (E) aggressively, he is easier to collapse on.",
    "If (R) is down, dives and all-ins are much more threatening.",
    "Before items, his extended damage is easier to absorb or punish.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
