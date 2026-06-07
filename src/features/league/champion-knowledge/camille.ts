import type { LeagueChampionKnowledgeProfile } from "./types";

export const camilleCombatProfile = {
  profileQuality: "draft",
  abilities: {
    Q: "Precision Protocol",
    W: "Tactical Sweep",
    E: "Hookshot",
    R: "The Hextech Ultimatum",
  },
  archetype: ["diver", "splitpush", "pick", "true damage"],
  primaryWinCondition: [
    "Use controlled short trades until item spikes, then threaten side-lane picks and locked-down all-ins with (E) plus (R).",
  ],
  dangerAbilities: ["(E) engage", "second (Q) true damage", "(R) lockdown"],
  dangerProfile: {
    dangerousWhen: [
      "(E) is available from terrain for long-range engage.",
      "Second (Q) is primed and she can wait for the true-damage timing.",
      "(R) prevents the target from escaping her all-in.",
    ],
    mustRespect: [
      "Terrain changes Camille's threat range.",
      "Second (Q) is the main trade payoff.",
      "(R) can dodge key spells and lock one target in place.",
    ],
  },
  commonWeaknesses: [
    "Can be punished if (E) misses.",
    "Needs item scaling for strongest side-lane threat.",
    "Short early trades can be weaker if she cannot access second (Q).",
  ],
  damageType: "physical",
  hardCrowdControl: ["(E) stun", "(R) target lockdown"],
  id: "Camille",
  importantAbilityNotes: [
    "(Q) has a second cast that becomes true damage after timing.",
    "(W) slows and heals on outer hit.",
    "(E) attaches to terrain and stuns on recast.",
    "(R) traps a target and dodges during cast.",
  ],
  lanePlan: {
    avoids: [
      "Using (E) into champions holding reliable counter-engage.",
      "Taking long early trades before item spikes.",
      "Missing second (Q) timing or wasting it on minions.",
    ],
    idealLaneState:
      "A side-lane top wave near terrain where Camille can threaten (E), take short second-(Q) trades, and later isolate targets with (R).",
    wants: [
      "Terrain angles for (E).",
      "Short trades that land second (Q).",
      "Item spikes that turn side lane into pick pressure.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "medium",
    lanePressure: "medium",
    preferredGameState: [
      "Side lane with wall access.",
      "Short trades around second (Q).",
      "Pick setups where (R) locks a target.",
    ],
    scalingPriority: "high",
    winLaneBy: [
      "Punishing oversteps with (E).",
      "Landing second (Q) and exiting.",
      "Scaling into side-lane picks and splitpush.",
    ],
  },
  majorPowerSpikes: ["Level 6 (R).", "First sheen-style item.", "Two-item side-lane spike."],
  matchupPreferences: {
    strongInto: [
      "Immobile carries or bruisers vulnerable to lockdown.",
      "Side-lane matchups where true damage matters.",
      "Targets that cannot punish missed (E).",
    ],
    weakInto: [
      "Strong early bullies that deny scaling.",
      "Champions that interrupt or punish (E).",
      "Sustained duelists before her item breakpoints.",
    ],
  },
  mobilityLevel: "high",
  name: "Camille",
  offMetaRoles: ["support"],
  powerSpikes: {
    major: [
      {
        timing: "First sheen-style item",
        reason: "Second (Q) damage becomes a reliable trade payoff",
        changesGameplay: "Camille can take sharper short trades and threaten side-lane pressure.",
        playerAction:
          "Play around second (Q) timing and leave before the enemy forces a longer fight.",
        enemyResponse: "Avoid isolated second-(Q) trades and punish (E) cooldown.",
      },
      {
        timing: "Level 6",
        reason: "(R) locks one target and dodges during cast",
        changesGameplay: "Escaping Camille's all-in becomes much harder once (R) is available.",
        playerAction: "Use (R) after key enemy disengage is baited or to guarantee a pick.",
        enemyResponse: "Hold defensive tools until after Camille commits with (E) or (R).",
      },
    ],
  },
  primaryRoles: ["top"],
  primaryTradingPattern:
    "Prepare second (Q), use (E) only when the angle is safe, land the true-damage trade, and disengage before cooldown downtime is punished.",
  punishProfile: {
    canPunish: [
      "Targets near terrain when (E) is ready.",
      "Enemies who cannot avoid second (Q).",
      "Overextended carries once (R) is available.",
    ],
    strugglesToPunish: [
      "Strong early duelists before item spikes.",
      "Champions who interrupt or sidestep (E).",
    ],
  },
  secondaryRoles: [],
  shields: ["Passive adaptive shield"],
  softCrowdControl: ["(W) slow"],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "splitpush",
    preferredGameLength: "long",
    scalingProfile: "late",
    winMethod: ["side-lane picks", "true-damage trades", "target lockdown"],
  },
  sustain: ["Outer (W) healing"],
  trading: {
    badTradeConditions: [
      "(E) misses or is interrupted.",
      "Second (Q) is not ready.",
      "The enemy can force an extended fight before her item spike.",
    ],
    goodTradeConditions: [
      "Passive shield matches the enemy damage type.",
      "Second (Q) timing is ready.",
      "Terrain gives a clean (E) engage or escape path.",
    ],
    primaryPattern:
      "Use passive shield and second (Q) for short trades, reserve (E) for confirmed angles, and turn level 6 or item spikes into locked-down side-lane kills.",
  },
  punishWindows: [
    "After Camille misses (E), her escape and engage are both limited.",
    "Before first item, her side-lane damage is less reliable.",
    "If second (Q) is forced early, her trade payoff drops.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
