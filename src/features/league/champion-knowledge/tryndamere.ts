import type { LeagueChampionKnowledgeProfile } from "./types";

export const tryndamereCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "medium",
  abilities: {
    Q: "Bloodlust",
    W: "Mocking Shout",
    E: "Spinning Slash",
    R: "Undying Rage",
  },
  archetype: ["splitpush", "skirmisher", "crit duelist", "side-lane carry"],
  primaryWinCondition: [
    "Build Fury, force extended side-lane fights, and use (R) to turn low-health all-ins into kills or tower pressure.",
  ],
  dangerAbilities: ["(E) gap close", "(W) slow", "(R) death denial"],
  dangerProfile: {
    dangerousWhen: [
      "Fury is high and his critical strikes can swing short trades.",
      "(E) is available to chase, escape, or reset through combat.",
      "Level 6 lets him commit to fights that would kill most duelists.",
    ],
    mustRespect: [
      "His threat rises sharply when Fury is stacked.",
      "(R) makes normal lethal thresholds unreliable.",
      "Side-lane pressure becomes stronger when he can force one-on-one answers.",
    ],
  },
  commonWeaknesses: [
    "Very limited crowd control.",
    "Can be kited or controlled after (E) is spent.",
    "Struggles when denied Fury, wave access, or clean side-lane duels.",
  ],
  damageType: "physical",
  hardCrowdControl: [],
  id: "Tryndamere",
  importantAbilityNotes: [
    "(Q) heals based on stored Fury and trades damage threat for recovery.",
    "(W) reduces enemy damage and slows targets facing away from him.",
    "(E) is his main mobility and chase tool.",
    "(R) prevents death for a short window and enables committed dives or all-ins.",
  ],
  lanePlan: {
    avoids: [
      "All-inning without Fury or (R) available.",
      "Using (E) forward when the enemy can kite, stun, or disengage cleanly.",
      "Grouping too early when side-lane pressure is his main win condition.",
    ],
    idealLaneState:
      "A long top lane with Fury built, room to chase with (E), and enough wave control to threaten repeated side-lane trades or dives.",
    wants: [
      "Minion access to build Fury before trading.",
      "Extended fights against targets without reliable disengage.",
      "Side-lane waves he can pressure while forcing enemies to answer him.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "medium",
    lanePressure: "medium",
    preferredGameState: [
      "Long side lanes where he can chase with (E).",
      "One-on-one duels after Fury and item spikes.",
      "Splitpush states where (R) creates dive or escape pressure.",
    ],
    scalingPriority: "high",
    winLaneBy: [
      "Trading when Fury is stacked.",
      "Punishing enemies who waste disengage before his (E).",
      "Using (R) to convert low-health fights into side-lane wins.",
    ],
  },
  majorPowerSpikes: ["High Fury trades.", "Level 6 (R).", "Two-item side-lane spike."],
  matchupPreferences: {
    strongInto: [
      "Melee champions with limited disengage.",
      "Targets that cannot stop him during (R).",
      "Side-lane matchups where he can force repeated duels.",
    ],
    weakInto: [
      "Reliable crowd control and disengage.",
      "Ranged champions who deny Fury trades.",
      "Champions that can kite him after (E) is used.",
    ],
  },
  mobilityLevel: "medium",
  name: "Tryndamere",
  offMetaRoles: ["mid"],
  powerSpikes: {
    major: [
      {
        timing: "Level 6",
        reason: "(R) unlocks death denial for committed all-ins",
        changesGameplay:
          "Low-health trades become dangerous because Tryndamere can keep fighting through lethal damage.",
        playerAction:
          "Use (R) windows to force decisive all-ins, dives, or wave crashes instead of taking even trades.",
        enemyResponse:
          "Disengage the (R) duration and punish after it expires or when (E) is down.",
      },
      {
        timing: "Two-item side-lane spike",
        reason: "Critical damage and mobility uptime make his splitpush threat much harder to answer",
        changesGameplay:
          "He can pressure towers and threaten extended duels against many isolated defenders.",
        playerAction:
          "Pull pressure to side lane and force enemies to answer before grouping.",
        enemyResponse:
          "Avoid isolated long fights and coordinate crowd control around his (R).",
      },
    ],
    minor: [
      {
        timing: "High Fury",
        reason: "Stored Fury increases trade threat and can be converted into healing",
        changesGameplay:
          "Short trades become less predictable because critical strikes and (Q) recovery matter more.",
        playerAction:
          "Trade when Fury is high and reset with (Q) only when recovery is more valuable than pressure.",
        enemyResponse:
          "Deny Fury buildup or trade immediately after he spends it on (Q).",
      },
    ],
  },
  primaryRoles: ["top"],
  primaryTradingPattern:
    "Build Fury first, use (E) to enter only when chase is possible, and extend through (R) when the enemy cannot disengage the death-denial window.",
  punishProfile: {
    canPunish: [
      "Enemies who stay near him while Fury is stacked.",
      "Targets that spend disengage before his (E).",
      "Low-health opponents who misjudge (R).",
    ],
    strugglesToPunish: [
      "Champions with reliable slows, stuns, or knockbacks.",
      "Enemies who can kite out (R) and re-engage afterward.",
    ],
  },
  secondaryRoles: [],
  shields: [],
  softCrowdControl: ["(W) slow"],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "splitpush",
    preferredGameLength: "long",
    scalingProfile: "late",
    winMethod: ["side-lane duels", "splitpush pressure", "death-denial all-ins"],
  },
  sustain: ["(Q) healing"],
  trading: {
    badTradeConditions: [
      "Fury is low.",
      "(E) is used forward into reliable crowd control.",
      "(R) is unavailable and the enemy can burst or kite him.",
    ],
    goodTradeConditions: [
      "Fury is stacked.",
      "The enemy's disengage or crowd control is down.",
      "Level 6 or item spikes let him force an extended side-lane fight.",
    ],
    primaryPattern:
      "Stack Fury through the wave, threaten short trades with autos, then use (E) and (R) to force a longer fight only when the enemy cannot kite the window.",
  },
  punishWindows: [
    "When Fury is low, his trade threat and sustain are weaker.",
    "After (E) is used forward, he is much easier to kite or collapse on.",
    "When (R) is unavailable, normal lethal thresholds apply again.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
