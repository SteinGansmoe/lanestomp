import type { LeagueChampionKnowledgeProfile } from "./types";

export const olafCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "medium",
  abilities: { Q: "Undertow", W: "Tough It Out", E: "Reckless Swing", R: "Ragnarok" },
  archetype: ["juggernaut", "anti-CC", "all-in", "side-lane"],
  primaryWinCondition: [
    "Hit repeated (Q) axes, force extended fights, and use (R) to ignore crowd control during all-ins or teamfight dives.",
  ],
  dangerAbilities: ["(Q) slow", "(E) true damage", "(R) crowd control immunity"],
  dangerProfile: {
    dangerousWhen: [
      "(Q) lands and he can pick it up.",
      "He is low enough for increased pressure but not burstable.",
      "(R) lets him run through crowd control.",
    ],
    mustRespect: [
      "Disengage tools lose value during (R).",
      "Repeated axes make escape difficult.",
      "Low-health Olaf can still win extended fights.",
    ],
  },
  commonWeaknesses: [
    "Can be kited after (R) ends.",
    "Relies on landing and retrieving (Q).",
    "Falls off if denied early pressure.",
  ],
  damageType: "physical",
  hardCrowdControl: [],
  id: "Olaf",
  importantAbilityNotes: [
    "(Q) can be picked up to reduce cooldown.",
    "(W) gives shield and attack speed.",
    "(E) deals true damage.",
    "(R) grants crowd control immunity while active.",
  ],
  lanePlan: {
    avoids: [
      "Missing axes repeatedly.",
      "Using (R) when enemies can simply disengage.",
      "Taking poke without a path to force contact.",
    ],
    idealLaneState:
      "A long top lane where Olaf can land (Q), chase with repeated axes, and force extended trades before enemies can kite.",
    wants: [
      "Straight-line chase space.",
      "Enemies without mobility.",
      "Fights where CC immunity matters.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "high",
    lanePressure: "high",
    preferredGameState: [
      "Extended melee duels.",
      "Side-lane chase fights.",
      "Teamfights where he can reach carries with (R).",
    ],
    scalingPriority: "medium",
    winLaneBy: [
      "Landing repeated (Q).",
      "Committing through crowd control with (R).",
      "Winning low-health extended trades.",
    ],
  },
  majorPowerSpikes: ["Level 6 (R).", "First fighter item.", "Mid-game side-lane pressure."],
  matchupPreferences: {
    strongInto: [
      "Crowd-control reliant champions.",
      "Low mobility targets.",
      "Melee duelists who cannot kite axes.",
    ],
    weakInto: [
      "Strong disengage after (R).",
      "Ranged poke.",
      "Champions that dodge or deny repeated (Q).",
    ],
  },
  mobilityLevel: "low",
  name: "Olaf",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Level 6",
        reason: "(R) unlocks crowd control immunity",
        changesGameplay: "Normal peel becomes unreliable and Olaf can force straight-line fights.",
        playerAction:
          "Use (R) when you can keep hitting the target, not when they can fully disengage.",
        enemyResponse: "Kite the duration and re-engage after it ends.",
      },
      {
        timing: "First fighter item",
        reason: "Damage and durability support extended all-ins",
        changesGameplay: "Olaf can chase longer and punish missed disengage.",
        playerAction: "Pressure side lane and force fights around axe hits.",
        enemyResponse: "Avoid long lanes and deny axe pickup paths.",
      },
    ],
  },
  primaryRoles: ["top"],
  primaryTradingPattern:
    "Land (Q), pick it up to keep chase going, and extend through (W), (E), and (R) only when the enemy cannot disengage the duration.",
  punishProfile: {
    canPunish: [
      "Targets hit by (Q).",
      "Champions relying on CC during (R).",
      "Low mobility side-lane opponents.",
    ],
    strugglesToPunish: ["Ranged disengage.", "Champions that dodge axes."],
  },
  secondaryRoles: [],
  shields: ["(W) shield"],
  softCrowdControl: ["(Q) slow"],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "snowball",
    preferredGameLength: "medium",
    scalingProfile: "early",
    winMethod: ["axe chase", "anti-CC all-ins", "side-lane duels"],
  },
  sustain: ["Lifesteal from kit and low-health fighting"],
  trading: {
    badTradeConditions: [
      "(Q) misses.",
      "(R) is unavailable into crowd control.",
      "The enemy can kite after he commits.",
    ],
    goodTradeConditions: [
      "(Q) lands and can be picked up.",
      "The enemy's mobility is down.",
      "(R) can ignore key CC.",
    ],
    primaryPattern:
      "Start with axe slow, keep the cooldown low by picking it up, and force long fights when (R) denies peel.",
  },
  punishWindows: [
    "After missed (Q), his chase drops.",
    "After (R), crowd control works again.",
    "If kited at range, he struggles to start fights.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
