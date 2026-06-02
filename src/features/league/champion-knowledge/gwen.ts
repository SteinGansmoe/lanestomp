import type { LeagueChampionKnowledgeProfile } from "./types";

export const gwenCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "high",
  abilities: {
    Q: "Snip Snip!",
    W: "Hallowed Mist",
    E: "Skip 'n Slash",
    R: "Needlework",
  },
  archetype: ["AP duelist", "scaling skirmisher", "splitpush", "teamfight carry"],
  primaryWinCondition: [
    "Reach item spikes, stack (Q) before committing, and use (W) plus (E) to win extended fights in side lane or front-to-back skirmishes.",
  ],
  dangerAbilities: ["(Q) center damage", "(W) untargetable zone", "(R) slow and chase"],
  dangerProfile: {
    dangerousWhen: [
      "(Q) is stacked and she can keep the target in the center.",
      "(W) blocks outside retaliation while she fights inside the mist.",
      "(R) hits multiple casts and lets her keep chasing.",
    ],
    mustRespect: [
      "Her scaling AP damage makes later extended fights much stronger.",
      "(W) changes whether ranged spells can punish her commit.",
      "She becomes more threatening when the fight stays inside her range instead of resetting.",
    ],
  },
  commonWeaknesses: [
    "Limited hard crowd control.",
    "Needs time and spacing to stack and land (Q).",
    "Can be punished before item spikes or when (W) is unavailable.",
  ],
  damageType: "magic",
  hardCrowdControl: [],
  id: "Gwen",
  importantAbilityNotes: [
    "(Q) is strongest when stacked and centered on the target.",
    "(W) makes Gwen untargetable to enemies outside the mist and gives defensive stats.",
    "(E) is her dash and attack steroid.",
    "(R) slows and can be recast after hitting enemies.",
  ],
  lanePlan: {
    avoids: [
      "Committing before (Q) is stacked.",
      "Wasting (W) before the enemy's main retaliation.",
      "Taking short burst trades where she cannot extend.",
    ],
    idealLaneState:
      "A stable top lane where Gwen can stack (Q), use (E) for controlled spacing, and preserve (W) for the enemy's strongest answer.",
    wants: [
      "Extended trades where stacked (Q) and passive healing matter.",
      "Scaling time for AP item spikes.",
      "Side-lane or teamfight spaces where (W) denies outside damage.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "medium",
    lanePressure: "medium",
    preferredGameState: [
      "Extended skirmishes after (Q) is stacked.",
      "Side-lane duels after AP spikes.",
      "Teamfights where (W) lets her fight protected inside the mist.",
    ],
    scalingPriority: "high",
    winLaneBy: [
      "Holding (W) for the enemy's main damage or control.",
      "Using stacked (Q) to punish enemies who stay in melee range.",
      "Reaching item spikes without giving up early kills.",
    ],
  },
  majorPowerSpikes: ["Level 6 (R).", "First AP dueling item.", "Two-item scaling skirmish spike."],
  matchupPreferences: {
    strongInto: [
      "Durable melee champions who must fight inside her range.",
      "Teams relying on outside ranged spells that (W) can deny.",
      "Scaling side-lane matchups where she can reach items.",
    ],
    weakInto: [
      "Strong early burst before she has items.",
      "Disengage that denies stacked (Q) value.",
      "Crowd control timed after (W) or outside her preferred fight zone.",
    ],
  },
  mobilityLevel: "medium",
  name: "Gwen",
  offMetaRoles: ["jungle"],
  powerSpikes: {
    major: [
      {
        timing: "Level 6",
        reason: "(R) adds slow, chase, and multi-cast all-in threat",
        changesGameplay:
          "Gwen can turn extended trades into kills if she keeps landing needles and stays in range.",
        playerAction:
          "Use (R) after setting up the fight with stacked (Q) or enemy cooldowns spent.",
        enemyResponse:
          "Disengage before the recasts and avoid fighting inside (W).",
      },
      {
        timing: "Two-item scaling skirmish spike",
        reason: "AP damage and durability make extended fights much stronger",
        changesGameplay:
          "Neutral side-lane trades can become Gwen-favored if she keeps the fight going.",
        playerAction:
          "Pressure side lane and join fights where (W) can deny outside damage.",
        enemyResponse:
          "Force short trades before she stacks (Q) or wait out (W).",
      },
    ],
  },
  primaryRoles: ["top"],
  primaryTradingPattern:
    "Stack (Q) through the wave, use (E) to control spacing, and commit to extended fights only when (W) can block the enemy's best response.",
  punishProfile: {
    canPunish: [
      "Melee champions who stand in stacked (Q) center damage.",
      "Enemies who spend key spells into (W).",
      "Frontliners who cannot leave her extended fight range.",
    ],
    strugglesToPunish: [
      "Targets who disengage before (Q) is stacked.",
      "Enemies who hold crowd control until after (W).",
    ],
  },
  secondaryRoles: [],
  shields: [],
  softCrowdControl: ["(R) slow"],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "scale",
    preferredGameLength: "long",
    scalingProfile: "late",
    winMethod: ["AP side-lane duels", "extended skirmishes", "protected teamfight DPS"],
  },
  sustain: ["Passive healing from champion damage"],
  trading: {
    badTradeConditions: [
      "(Q) is not stacked.",
      "(W) is down before the enemy's key retaliation.",
      "The enemy can leave before her extended damage matters.",
    ],
    goodTradeConditions: [
      "(Q) is stacked and the enemy must last-hit in melee range.",
      "(W) can block the enemy's main spell angle.",
      "(R) is available for chase after a committed fight starts.",
    ],
    primaryPattern:
      "Prepare (Q) stacks first, dash with (E) for spacing, then use (W) and (R) to keep the enemy in a fight that lasts long enough for Gwen's scaling damage.",
  },
  punishWindows: [
    "Before item spikes, Gwen is easier to pressure with burst or lane control.",
    "When (W) is down, she is much more vulnerable to ranged retaliation.",
    "If (Q) is unstacked, her trade threat is lower.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
