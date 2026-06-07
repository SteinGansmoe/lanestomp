import type { LeagueChampionKnowledgeProfile } from "./types";

export const renektonCombatProfile = {
  profileQuality: "draft",
  abilities: {
    Q: "Cull the Meek",
    W: "Ruthless Predator",
    E: "Slice and Dice",
    R: "Dominus",
  },
  archetype: ["fighter", "lane bully", "dash", "burst trade"],
  primaryWinCondition: [
    "Use fury-enhanced short trades and early wave control to build a lead before scaling duelists or teamfighters stabilize.",
  ],
  dangerAbilities: ["Empowered (W)", "(E) double dash", "(R) all-in durability"],
  dangerProfile: {
    dangerousWhen: [
      "Fury is high and empowered (W) is available.",
      "(E) can dash in and still has a second cast to exit or chase.",
      "Level 6 adds health and sustained damage for all-ins.",
    ],
    mustRespect: [
      "Empowered (W) can stun and chunk quickly.",
      "(E) gives both engage and disengage if managed well.",
      "His early lane pressure is strongest before opponents outscale.",
    ],
  },
  commonWeaknesses: [
    "Falls off if he does not create pressure early.",
    "Predictable trade windows around fury.",
    "Punishable after using both (E) casts forward.",
  ],
  damageType: "physical",
  hardCrowdControl: ["(W) stun"],
  id: "Renekton",
  importantAbilityNotes: [
    "Fury empowers abilities.",
    "(W) is the key stun and burst tool.",
    "(E) can be cast twice if the first dash hits.",
    "(R) adds health and area damage.",
  ],
  lanePlan: {
    avoids: [
      "Trading with low fury into champions ready to answer.",
      "Using both (E) casts forward without lethal or wave support.",
      "Letting scaling lanes farm freely through early levels.",
    ],
    idealLaneState:
      "A top wave where Renekton can stack fury, dash in for empowered (W) trades, and reset before the enemy's extended damage wins.",
    wants: [
      "Fury stacked before key trades.",
      "Short burst trades with a clean exit.",
      "Early level and wave pressure before scaling matchups stabilize.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "high",
    lanePressure: "high",
    preferredGameState: [
      "Early waves where he controls tempo.",
      "Short burst trades around fury.",
      "Dive or skirmish setups with lane priority.",
    ],
    scalingPriority: "low",
    winLaneBy: [
      "Stacking fury and forcing empowered trades.",
      "Crashing waves into dives or plates.",
      "Punishing weak early champions before level or item scaling.",
    ],
  },
  majorPowerSpikes: ["Level 3 with full basic combo.", "Level 6 (R).", "First item."],
  matchupPreferences: {
    strongInto: [
      "Weak early scalers.",
      "Melee champions vulnerable to stun burst.",
      "Lanes where he can control the first waves.",
    ],
    weakInto: [
      "Champions that survive early and outscale.",
      "Disengage that wastes his fury trade.",
      "Ranged poke that denies fury setup.",
    ],
  },
  mobilityLevel: "medium",
  name: "Renekton",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Level 3",
        reason: "Renekton has (Q), (W), and (E) for his full short-trade pattern",
        changesGameplay:
          "He can dash in, stun, damage, and exit before many top laners can fully answer.",
        playerAction: "Trade only with enough fury and a planned exit path.",
        enemyResponse: "Respect fury and punish when both (E) casts are spent.",
      },
      {
        timing: "Level 6",
        reason: "(R) adds health and sustained all-in damage",
        changesGameplay: "Renekton can convert short-trade leads into full all-ins and dives.",
        playerAction:
          "Use (R) to force a decisive fight when the enemy is already chipped or trapped.",
        enemyResponse: "Avoid staying low under wave pressure after level 6.",
      },
    ],
  },
  primaryRoles: ["top"],
  primaryTradingPattern:
    "Build fury, dash in with (E), use empowered (W), use (Q) and then exit with the second (E) unless the all-in is clearly winning.",
  punishProfile: {
    canPunish: [
      "Scaling champions before they stabilize.",
      "Enemies who step up when his fury is high.",
      "Targets without mobility after (E) closes distance.",
    ],
    strugglesToPunish: [
      "Champions that disengage his stun trade.",
      "Lanes where he cannot control early wave tempo.",
    ],
  },
  secondaryRoles: ["mid"],
  shields: [],
  softCrowdControl: [],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "snowball",
    preferredGameLength: "short",
    scalingProfile: "early",
    winMethod: ["early lane pressure", "high fury trades", "dives and skirmishes"],
  },
  sustain: ["(Q) healing, improved with fury"],
  trading: {
    badTradeConditions: [
      "Low fury.",
      "Second (E) is not available for exit.",
      "The enemy can survive the burst and force an extended fight.",
    ],
    goodTradeConditions: [
      "High fury and (W) available.",
      "Enemy key cooldown is down.",
      "Wave state lets him dash in and out safely.",
      "All 3 of his abilities are up for a full combo.",
    ],
    primaryPattern:
      "Use fury as the trade timer, take explosive short trades with (E) plus empowered (W), finish with (Q) and dash away with the second (E).",
  },
  punishWindows: [
    "When fury is low, Renekton's burst is weaker.",
    "If he uses both (E) casts forward, he is easier to punish.",
    "If he fails to gain early advantage, scaling matchups become harder.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
