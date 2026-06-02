import type { LeagueChampionKnowledgeProfile } from "./types";

export const fioraCombatProfile = {
  profileQuality: "draft",
  abilities: {
    Q: "Lunge",
    W: "Riposte",
    E: "Bladework",
    R: "Grand Challenge",
  },
  archetype: ["duelist", "splitpush", "mobility", "true damage"],
  primaryWinCondition: [
    "Win side-lane duels by proccing vitals, saving (W) for key control, and scaling into splitpush pressure.",
  ],
  dangerAbilities: ["(Q) vital proc", "(W) parry", "(R) vital challenge"],
  dangerProfile: {
    dangerousWhen: [
      "She can safely hit a vital with (Q).",
      "(W) is available to parry crowd control or burst.",
      "(R) creates an extended duel she can chase through.",
    ],
    mustRespect: [
      "Vitals make even short trades meaningful.",
      "(W) can reverse crowd control and punish predictable engages.",
      "Her side-lane scaling is dangerous if lane stays even.",
    ],
  },
  commonWeaknesses: [
    "Reliant on spacing and vital access.",
    "Punishable if (W) is baited.",
    "Teamfights can be harder than isolated duels.",
  ],
  damageType: "physical",
  hardCrowdControl: ["(W) stun if it parries crowd control"],
  id: "Fiora",
  importantAbilityNotes: [
    "(Q) dashes and procs vitals.",
    "(W) parries damage and disables, then slows or stuns.",
    "(E) empowers the next two attacks.",
    "(R) reveals four vitals and creates healing after completion.",
  ],
  lanePlan: {
    avoids: [
      "Using (W) before the opponent commits key control.",
      "Forcing trades when the vital is hard to access.",
      "Grouping before she has side-lane pressure.",
    ],
    idealLaneState:
      "A long top lane where Fiora can threaten vitals, reset bad vital positions, and force isolated duels with enough space to chase.",
    wants: [
      "Accessible vitals for short trades.",
      "Enemy crowd control committed into (W).",
      "Side-lane isolation after item spikes.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "medium",
    lanePressure: "medium",
    preferredGameState: [
      "Isolated side-lane duels.",
      "Long lanes where she can chase vitals.",
      "Splitpush pressure that forces one enemy to answer.",
    ],
    scalingPriority: "high",
    winLaneBy: [
      "Proccing vitals without taking extended return damage.",
      "Parrying the enemy's key crowd control.",
      "Scaling into side-lane dueling advantage.",
    ],
  },
  majorPowerSpikes: ["Level 6 (R).", "First dueling item.", "Two-item side-lane spike."],
  matchupPreferences: {
    strongInto: [
      "Tanks and melee champions with predictable control.",
      "Low mobility targets that cannot deny vitals.",
      "Side-lane matchups decided by extended duels.",
    ],
    weakInto: [
      "Ranged poke and wave denial.",
      "Unpredictable burst that baits (W).",
      "Champions that avoid isolated duels.",
    ],
  },
  mobilityLevel: "high",
  name: "Fiora",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Level 6",
        reason: "(R) unlocks full duel and healing-zone threat",
        changesGameplay: "Fiora can chase a target through multiple vitals and win longer all-ins.",
        playerAction: "Use (R) when the enemy cannot disengage before enough vitals are hit.",
        enemyResponse: "Hug terrain or disengage to deny vital access.",
      },
      {
        timing: "First dueling item",
        reason: "Damage and sustain make side-lane trades more reliable",
        changesGameplay: "Fiora can punish tanks and bruisers harder when vitals are accessible.",
        playerAction: "Pressure side lane and force the opponent to answer isolated duels.",
        enemyResponse: "Bait (W) first and avoid long isolated fights.",
      },
    ],
  },
  primaryRoles: ["top"],
  primaryTradingPattern:
    "Use (Q) to hit accessible vitals, hold (W) for the opponent's key answer, and extend only when vital access or (R) makes the duel favorable.",
  punishProfile: {
    canPunish: [
      "Predictable crowd control with (W).",
      "Tanks who expose vitals.",
      "Enemies forced into isolated side-lane duels.",
    ],
    strugglesToPunish: [
      "Ranged champions denying vital access.",
      "Targets that bait (W) and disengage.",
    ],
  },
  secondaryRoles: [],
  shields: [],
  softCrowdControl: ["(W) slow", "(E) slow on first hit"],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "splitpush",
    preferredGameLength: "long",
    scalingProfile: "late",
    winMethod: ["side-lane duels", "vital true damage", "splitpush pressure"],
  },
  sustain: ["Passive vital healing", "(R) healing zone"],
  trading: {
    badTradeConditions: [
      "Vital is inaccessible.",
      "(W) is down into crowd control.",
      "The enemy can retreat before multiple vital procs.",
    ],
    goodTradeConditions: [
      "A vital is exposed and (Q) can reach it.",
      "Enemy key crowd control is predictable.",
      "(R) can force a long duel.",
    ],
    primaryPattern:
      "Take short vital trades with (Q), preserve (W) for the enemy's main punish tool, and convert item or level 6 spikes into longer side-lane duels.",
  },
  punishWindows: [
    "After Fiora uses (W), crowd control becomes much easier to land.",
    "When the vital is hard to access, her short trade threat is lower.",
    "Before item spikes, she is less threatening in extended side-lane duels.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
