import type { LeagueChampionKnowledgeProfile } from "./types";

export const jaxCombatProfile = {
  profileQuality: "draft",
  abilities: {
    Q: "Leap Strike",
    W: "Empower",
    E: "Counter Strike",
    R: "Grandmaster-at-Arms",
  },
  archetype: ["duelist", "splitpush", "scaling fighter", "anti-auto"],
  primaryWinCondition: [
    "Survive or contest early trades around (E), scale into item spikes, and take over side-lane duels through sustained damage.",
  ],
  dangerAbilities: ["(E) dodge and stun", "(Q) leap", "(R) durability"],
  dangerProfile: {
    dangerousWhen: [
      "(E) blocks auto-based damage and sets up a stun.",
      "(Q) can close distance onto vulnerable targets.",
      "Item spikes make extended side-lane fights hard to win against him.",
    ],
    mustRespect: [
      "(E) changes trades heavily against auto attackers.",
      "His scaling makes even lanes dangerous later.",
      "Level 6 and item progression increase his sustained duel power.",
    ],
  },
  commonWeaknesses: [
    "Can be punished when (E) is down.",
    "Some lanes can pressure him before item spikes.",
    "Needs room and time for extended duels.",
  ],
  damageType: "mixed",
  hardCrowdControl: ["(E) stun"],
  id: "Jax",
  importantAbilityNotes: [
    "(Q) leaps to units.",
    "(W) empowers his next attack.",
    "(E) dodges attacks and stuns when recast or expires.",
    "(R) adds durability and enhances every third hit.",
  ],
  lanePlan: {
    avoids: [
      "Using (E) for no trade payoff.",
      "Taking heavy poke before he can force an extended fight.",
      "Fighting early wave states where the enemy can kite him after (Q).",
    ],
    idealLaneState:
      "A scaling top lane where Jax can secure CS, use (E) to deny key trades, and later force long side-lane duels.",
    wants: [
      "Enemy auto attacks committed into (E).",
      "Item spikes before repeated side-lane fights.",
      "Long lanes where (Q) and sustained damage let him chase.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "medium",
    lanePressure: "medium",
    preferredGameState: [
      "Side-lane duels after item spikes.",
      "Auto-attack matchups where (E) is high value.",
      "Long fights where his scaling damage matters.",
    ],
    scalingPriority: "high",
    winLaneBy: [
      "Using (E) to deny the enemy's best trade.",
      "Preserving health and farm to reach item spikes.",
      "Forcing extended side-lane fights later.",
    ],
  },
  majorPowerSpikes: ["Level 6 (R).", "First dueling item.", "Two-item splitpush spike."],
  matchupPreferences: {
    strongInto: [
      "Auto-attack reliant duelists.",
      "Scaling side-lane matchups.",
      "Champions with limited disengage after (E) stun.",
    ],
    weakInto: [
      "Ranged poke and wave denial.",
      "Champions that punish (E) cooldown.",
      "Strong early bullies before item spikes.",
    ],
  },
  mobilityLevel: "medium",
  name: "Jax",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Level 6",
        reason: "(R) improves durability and sustained damage",
        changesGameplay: "Jax can contest longer fights with more confidence.",
        playerAction:
          "Use level 6 to take extended trades only when (E) is available or enemy cooldowns are down.",
        enemyResponse: "Punish him before he stacks damage or after (E) is used.",
      },
      {
        timing: "Two-item side-lane spike",
        reason: "Scaling duel power becomes a major splitpush threat",
        changesGameplay: "Many neutral side-lane matchups become Jax-favored in extended fights.",
        playerAction: "Force side-lane pressure and make enemies answer you one-on-one.",
        enemyResponse: "Avoid isolated long fights and coordinate collapse windows.",
      },
    ],
  },
  primaryRoles: ["top"],
  primaryTradingPattern:
    "Use (E) to block the enemy's main damage, jump with (Q) only when the stun or wave state supports it, and extend after item spikes.",
  punishProfile: {
    canPunish: [
      "Auto attackers during (E).",
      "Enemies who waste disengage before (Q).",
      "Side-lane targets after item spikes.",
    ],
    strugglesToPunish: [
      "Ranged champions who deny leap value.",
      "Enemies who wait out (E) before trading.",
    ],
  },
  secondaryRoles: ["jungle"],
  shields: [],
  softCrowdControl: [],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "splitpush",
    preferredGameLength: "long",
    scalingProfile: "late",
    winMethod: ["scaling duels", "splitpush", "anti-auto trades"],
  },
  sustain: [],
  trading: {
    badTradeConditions: [
      "(E) is down.",
      "The enemy can kite after (Q).",
      "He is fighting before item spikes into stronger early champions.",
    ],
    goodTradeConditions: [
      "Enemy auto attacks are committed into (E).",
      "(Q) can follow a target after they spend mobility.",
      "Item spikes let him win long trades.",
    ],
    primaryPattern:
      "Bait auto-based damage into (E), use the stun window to take a favorable trade, and become more willing to extend as items come online.",
  },
  punishWindows: [
    "After Jax uses (E), his defensive trade tool is gone.",
    "Before item spikes, he can be pressured by stronger early lanes.",
    "If (Q) is used forward without (E), he has less escape.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
