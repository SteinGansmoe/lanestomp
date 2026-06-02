import type { LeagueChampionKnowledgeProfile } from "./types";

export const volibearCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "medium",
  abilities: {
    Q: "Thundering Smash",
    W: "Frenzied Maul",
    E: "Sky Splitter",
    R: "Stormbringer",
  },
  archetype: ["juggernaut", "lane bully", "dive threat", "durable brawler"],
  primaryWinCondition: [
    "Use early lane pressure, repeated (W) trades, and level 6 dive threat to force health leads before transitioning into durable engage or side pressure.",
  ],
  dangerAbilities: ["(Q) stun", "(W) repeat bite", "(E) shield and slow", "(R) dive"],
  dangerProfile: {
    dangerousWhen: [
      "(Q) is available to force contact and stun.",
      "A target is marked for a second (W) and cannot disengage.",
      "Level 6 lets him threaten dives or extended fights under towers.",
    ],
    mustRespect: [
      "His early lane pressure is high when he can walk into melee range.",
      "A second (W) is much more dangerous than the first.",
      "(R) changes tower-defense and dive calculations.",
    ],
  },
  commonWeaknesses: [
    "Can be kited when (Q) does not reach the target.",
    "Needs repeated contact for full (W) value.",
    "Falls off if early pressure does not create tempo or durability leads.",
  ],
  damageType: "mixed",
  hardCrowdControl: ["(Q) stun"],
  id: "Volibear",
  importantAbilityNotes: [
    "(Q) gives movement speed and stuns on the next attack.",
    "(W) marks targets and heals Volibear when used again on the same target.",
    "(E) slows enemies and shields Volibear if he stands in the strike.",
    "(R) leaps, deals damage, grants durability, and disables towers briefly.",
  ],
  lanePlan: {
    avoids: [
      "Chasing through waves or spacing where (Q) cannot connect.",
      "Ending trades before second (W) value when he chose to commit.",
      "Using (R) without enough follow-up to convert the dive or fight.",
    ],
    idealLaneState:
      "A pressured top wave where Volibear can threaten (Q), land (E) around the trade path, and force repeated (W) contact.",
    wants: [
      "Early melee access before scaling champions stabilize.",
      "Health leads that make level 6 dives realistic.",
      "Extended brawls where second (W) healing and (E) shield matter.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "high",
    lanePressure: "high",
    preferredGameState: [
      "Early brawls against champions who cannot kite him.",
      "Dive windows after level 6.",
      "Skirmishes where durability and repeat (W) healing matter.",
    ],
    scalingPriority: "medium",
    winLaneBy: [
      "Forcing early health advantages with (Q) and (W).",
      "Punishing enemies who cannot deny second (W).",
      "Converting level 6 into dive pressure or forced recalls.",
    ],
  },
  majorPowerSpikes: ["Level 3 brawl pattern.", "Level 6 (R).", "First bruiser or tank item."],
  matchupPreferences: {
    strongInto: [
      "Melee champions with weak disengage.",
      "Scaling lanes vulnerable to early pressure.",
      "Targets that cannot stop his second (W).",
    ],
    weakInto: [
      "Ranged poke and slows that deny (Q).",
      "Disengage that prevents repeated contact.",
      "Champions that outscale if he cannot create early pressure.",
    ],
  },
  mobilityLevel: "medium",
  name: "Volibear",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Level 6",
        reason: "(R) unlocks dive threat and extra durability",
        changesGameplay:
          "Tower positions become less safe because Volibear can force committed fights under turret.",
        playerAction:
          "Use health leads and wave crashes to threaten dives or force enemies off the wave.",
        enemyResponse:
          "Avoid defending low-health waves alone when Volibear has (R).",
      },
      {
        timing: "First bruiser or tank item",
        reason: "Durability makes repeated (W) trades more reliable",
        changesGameplay:
          "He can stay in fights long enough to reach second (W) and absorb return damage.",
        playerAction:
          "Pressure trades and skirmishes while tracking enemy disengage.",
        enemyResponse:
          "Keep trades short and punish him when (Q) or (E) misses.",
      },
    ],
    minor: [
      {
        timing: "Level 3",
        reason: "Full basic ability pattern gives stun, repeat damage, shield, and slow",
        changesGameplay:
          "Volibear can threaten a complete brawl if the enemy is inside (Q) range.",
        playerAction:
          "Look for controlled trades where (E) and second (W) can connect.",
        enemyResponse:
          "Do not give him a straight-line path into melee range.",
      },
    ],
  },
  primaryRoles: ["top"],
  primaryTradingPattern:
    "Use (Q) to force contact, place (E) where the fight will happen, and extend for second (W) only when the enemy cannot kite out.",
  punishProfile: {
    canPunish: [
      "Enemies who step into (Q) range.",
      "Targets marked for second (W).",
      "Low-health enemies defending towers after level 6.",
    ],
    strugglesToPunish: [
      "Champions who kite his (Q) approach.",
      "Enemies who deny repeated contact after first (W).",
    ],
  },
  secondaryRoles: ["jungle"],
  shields: ["(E) shield"],
  softCrowdControl: ["(E) slow"],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "snowball",
    preferredGameLength: "medium",
    scalingProfile: "early",
    winMethod: ["early lane pressure", "tower dives", "durable brawls"],
  },
  sustain: ["(W) heal on repeat target"],
  trading: {
    badTradeConditions: [
      "(Q) cannot reach the enemy.",
      "The enemy can leave before second (W).",
      "(E) is missed or used where he cannot stand in it.",
    ],
    goodTradeConditions: [
      "The enemy has no disengage for (Q).",
      "The target is marked and second (W) can land.",
      "A wave crash and (R) make a dive or forced recall realistic.",
    ],
    primaryPattern:
      "Start with (Q), align (E) with the fight path, and keep fighting only when second (W) healing or level 6 dive threat will decide the trade.",
  },
  punishWindows: [
    "After (Q) is used, Volibear has less reliable engage.",
    "If he cannot land second (W), his sustain plan loses value.",
    "Before level 6, tower positions are safer against his all-in plan.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
