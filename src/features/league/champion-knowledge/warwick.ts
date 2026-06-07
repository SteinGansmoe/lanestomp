import type { LeagueChampionKnowledgeProfile } from "./types";

export const warwickCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "medium",
  abilities: { Q: "Jaws of the Beast", W: "Blood Hunt", E: "Primal Howl", R: "Infinite Duress" },
  archetype: ["drain duelist", "anti-low-health", "suppress", "early fighter"],
  primaryWinCondition: [
    "Use sustain and early dueling to win extended trades, track low-health targets with (W), and lock down commits with (E) fear or (R) suppress.",
  ],
  dangerAbilities: ["(Q) follow and healing", "(E) fear", "(R) suppress"],
  dangerProfile: {
    dangerousWhen: [
      "Enemies fight him while low.",
      "(E) damage reduction and fear are available.",
      "(R) can suppress a target after chase speed.",
    ],
    mustRespect: [
      "His low-health dueling is deceptive.",
      "He can follow movement with held (Q).",
      "Suppression creates pick and gank setup.",
    ],
  },
  commonWeaknesses: [
    "Limited waveclear.",
    "Can be kited before reaching targets.",
    "Falls off if denied early fighting value.",
  ],
  damageType: "mixed",
  hardCrowdControl: ["(E) fear", "(R) suppression"],
  id: "Warwick",
  importantAbilityNotes: [
    "(Q) heals and can follow dashes if held.",
    "(W) senses low-health enemies and gives chase stats.",
    "(E) reduces damage then fears.",
    "(R) leaps and suppresses.",
  ],
  lanePlan: {
    avoids: [
      "Letting ranged champions kite without wave access.",
      "Using (E) before real damage lands.",
      "Missing (R) into a lost extended trade.",
    ],
    idealLaneState:
      "A brawling top lane where Warwick can take extended trades, heal through damage, and punish enemies who stay low.",
    wants: [
      "Extended melee fights.",
      "Low-health enemies to chase.",
      "Enemy burst absorbed by (E).",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "high",
    lanePressure: "medium",
    preferredGameState: ["Early duels.", "Low-health chase skirmishes.", "Pick fights with (R)."],
    scalingPriority: "medium",
    winLaneBy: [
      "Out-sustaining trades.",
      "Fearing enemy commits with (E).",
      "Suppressing key targets with (R).",
    ],
  },
  majorPowerSpikes: ["Level 3 dueling pattern.", "Level 6 (R).", "First dueling or tank item."],
  matchupPreferences: {
    strongInto: [
      "Melee duelists who cannot burst him.",
      "Low-health skirmishes.",
      "Targets vulnerable to suppression.",
    ],
    weakInto: ["Ranged kiting.", "Waveclear denial.", "Disengage after his (R)."],
  },
  mobilityLevel: "medium",
  name: "Warwick",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Level 6",
        reason: "(R) unlocks suppress and long engage",
        changesGameplay: "Warwick can force picks or all-ins from farther away.",
        playerAction: "Use (R) after baiting movement or when the target cannot dodge.",
        enemyResponse: "Sidestep or hold displacement for after suppression.",
      },
      {
        timing: "Level 3",
        reason: "Full basic kit gives sustain, chase, and fear",
        changesGameplay: "Early extended fights can heavily favor Warwick.",
        playerAction: "Take fights where (E) absorbs burst and (Q) keeps health high.",
        enemyResponse: "Keep trades short and avoid fighting while low.",
      },
    ],
  },
  primaryRoles: ["jungle", "top"],
  primaryTradingPattern:
    "Take extended trades with (Q) healing, hold (E) for enemy burst or fear timing, and use (R) to lock down low-health or overextended targets.",
  punishProfile: {
    canPunish: [
      "Low-health enemies.",
      "Melee champions in extended trades.",
      "Targets caught by (R).",
    ],
    strugglesToPunish: ["Ranged champions.", "Enemies who disengage before sustain matters."],
  },
  secondaryRoles: [],
  shields: [],
  softCrowdControl: [],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "snowball",
    preferredGameLength: "medium",
    scalingProfile: "early",
    winMethod: ["drain duels", "low-health chase", "suppression picks"],
  },
  sustain: ["Passive healing", "(Q) healing"],
  trading: {
    badTradeConditions: ["He is kited outside (Q).", "(E) is used before burst.", "(R) misses."],
    goodTradeConditions: [
      "The enemy is low.",
      "The fight stays melee.",
      "(E) can absorb key damage.",
    ],
    primaryPattern:
      "Outlast the enemy in melee range and make low-health retreats unsafe with Blood Hunt and suppression.",
  },
  punishWindows: [
    "If (E) is down, burst is more effective.",
    "After missed (R), his pick threat drops.",
    "Poor waveclear can be exploited by shove and roam.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
